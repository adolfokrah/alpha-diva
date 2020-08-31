import React,{useState,useEffect,useCallback} from 'react';
import {Box,withStyles,Grid,Icon,makeStyles,Button,Table,TableContainer,CircularProgress,Snackbar,TableHead,TableRow,TableBody,TableCell,TablePagination} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import Config from '../../includes/config';
import {Link,Redirect,useHistory} from "react-router-dom";
import 'react-bnb-gallery/dist/style.css'
import ReactBnbGallery from 'react-bnb-gallery';
import Gallery from "react-photo-gallery";
import DialogBox from '../../components/dailgos';

  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];


const useStyles = makeStyles((theme) => ({
    info:{
        fontSize: 14,
        lineHeight:0.5,
    },
    link:{
     color: "red",
     textDecoration:"none"   
    },
    businessHours:{
      fontSize: 14,
      lineHeight:0.5,
    },
    setHours:{
      backgroundColor:"rgb(243,240,226,0.8)",
      textAlign:"center",
      marginTop:20,
      padding:15
    },
    setHoursBtn:{
      backgroundColor:"white",
      border:"2px solid black",
      fontWeight:"bold",
      borderRadius:0,
      fontSize:12,
      width:150,
      '&:hover':{
        backgroundColor:"rgb(236,0,0,0.1)"
      }
    },
    addPicBtn:{
      height:125,
      width:125,
      border:"2px solid #000",
      borderRadius:0,
      borderStyle:"dashed"
    },
    pic:{
      height:125,
      width:125,
      borderRadius:0,
      backgroundColor:"rgb(222,226,230,0.5)",
      backgroundSize:"cover",
      backgroundRepeat:"no-repeat",
      boxShadow:"none",
      color:"white",
      padding:0
    },
    overlay:{
      height:125,
      width:125,
      lineHeight:8,
      backgroundColor:"rgba(0,0,0,0.3)"
    },
    edit:{
        backgroundColor:"red",
        color:"white"
    },
    image:{
        backgroundSize:"cover",
        backgroundRepeat:"no-repeat",
        cursor:"pointer",
        margin:'2px'
    },
    overlay:{
        opacity:0,
        backgroundColor:"rgba(0,0,0,0)",
        transition:"0.6s",
        display:'grid',
        placeItems:"center",
        '&:hover':{
            opacity:1,
            backgroundColor:"rgba(0,0,0,0.5)",
        }
    },
    btn:{
        color:"white",
        
    }
}));




function App(){
  const history = useHistory();
    const [userDetails, setuserDetails] = useState([]);
    const classes = useStyles();
    const [_images, set_images] = useState([]);
    const [total_images, settotal_images] = useState(0);
    const hiddenFileInput = React.useRef(null);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [_open_gallery, set_open_gallery] = useState(false);
    const [_photos, set_photos] = useState([]);
    const [errorMessage, seterrorMessage] = useState("");
    const [imageActiveIndex, setimageActiveIndex] = useState(0);
    const [_delete, set_delete] = useState(false);
    const [gId, setgId] = useState(0);
    

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem("user"));
        setuserDetails(user);
        //console.log(user);

        fetchUserGallery(user);
        window.scrollTo(0,0);
    }, []);
    
   

    async function fetchUserGallery(user){
      //http://localhost:4000/api/auth/fetchGallery/P-GRA0005
      var url = Config.apiBaseUrl+'/auth/fetchGallery/'+user.accountId;
      console.log(url);
      var request = await axios.get(url,{withCredentials: true});
      var uploaded_images = request.data;
      
      if(uploaded_images.length > 0){

        var photos = [];
        uploaded_images.forEach((image) => {
          image.large = Config.apiEndPoint+''+image.large.replace('public/','');
          image.src = Config.apiEndPoint+''+image.thumb.replace('public/','');
          image.width = Number(image.width);
          image.height = Number(image.height);
          photos.push(image.large);
        })
          set_photos(photos);
          set_images(uploaded_images);
      }
      //setbusinessHours(hours);
    }


    async function _deleteImage(){
        const photoId = gId;
        setloading(true);
        set_delete(false);
        try {
            const request = await axios.post(Config.apiBaseUrl+'/auth/deleteImageFromGallery/',{imageId:photoId},{withCredentials:true});
            setloading(false);
            if(request.status == 200){
              seterror(true);
              seterrorMessage("The image has been deleted");

              fetchUserGallery(userDetails);

            }else{
              seterror(true);
              seterrorMessage("Oops!, Couldn't delete image, try again later");
            }

        } catch (error) {
            seterror(true);
            setloading(false);
            seterrorMessage("Oops!, Couldn't upload image, try again later");
        }
    }


    const handleClick = event => {
      hiddenFileInput.current.click();
    };
    const  handleChange = async (event)  => {
      if(event.target.files.length > 0){
        const files = event.target.files;
      
        
  
        var extensions = ['JPG','PNG','jpg','png','JPEG','jpeg'];


        if(files.length > 5){
          seterror(true);
          seterrorMessage("Oops!, Only 5 images can be uploaded at a time");
          return;
        }
        var upload = true;

        for (let index = 0; index < files.length; index++) {
          var fileExtens = files[index].name.split('.');
            if(!(extensions.includes(fileExtens[fileExtens.length-1]))){
              seterror(true);
              seterrorMessage("Oops!, All files should be either a JPEG or PNG Image");
              upload = false;
              break;
            }
        }

       
        if(upload === true){
          setloading(true);
          const data = new FormData() 
          
          for (let index = 0; index < files.length; index++) {
           
            data.append("file", files[index]);
          }

                   

          try {

            const config = {
              headers: {
                  'content-type': 'multipart/form-data'
              }
            }

            const request = await axios.put(Config.apiBaseUrl+'/auth/uploadImageToGallery/', data,{withCredentials: true},config);
            setloading(false);
            if(request.status == 200){
              seterror(true);
              seterrorMessage("Your gallery has been updated");

              fetchUserGallery(userDetails);

            }else{
              seterror(true);
              seterrorMessage("Oops!, Couldn't upload image, try again later");
            }
          } catch (error) {
            console.log(error);
            seterror(true);
            setloading(false);
            seterrorMessage("Oops!, Couldn't upload image, try again later");
          }
        }

      }
    };

    const handleOnClick = (index) => {
        console.log(index);
      };

    const imageRenderer = useCallback(
        ({ index, left, top, key, photo }) => (
           <div className={classes.image}  style={{backgroundImage:`url(${photo.src})`, height: photo.height, width: photo.width}}>
               {/* <img src={photo.src} style={{width:"100%"}}  onClick={()=>{handleOnClick(index)}}/> */}
               <div className={classes.overlay} style={{width:photo.width,height: photo.height}}>
                   <div style={{display:"flex",flexDirection:"column"}}>
                       <Button className={classes.btn} onClick={()=>{
                           set_open_gallery(true);
                           setimageActiveIndex(index);
                       }}><Icon>remove_red_eye</Icon></Button>
                       <Button className={classes.btn} onClick={()=>{
                           set_delete(true);
                           setgId(photo.gId);
                       }}><Icon>delete_forever</Icon></Button>
                   </div>
               </div>
           </div>
        ),
        []
      );


    return(
        <Box>
             <Box style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between"}}>
            <h4 style={{marginTop:30,fontWeight:100}}>My Gallery</h4>
            <Button disabled={loading} className={classes.edit} onClick={handleClick}>{!loading? <Icon>cloud_upload</Icon>  : <CircularProgress className={classes.loader} size={20} /> }</Button>
            <input type="file" multiple onChange={handleChange}  style={{display:"none"}} ref={hiddenFileInput}/>
            </Box><hr/>
            <Gallery photos={_images}  renderImage={imageRenderer} />
            <ReactBnbGallery
             
              activePhotoIndex	={imageActiveIndex}
              show={_open_gallery}
              photos={_photos}
              onClose={() => set_open_gallery(false)}
            />

            <DialogBox open={_delete} handleClose={()=>{set_delete(false)}} handleOkay={_deleteImage} title={"Are you sure you want to delete this image?"} message={"You won't be able to access this image anymore once deleted"} noText={"No, don't delete"} okayText={"Okay, delete"}/>

            <Snackbar style={{zIndex:5000}} open={error} autoHideDuration={6000} onClose={()=>{
                seterror(false);
            }}>
            <Alert variant="filled" severity={errorMessage.includes("Oops")  ? "error" : "success"} onClose={()=>{
                seterror(false);
            }}>
                {errorMessage}
            </Alert>
            </Snackbar>

        </Box>
    )
};

export default App;