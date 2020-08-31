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


const hairTypes  = ['-- Select Hair Type --','Straight hair','Wavy Hair','Curly Hair','Coily Hair','Afro Hair'];
function App(props){
    const classes = useStyles();
    const [firstName, setfirstName] = useState(props.user.first_name);
    const [lastName, setlastName] = useState(props.user.last_name);
    const [address, setaddress] = useState(props.user.residential_address);
    const [age, setage] = useState(props.user.age);
    const [hairtype, sethairtype] = useState(props.user.hairtype);
    const [phone, setphone] = useState(props.user.phone);
    const [email, setemail] = useState(props.user.email);
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
    const [lat, setLat] = useState(props.user.lat);
    const [lng, setLng] = useState(props.user.lng);

    useEffect(() => {
      window.scrollTo(0,0);;
    }, []);

   async function update(){

        if(firstName.trim().length > 0 && lastName.trim().length > 0 && address.trim().length>0 && age > 0  && phone.trim().length > 0 && email.trim().length > 0){
            var select = hairtype.indexOf("SELECT");
            if(select > -1){
                seterrorMessage("Oops! Please select your hair type");
                seterror(true);
                return;
            }
            
            if(isNaN(age)){
                seterror(true);
                seterrorMessage("Oops! Your age must be a valid");
                return;
            }

            if(/\d/.test(firstName) || /\d/.test(lastName)){
                seterror(true);
                seterrorMessage("Oops! Both firs and last names should not contain numbers");
                return;
                
            }

            console.log(phone);
            for (let index = 0; index < phone.length; index++) {
                if('12345667890+ '.indexOf(phone[index]) < 0){
                    seterror(true);
                    seterrorMessage("Oops! Please enter a valid number");
                    return; 
                }
            }

            if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
                    seterror(true);
                    seterrorMessage("Oops! Please enter a valid email");
                    return; 
            }

            if(oldpassword.length > 0 && password.length < 5){
                seterror(true);
                seterrorMessage("Oops! Password should be more than 5 characters");
                setoldpassword("")
                return; 
            }
            


            if(password.toUpperCase() === lastName.toUpperCase() || password.toUpperCase() === firstName.toUpperCase() ){
                    seterror(true);
                    seterrorMessage("Oops! Password cannot be the same as your first or last name");
                    return; 
            }

            if(md5(oldpassword) != props.user.password && oldpassword.length > 0){
                setoldpassword("")
                seterror(true);
                seterrorMessage("Oops! Old password is incorrect");
                return; 
            }

            setoldpassword("")
            setpassword("")
            setmodal(false);

            var data=props.user;

            data.first_name = firstName;
            data.last_name = lastName;
            data.email = email;
            data.phone = phone;
            data.age = age;
            data.residential_address = address;
            data.hairtype = hairtype;
            data.password = password.length > 0 ? md5(password) : data.password;
            data.lat = lat;
            data.lng =  lng;

           try {
            setloading(true);
            var request = await  axios.post(Config.apiBaseUrl+'/auth/updateCustomerAccount/',{data},{withCredentials: true});
            setloading(false);
            if(request.status === 200){
                seterror(true);
                seterrorMessage("Profile updated");
                localStorage.setItem("user", JSON.stringify(data));
            }else if(request.status === 201){
              seterror(true);
              seterrorMessage("Oops! email already exist");
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
            seterrorMessage("Oops! All fields required");
        }
    }

      
  async function getUserLocation(){
    navigator.geolocation.getCurrentPosition(async (position) => {

      setLat(position.coords.latitude);
      setLng(position.coords.longitude);

      
      try {
        var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${Config.mapsApiKey}`;
        var request = await axios.get(url);
        var results = request.data;
        
        console.log(results);

        var address = results.results[0].formatted_address;
        setaddress(address);
      } catch (error) {
        //console.error("Connection failed");
      }

      
      
      //var path = '/search/near_me/'+position.coords.latitude+'/'+position.coords.longitude+'/0';
      //history.push(path);
    });
  }

    return(
        <Box>
            <h1>Account & Settings</h1>
            <h3 style={{marginTop:30}}>Account Details</h3>

            <Box style={{marginTop:50}}>
                <Grid  container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>perm_identity</Icon>
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <WhiteTextField label="Fist Name" onChange={(e)=>{setfirstName(e.target.value)}} value={firstName} fullWidth/>
                  </Grid>
                </Grid>

                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>perm_identity</Icon>
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <WhiteTextField label="Last Name" onChange={(e)=>{setlastName(e.target.value)}} value={lastName} fullWidth/>
                  </Grid>
                </Grid>

                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>add_location_alt</Icon>
                  </Grid>
                  <Grid item xs={10} sm={11}>
                  <InputLabel style={{ fontSize:12}} shrink id="demo-simple-select-placeholder-label-label">
                              Business Location
                            </InputLabel>

                    <AddressBox searchPage={true} style={{border:"none",borderBottom:"thin solid #ccc",fontSize:12,outline:"none",borderRadius:0}} suggestion={(address,lat,lng)=>{
                            setLat(lat);
                            setLng(lng);
                            setaddress(address);
                            //setlocationError(false);
                        }} initialaddress = {address}/>
                  </Grid>
                </Grid>

                

                <Grid container>
                    <Grid xs={12} md={6}>

                    <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                        <Grid item>
                            <Icon className={classes.icon}>card_giftcard</Icon>
                        </Grid>
                        <Grid item xs={10}>
                            <WhiteTextField label="Age" type="number" onChange={(e)=>{setage(e.target.value)}} value={age} fullWidth/>
                        </Grid>
                    </Grid>

                    </Grid>

                    <Grid xs={12} md={6}>

                    <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                        <Grid item>
                            <Icon className={classes.icon}>pregnant_woman</Icon>
                        </Grid>
                        <Grid item xs={10} sm={11} md={10}>
                            <InputLabel style={{ fontSize:12}} shrink id="demo-simple-select-placeholder-label-label">
                                Hair Type
                            </InputLabel>
                            <BlackSelect className={classes.styleb} label="Hair Type" fullWidth value={hairtype} onChange={(e)=>{sethairtype(e.target.value)}}>
                                {hairTypes.map((hair)=>
                                <MenuItem style={{fontFamily:"Google Sans"}} value={hair.toUpperCase()}>{hair.toUpperCase()}</MenuItem>
                                )}
                            </BlackSelect>
                        </Grid>
                    </Grid>

                    </Grid>

                </Grid>
                <Grid container>
                    <Grid xs={12}>
                        <Button disabled={loading} className={classes.saveBtn} onClick={update}>{!loading? "SAVE CHANGES" : <CircularProgress className={classes.loader} size={20} /> }</Button>
                    </Grid>
                </Grid>
            
            </Box>

            <h3 style={{marginTop:60}}>Settings</h3>

            <Box style={{marginTop:50}}>

                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>phone</Icon>
                  </Grid>
                  <Grid item xs={7} sm={9} >
                    <WhiteTextField disabled label="Phone Number"  value={phone} fullWidth/>
                  </Grid>
                  <Grid item>
                    <Button onClick={()=>{
                        setmodalTitle("Change your Phone Number")
                        settitle("Partners will reach you on this number");
                        setcaption("New Phone Number:")
                        setmodal(true);
                        setsubmit(false);
                    }} className={classes.button}>Change</Button>
                  </Grid>
                </Grid>

                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>email</Icon>
                  </Grid>
                  <Grid item xs={7} sm={9}>
                    <WhiteTextField disabled label="Email" value={email} fullWidth/>
                  </Grid>
                  <Grid item>
                    <Button onClick={()=>{
                        setmodalTitle("Change Email Address");
                        settitle("You will use this email address to sign in to your profile");
                        setcaption("New E-mail address is:")
                        setmodal(true);
                       
                    }} className={classes.button}>Change</Button>
                  </Grid>
                </Grid>

                <Grid  container spacing={1} style={{marginTop:20}} alignItems="flex-end">
                  <Grid item>
                    <Icon className={classes.icon}>lock</Icon>
                  </Grid>
                  <Grid item xs={8} sm={9}  onClick={()=>{console.log("hell")}}>
                    <WhiteTextField disabled  value={"Change password"} fullWidth/>
                  </Grid>
                  <Grid item>
                    <Button onClick={()=>{
                        setmodalTitle("Change your password")
                        settitle("You will use this password to sign ini to your account");
                        setcaption("Enter your new password")
                        setmodal(true);
                    }} className={classes.button}><Icon>keyboard_arrow_right</Icon></Button>
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