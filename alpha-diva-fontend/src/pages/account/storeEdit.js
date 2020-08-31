import React,{useState,useEffect} from 'react';
import {Box,TextField,Grid,Icon,makeStyles,IconButton,Container,withStyles,Snackbar,Select,MenuItem,InputLabel,Button,CircularProgress} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import Config from '../../includes/config';
import Input from '../../components/textInput';
import md5 from 'md5';
import AddressBox from '../../components/addressBox'

const useStyles = makeStyles((theme) => ({
    icon:{
        color:"rgba(0,0,0,0.3)"
    },
    styleb:{
        fontSize:14,
        fontFamily:"Google Sans",
        marginTop:2,
    },
    button:{
        fontSize:11,
        fontFamily:"Google Sans",
        color:"rgba(0,0,0,0.7)"
    },
    saveBtn:{
        marginTop:50,
        width:'100%',
        height:50,
        color:"white",
        fontFamily:"Google Sans",
        backgroundColor:"red",
        '&:hover':{
            backgroundColor:'#cc080e'
        }
    },
    loader:{
        color:"white"
    },
    modal:{
        backgroundColor:"rgba(0,0,0,0.8)",
        position:"fixed",
        width:"100%",
        height:"100vh",
        zIndex:2000,
        left:0,
        top:0,
        display: "flex", // make us of Flexbox
        alignItems: "center", // does vertically center the desired content
        justifyContent: "center"
    },
    box:{
        backgroundColor:"white",
        borderRadius:10
    },
    modalHead:{
        padding:20,
        backgroundColor:"#F8F8F8",
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        borderBottom:"thin solid rgba(0,0,0,0.05)"
    },
    close:{
        backgroundColor:"white",
        padding:5,
        marginLeft:10
    },
    modalHeader:{
        fontFamily:"Muli",
        fontSize:20,
        fontWeight:800
    },
    modalBody:{
        padding:20,
        textAlign:"center",
        maxHeight:300,
        overflow:"auto",
        '& p':{
            fontSize:14,
            color:"rgba(0,0,0,0.6)"
        },
        '& h3':{
            fontSize:16,
            marginTop:40,
            marginBottom:40,
        }
    },
    submitBtn:{
        width:"100%",
        fontFamily:"Google Sans",
        backgroundColor:"red",
        marginTop:0,
        height:50,
        color:"white"
    },
    storeLogo:{
      width:150,
      height:150,
      padding:0,
      borderRadius:0,
      border:"thin solid #ccc",
      backgroundSize:"cover",
      backgroundRepeat:"no-repeat"
    },
    overlay:{
      width:"100%",
      height:150,
      backgroundColor:"rgba(0,0,0,0.6)",
      display:"grid",
      placeItems:"center",
      color:"white",
    }
}));

  const WhiteTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: 'rgba(0,0,0,0.8)', // Text color
        fontFamily:"Google Sans",
        fontSize:14
      },
      '& .MuiInputLabel-root':{
        fontFamily:"Google Sans"
      },
      '& label':{
        fontSize:12,
      },
      '& label.Mui-focused':{
        color:"#000",
        fontWeight:"bold"
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: 'rgba(0,0,0,0.08)', // Semi-transparent underline
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: '#000', // Solid underline on hover
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#000', // Solid underline on focus
      },
    },
  })(TextField);


  const BlackSelect = withStyles({
    root: {
      '& .MuiSelect-select': {
        color: 'rgba(0,0,0,0.8)', // Text color
        fontFamily:"Google Sans",
        fontSize:14,
        backgrondColor:"red",
        display:"none !important"
      },
      '& .MuiInputLabel-root':{
        fontFamily:"Google Sans"
      },
      '& label':{
        fontSize:12
      },
      '& label.Mui-focused':{
        color:"#000",
        fontWeight:"bold"
      },
      '& .MuiSelect-underline:before': {
        borderBottomColor: 'rgba(0,0,0,0.08)', // Semi-transparent underline
      },
      '& .MuiSelect-underline:hover:before': {
        borderBottomColor: '#000', // Solid underline on hover
      },
      '& .MuiSelect-underline:after': {
        borderBottomColor: '#000', // Solid underline on focus
      },
    },
  })(Select);


const _homeService  = ['-- select your choice --','Yes','No'];
const  _averageIncome = ['-- select your choice --','£100 - £500','£501 - £999','£1000 - £2999','£3000 - £6999','£7000+'];

function App(){
    var _user = JSON.parse(localStorage.getItem("user"));
    const [user, setuser] = useState(_user);
    const classes = useStyles();
    const [business_name, setbusiness_name] = useState(user.business_name);
    const [homeService, sethomeService] = useState(user.home_service);
    const [averageIncome, setaverageIncome] = useState(user.month_income);
    const [businessLocation, setbusinessLocation] = useState(user.businessLocation);
    const [lat, setlat] = useState(0);
    const [lng, setlng] = useState(0);

    const [num_employess, setnum_employess] = useState(user.num_employess);
   
    const [phone, setphone] = useState(user.phone);
    const [email, setemail] = useState(user.email);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
    const [password, setpassword] = useState("");
    const [modal, setmodal] = useState(false);
    const [modalTitle, setmodalTitle] = useState("Change Email address");
    const [submit, setsubmit] = useState(true);
    const [title, settitle] = useState("");
    const [caption, setcaption] = useState("");
    const [oldpassword, setoldpassword] = useState("");
    const hiddenFileInput = React.useRef(null);

    useEffect(() => {
      window.scrollTo(0,0);
    }, []);

    async function update(){

        if(business_name.trim().length > 0 && homeService.trim().length > 0 && businessLocation.trim().length>0 && averageIncome.trim().length > 0&& num_employess > 0){
           
            var data=user;

            data.business_name = business_name;
            data.home_service = homeService;
            data.month_income = averageIncome;
            data.businessLocation = businessLocation;
            data.storelat = lat === 0 ? data.storelat : lat;
            data.storelng = lng === 0 ? data.storelng : lng;
           

           try {
            setloading(true);
            var request = await  axios.post(Config.apiBaseUrl+'/auth/updatePartnerAccount/',{data},{withCredentials: true});
            setloading(false);
            if(request.status === 200){
                seterror(true);
                seterrorMessage("Business info updated");
                localStorage.setItem("user", JSON.stringify(data));
              
                setTimeout(function(){ 
                  window.location.reload(false);
                 }, 2000);

            }else{
                seterror(true);
                seterrorMessage("Oops! an error occured, try again later");
            }
           } catch (error) {
            seterrorMessage("Oops! an error occured, try again later");
            seterror(true);
            setloading(false);
           }

        }else{
            seterror(true);
            seterrorMessage("All fields required");
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

        data.append('previousStoreLogo',user.storeLogo);

        try {

          const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
          }

          const request = await axios.put(Config.apiBaseUrl+'/auth/uploadStoreLogo/', data,{withCredentials: true},config);
          setloading(false);
          if(request.status == 200){
            seterror(true);
            seterrorMessage("Your gallery has been updated");
            var _user = user;
            _user.storeLogo = request.data;
            setuser(_user);
            localStorage.setItem("user", JSON.stringify(_user));
            //console.log(request.data);
            setTimeout(function(){ 
              window.location.reload(false);
             }, 2000);
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

  async function getUserLocation(){
    navigator.geolocation.getCurrentPosition(async (position) => {

      setlat(position.coords.latitude);
      setlng(position.coords.longitude);

      
      try {
        var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${Config.mapsApiKey}`;
        var request = await axios.get(url);
        var results = request.data;
        
        console.log(results);

        var address = results.results[0].formatted_address;
        setbusinessLocation(address);
      } catch (error) {
        //console.error("Connection failed");
      }

      
      
      //var path = '/search/near_me/'+position.coords.latitude+'/'+position.coords.longitude+'/0';
      //history.push(path);
    });
  }

    return(
        <Box>
           
            <h3 style={{marginTop:30}}>Edit business info</h3>

            <Box style={{marginTop:50}}>
               
                <center>
                       <Button style={{backgroundImage:`url(${Config.apiEndPoint+''+user.storeLogo.replace('public/','')})`}} className={classes.storeLogo} onClick={handleClick}>
                          <div className={classes.overlay}>
                             {!loading ? <Icon>linked_camera</Icon> : <CircularProgress style={{color:"white"}}></CircularProgress>}
                          </div>
                       </Button>
                       <input type="file" onChange={handleChange}  style={{display:"none"}} ref={hiddenFileInput}/>
                       <p>Store Logo</p>
                </center>
                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>admin_panel_settings</Icon>
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <WhiteTextField label="Business Name" onChange={(e)=>{setbusiness_name(e.target.value)}} value={business_name} fullWidth/>
                  </Grid>
                </Grid>
                
                
                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>supervisor_account</Icon>
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <WhiteTextField type="number" label="Number of employees" onChange={(e)=>{setnum_employess(e.target.value)}} value={num_employess} fullWidth/>
                  </Grid>
                </Grid>


                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                        <Grid item>
                            <Icon className={classes.icon}>attach_money</Icon>
                        </Grid>
                        <Grid item xs={11} sm={11} md={11}>
                            <InputLabel style={{ fontSize:12}} shrink id="demo-simple-select-placeholder-label-label">
                                Average Monthly Income
                            </InputLabel>
                            <BlackSelect className={classes.styleb} label="Average Monthly Income" fullWidth value={averageIncome} onChange={(e)=>{setaverageIncome(e.target.value)}}>
                                {_averageIncome.map((income)=>
                                <MenuItem style={{fontFamily:"Google Sans"}} value={income.toUpperCase()}>{income.toUpperCase()}</MenuItem>
                                )}
                            </BlackSelect>
                        </Grid>
                </Grid>

                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                        <Grid item>
                            <Icon className={classes.icon}>home</Icon>
                        </Grid>
                        <Grid item xs={11} sm={11} md={11}>
                            <InputLabel style={{ fontSize:12}} shrink id="demo-simple-select-placeholder-label-label">
                               Do you offer home service?
                            </InputLabel>
                            <BlackSelect className={classes.styleb} label="Do you offer home service?" fullWidth value={homeService} onChange={(e)=>{sethomeService(e.target.value)}}>
                                {_homeService.map((service)=>
                                <MenuItem style={{fontFamily:"Google Sans"}} value={service.toUpperCase()}>{service.toUpperCase()}</MenuItem>
                                )}
                            </BlackSelect>
                        </Grid>
                </Grid>
           
                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>location_on</Icon>
                  </Grid>
                  <Grid item xs={8} sm={10}>
                    {/* <WhiteTextField label="Current Location"  disabled={true}  value={businessLocation} fullWidth/> */}
                    <InputLabel style={{ fontSize:12}} shrink id="demo-simple-select-placeholder-label-label">
                              Business Location
                            </InputLabel>

                    <AddressBox searchPage={true} style={{border:"none",borderBottom:"thin solid black",outline:"none",borderRadius:0}} suggestion={(address,lat,lng)=>{
                            setlat(lat);
                            setlng(lng);
                            setbusinessLocation(address);
                            //setlocationError(false);
                        }} initialaddress = {businessLocation}/>

                  </Grid>
                  <Grid item xs={1} sm={1}>
                      <center><IconButton onClick={getUserLocation}><Icon>my_location</Icon></IconButton></center>
                  </Grid>
                </Grid>
                
                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                       
                        
                </Grid>

                 
               
                <Grid container>
                    <Grid xs={12}>
                        <Button disabled={loading} className={classes.saveBtn} onClick={update}>{!loading? "SAVE CHANGES" : <CircularProgress className={classes.loader} size={20} /> }</Button>
                    </Grid>
                </Grid>

            </Box>



            <Snackbar style={{zIndex:5000}} open={error} autoHideDuration={6000} onClose={()=>{
                seterror(false);
            }}>
            <Alert variant="filled" severity={errorMessage.includes("Oops")  ? "error" : "success"} onClose={()=>{
                seterror(false);
            }}>
                {errorMessage}
            </Alert>
            </Snackbar>

            {/* modal starts here */}

            {modal ? 
            <Box className={classes.modal}>
            <Container maxWidth="xs">
                <Grid container>
                    <Grid xs={10} className={classes.box}>
                        <Box className={classes.modalHead}>
                            <h2 className={classes.modalHeader}>{modalTitle}</h2>
                        </Box>
                        <Box className={classes.modalBody}>
            <p>{title}</p>
            <h3>{caption}</h3>

                            {modalTitle.indexOf("Email") > - 1 ? 
                            <Input type="email" labe="" value={email} onTextChange={(e)=>{
                                setemail(e.value);
                                setsubmit(false);
                            }} placeholder="Email"/> : null}

                            {modalTitle.indexOf("Phone") > - 1 ? 
                            <Input type="phone" labe="" value={phone} onTextChange={(e)=>{
                                setphone(e);
                                setsubmit(false);
                            }} placeholder="Phone Number"/> : null}

                            {modalTitle.indexOf("password") > - 1 ? 
                            <div>
                                <Input type="password" label="Old password" value={oldpassword} onTextChange={(e)=>{
                                setoldpassword(e.value);
                                setsubmit(false);
                            }} placeholder="Old Password"/> 
<br/>
                        <Input showPass="show" type="password" label="New password" value={password} onTextChange={(e)=>{
                                setpassword(e.value);
                                setsubmit(false);
                            }} placeholder="New Password"/> 
                            </div>: null}

                            
                        </Box>
                        <Box style={{padding:20}}>
                            
                        <Button disabled={submit} onClick={()=>{
                                update();
                            }} className={classes.submitBtn}>SUBMIT</Button>
                        </Box>
                    </Grid>
                    <Grid xs={1}>
                            <IconButton className={classes.close} onClick={()=>{setmodal(false)}}><Icon>close</Icon></IconButton>
                    </Grid>
                </Grid>
            </Container>
            </Box> : null}

            {/* modal ends here */}

        </Box>
    )
};

export default App;