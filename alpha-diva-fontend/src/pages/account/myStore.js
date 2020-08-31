import React,{useState,useEffect} from 'react';
import {Box,withStyles,Grid,Icon,Paper,makeStyles,Button,Table,TableContainer,CircularProgress,Snackbar,TableHead,TableRow,TableBody,TableCell,TablePagination} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import Config from '../../includes/config';
import {Link,Redirect,useHistory} from "react-router-dom";
import 'react-bnb-gallery/dist/style.css'
import ReactBnbGallery from 'react-bnb-gallery';


  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
  
  


const useStyles = makeStyles((theme) => ({
    info:{
        fontSize: 14,
        // lineHeight:0.5,
    },
    link:{
     color: "red",
     textDecoration:"none"   
    },
    businessHours:{
      fontSize: 14,
      // lineHeight:0.5,
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
      border:"1px solid #ccc !mportant",
      borderRadius:0,
      borderStyle:"dashed !important"
    },
    pic:{
      borderRadius:0,
      backgroundColor:"rgb(222,226,230,0.5)",
      backgroundSize:"cover",
      backgroundRepeat:"no-repeat",
      boxShadow:"none",
      color:"white",
      padding:0
    },
    overlay:{
      backgroundColor:"rgba(0,0,0,0.3)",
      width:"100%"
    },
    verifyNotice:{
      borderStyle:"dotted",
      borderColor:"rgb(247,183,9,0.7)",
      backgroundColor:"rgb(247,183,9,0.1)",
      padding:10,
      fontSize:12
    }
}));

const images = [
  {
    thumb: '',
    large: ''
  },
  {
    thumb: '',
    large: ''
  },
  {
    thumb: '',
    large: ''
  }
]



function App(){
  const history = useHistory();
    const [userDetails, setuserDetails] = useState([]);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [_businessHours, setbusinessHours] = useState([]);
    const [_images, set_images] = useState(images);
    const [total_images, settotal_images] = useState(0);
    const hiddenFileInput = React.useRef(null);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [_open_gallery, set_open_gallery] = useState(false);
    const [_photos, set_photos] = useState([]);
    const [errorMessage, seterrorMessage] = useState("");
    const [imageActiveIndex, setimageActiveIndex] = useState(0);
    const [rows, setRows] = useState([]);
    const [amount, setAmount] = useState(0);    


    function createData(name, calories, fat, carbs, protein) {
      return { name, calories, fat, carbs, protein };
    }
    
    

    const handleChangePage = (event, newPage) => {
      //console.log(newPage);
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem("user"));
        setuserDetails(user);
        //console.log(user);

        fetchBusinessWorkingHourse(user);
        fetchUserGallery(user);
        fetchTransactions();
        window.scrollTo(0,0);
    }, []);
    
   
    async function fetchBusinessWorkingHourse(user){

      var request = await  axios.get(Config.apiBaseUrl+'/auth/fetchCustomerBusinessHours/'+user.accountId,{withCredentials: true});
      var newData = JSON.stringify(request.data);
      var hours = request.data;
      hours.forEach((hour) => {
        hour.to = hour.to.split(":");
        hour.from = hour.from.split(":");
        hour.to = tConvert(hour.to[0]+":"+hour.to[1]);
        hour.from = tConvert(hour.from[0]+":"+hour.from[1]);
      })
      setbusinessHours(hours);
       localStorage.setItem("businessWorkingHours",newData);
    }

    async function fetchUserGallery(user){
      //http://localhost:4000/api/auth/fetchGallery/P-GRA0005
      var url = Config.apiBaseUrl+'/auth/fetchGallery/'+user.accountId;
      //console.log(url);
      var request = await axios.get(url,{withCredentials: true});
      var uploaded_images = request.data;
      
      var new_images = _images;
      if(uploaded_images.length > 0){
        settotal_images(uploaded_images.length);

        var photos = [];
        uploaded_images.forEach((image) => {
          image.large = Config.apiEndPoint+''+image.large.replace('public/','');
          photos.push(image.large);
        })

        uploaded_images = uploaded_images.slice(0,3);
        
          uploaded_images.forEach((image) => {
            image.thumb = Config.apiEndPoint+''+image.thumb.replace('public/','');
            image.large = Config.apiEndPoint+''+image.large.replace('public/','');
          })
          uploaded_images = [...uploaded_images].reverse();
          new_images = new_images.concat(uploaded_images);
          //console.log(new_images);
          new_images = [...new_images].reverse();
          //console.log(new_images);
          new_images = new_images.slice(0,3);
         
          set_photos(photos);
          set_images(new_images);
      }
      //setbusinessHours(hours);
    }

    async function fetchTransactions(){
      try {
        var transactions = rows;

        var url = Config.apiBaseUrl+'/auth/fetchTransactions/';
        const request = await axios.get(url,{withCredentials:true});

        if(request.status == 200){
          var amount = 0.00;
           request.data.forEach((transaction)=>{
             var row = createData(transaction.description, transaction.amount, new Date(transaction.date).toDateString(), transaction.status);
             transactions.push(row);
             amount = amount + Number(transaction.amount);
           })
           
           setRows(transactions);
           setAmount(amount);
        }

      } catch (error) {
        
      }
    }

    function tConvert (time) {
      // Check correct time format and split into components
      time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    
      if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join (''); // return adjusted time or original string
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


    return(
        <Box>
            
          {userDetails.verified === "NO" ? <Paper elevation={0} className={classes.verifyNotice} square>
              We are reviewing your store, this process can take 2 - 3 business working days so stay tuned!. We will notify you once we done.
          </Paper> : null}
            <h1>Welcome {userDetails.bac_holder_name} !</h1>
            <h3 style={{marginTop:30,fontWeight:100}}>My Store</h3>
            <hr/>
            <Grid container>
                <Grid item xs={12} md={6}>
                   <h4>Business information</h4>
                    <div className={classes.info}>
                        <p>{userDetails.business_name}</p>
                        <p>{userDetails.accountId}</p>
                        <p>offer home service?: <strong>{userDetails.home_service}</strong></p>
                        <p> number of employees: <strong>{userDetails.num_employess}</strong></p>
                        <p>monthly income: <strong>{userDetails.month_income}</strong></p>
                        <Link to="/account/store_edit"  className={classes.link}>Edit</Link> <span className={classes.link}>|</span> <Link to="/account/settings" className={classes.link}>Change password</Link>
                    </div>
                </Grid>

                <Grid item xs={12} md={6}>
                   <h4>Contact information</h4>
                    <div className={classes.info}>
                        <p>{userDetails.email}</p>
                        <p>{userDetails.phone}</p>
                        <p>{userDetails.businessLocation}</p>
                        <Link to="/account/settings" className={classes.link}>Edit</Link>
                    </div>
                </Grid>

               {_businessHours.length < 1 ? 
                <Grid item xs={12} className={classes.setHours}>
                  <Icon>access_alarm</Icon>
                  <div>
                    <p style={{fontSize:14}}>Setting up your business hours helps people<br/>to know when you are available </p>
                  </div>
                  <Link to="/account/set_business_hours" style={{textDecoration:"none"}}><Button className={classes.setHoursBtn}>SET HOURS</Button></Link>
                </Grid>
               :
                <Grid item xs={12} md={6}>
                   <h4>Business hours </h4>
                   <div className={classes.info}>
                    <Link to="/account/set_business_hours" className={classes.link}>Edit</Link>
                  </div>
                    {_businessHours.map((hours,index)=>
                    <Grid key={index} container className={classes.businessHours}>
                    <Grid  item xs={6}>
                       <p className={classes.day}>{hours.day}: </p>
                    </Grid>
                    <Grid  item xs={6}>
                     {hours.closed == 'false' ? <p>{hours.from} - {hours.to}</p> : <p>Closed</p>}
                    </Grid>
                  </Grid>)}
                </Grid>
                }
            </Grid> 

            
            <h4>Gallery</h4>
            <hr/>
            <Grid container>
              <Grid item xs={6} md={3} style={{marginTop:2}} >
                <Button disabled={loading} style={{padding:45,width:"100%"}} onClick={handleClick} className={classes.addPicBtn}>
                   {!loading ? <Icon>add</Icon> :<CircularProgress size={20} style={{color:"black"}}></CircularProgress>}
                </Button>
                <input type="file" multiple onChange={handleChange}  style={{display:"none"}} ref={hiddenFileInput}/>
              </Grid>
              {_images.map((image,index)=>
              <Grid key={index}  item xs={6} style={{marginTop:2}} md={3}>
                <Button onClick={()=>{
                  if(total_images > 3 && index == 2){
                    var path = '/account/gallery';
                    history.push(path); 
                    return;
                  }
                  set_open_gallery(true);
                  setimageActiveIndex(index);
                }} className={classes.pic} style={{backgroundImage:`url(${image.thumb})`,width:"99%",marginLeft:'3px'}}>
                  {total_images >  3 && index ==2 ?
                   <div style={{paddingTop:42,paddingBottom:42}} className={classes.overlay}>
                     <Button style={{color:"white"}}>SEE ALL <Icon>navigate_next</Icon></Button>
                   </div>
                  : <div style={{padding:60}}></div>}   
                </Button>
              </Grid>
              )}

            <ReactBnbGallery
              activePhotoIndex	={imageActiveIndex}
              show={_open_gallery}
              photos={_photos}
              onClose={() => set_open_gallery(false)}
            />

            </Grid>

            <h3 style={{marginTop:30,fontWeight:100}}>Account & Settings</h3>
            <hr/>
            <Grid container>
                <Grid item xs={12} md={6}>
                   <h4>Payment information</h4>
                    <div className={classes.info}>
                        <p>{userDetails.bac_holder_name}</p>
                        <p>{userDetails.name_of_bank}</p>
                        <p>********{userDetails.bank_acc ? userDetails.bank_acc.substring(userDetails.bank_acc.length - 4, userDetails.bank_acc.length) : null}</p>
                        <p> sort code: <strong>{userDetails.bank_sort_code}</strong></p>
                        <Link to="/account/settings" className={classes.link}>Edit</Link>
                    </div>
                </Grid>

            </Grid>

            <h3 style={{marginTop:30,fontWeight:100}}>My Wallet</h3>
            <hr/>

           <Grid container>
                <Grid item xs={6} md={6}>
                <div >
                     <p style={{fontSize:14}}>Account Balance</p>
                </div>
                </Grid>
                <Grid item xs={6} md={6} >
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div></div>
                  <h4>£ {amount}</h4>
                    </div>
                    
                </Grid>


            </Grid>
            <h3 style={{marginTop:30,fontWeight:100}}>All transactions</h3>

           
            <TableContainer>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
                        return (
                            <TableRow key={row.name} key={index}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">£ {row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right"><span style={{fontSize:10,backgroundColor:"#07d755",borderRadius:3,color:"white",padding:5}}>{row.carbs}</span></TableCell>
                            </TableRow>
                        );
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
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