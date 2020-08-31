import React,{useState,useEffect} from 'react';
import {makeStyles,Box,Container,Grid,Snackbar,Button,CircularProgress,Icon} from '@material-ui/core'
import Input from '../components/textInput'
import '../App.css'
import config from '../includes/config';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import AddressBox from '../components/addressBox'
var  form_fields = [
    {
        type:"text",
        placeholder:"Business Name",
        label:"Business Name",
        show:"false",
        name:"business_name",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"text",
        placeholder:"Email Address",
        label:"Email Address",
        show:"false",
        name:"email",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"phone",
        placeholder:"Phone Number",
        label:"Phone Number ",
        show:"false",
        name:"phone",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"password",
        placeholder:"Password",
        label:"Password ",
        show:"show",
        name:"password",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"text",
        placeholder:"Bank account holder name",
        label:"Bank account holder name ",
        show:"false",
        name:"bac_holder_name",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"text",
        placeholder:"Name of Bank",
        label:"Name of Bank ",
        show:"false",
        name:"name_of_bank",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"text",
        placeholder:"Bank Account Number",
        label:"Bank Account Number ",
        show:"false",
        name:"bank_acc",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"text",
        placeholder:"Bank sort code (don't include hypens)",
        label:"Bank sort code (don't include hypens) ",
        show:"false",
        name:"bank_sort_code",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"text",
        placeholder:"Address line 1",
        label:"Address line 1 ",
        show:"false",
        name:"address_one",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: false,
    },
    {
        type:"text",
        placeholder:"Address line 2",
        label:"Address line 2 ",
        show:"false",
        name:"address_two",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: false,
    },
    {
        type:"text",
        placeholder:"Town or city",
        label:"Town or city",
        show:"false",
        name:"town",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: false,
    },
    {
        type:"text",
        placeholder:"Postal code",
        label:"Postal code",
        show:"false",
        name:"postal_code",
        md:"6",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: false,
    },
    {
        type:"drop",
        placeholder:"Do you offer home service?",
        label:"Do you offer home service? ",
        show:"false",
        name:"home_service",
        md:"6",
        error:false,
        data:['-- select your choice --','Yes','No'],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"text",
        placeholder:"How many employees do you have?",
        label:"How many employees do you have?",
        show:"false",
        name:"num_employess",
        md:"12",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    },
    {
        type:"drop",
        placeholder:"What is your average monthly service income?",
        label:"What is your average monthly service income? ",
        show:"false",
        name:"month_income",
        md:"12",
        error:false,
        data:['-- select your choice --','£100 - £500','£501 - £999','£1000 - £2999','£3000 - £6999','£7000+'],
        errorText:"",
        value:"",
        required: true,
    }
    ];

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
     signupBox:{
         marginTop:80,
         paddingBottom:50,
         '& h3':{
             fontFamily:"Muli",
             fontSize:30,
             fontWeight:800
         }
     },
     formBox:{
         padding:10,
         marginTop:10
     },
     suggestionContainer:{
         backgroundColor:"white",
         border:"thin solid #000"
     },
     suggestion:{
         fontFamily:"Google Sans",
         fontSize:13,
         cursor:"pointer"
     }
}));




function App() {
  const classes = useStyles();
  const [fields, setfields] = useState(form_fields);
  const [userData, setuserData] = useState([]);
  const [month_income, setmonth_income] = useState("-- select your choice --");
  const [num_employess, setnum_employess] = useState("");
  const [home_service, sethome_service] = useState("-- select your choice --");
  const [bank_sort_code, setbank_sort_code] = useState("");
  const [bank_acc, setbank_acc] = useState("");
  const [name_of_bank, setname_of_bank] = useState("");
  const [bac_holder_name, setbac_holder_name] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [business_name, setbusiness_name] = useState(""); 
  const [address_one, setaddress_one] = useState(""); 
  const [address_two, setaddress_two] = useState(""); 
  const [town, settown] = useState(""); 
  const [postal_code, setpostal_code] = useState(""); 
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [shopLat, setshopLat] = useState(0);
  const [shopLng, setshopLng] = useState(0);
  const [searchedLocation, setsearchedLocation] = useState("");
  const [locationError, setlocationError] = useState(false);

  var new_fields = fields;


  useEffect(() => {
    window.scrollTo(0,0);
  }, []);
  function setValues(field_name,value){
    //console.log(value);
   for(var i = 0; i<new_fields.length; i++){
       if(field_name === new_fields[i].name){
           new_fields[i].value = value;
           break;
       }
   }
   setfields(new_fields);
   //console.log(new_fields);
}

function validate(){
    
    var next = true;
    var sfields = [];
    new_fields.forEach((field) => {
        if(field.value.trim().length < 1 && field.required){
            field.error = true
            next = false;
            field.errorText = field.label +" required";
        }else{
            
          //check if phone number is accurate
          var hasNumber = /\d/;
          if(hasNumber.test(field.value) && (field.name === "bac_holder_name" || field.name === "business_name")){
              field.error = true;
              next = false;
              field.errorText = "Please enter a valid "+field.label;
          }else if(field.type === "phone"){
              field.value = field.value.replace(/\s+/, '');
              field.value = field.value.replace('+','0');
             
              if(isNaN(field.value) || field.value.length < 9){
                  //console.log(field.value);
                  field.error = true;
                  next = false;
                  field.errorText = "Please enter a valid "+field.label;
              }else{
                  field.value = field.value.replace('0','+');
                  field.error = false;
              }

          }else if((field.type ==="bank_sort_code" || field.type === "bank_acc" )&& isNaN(field.value)){
              field.error = true;
              next = false;
          }else if(field.type === "email"){
              var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
              if(!re.test(field.value)){
                  field.error = true;
                  next = false;
                  field.errorText = "Please enter a valid "+field.label;
              }else{
                  field.error = false;
              }
          }else if(field.type === "password" && field.value.length < 5){
              field.error = true;
              next = false;
              field.errorText = "Password must be more that 5 characters";
          }else if(field.value.indexOf("SELECT") > -1){
              field.errorText = field.label +" required";
              field.error = true;
              next = false;
          }else{
              field.error = false;
          }
        }
        
        sfields.push(field);
    })

    //console.log(searchedLocation);
    if(searchedLocation.trim().length < 1){
        setlocationError(true);
        //console.log('location needed');
        next = false;
    }

    console.log(next);
    setfields(sfields);
    //return;
    
    if(next){
      var userData = {};

      userData.businessLocation = searchedLocation;
      userData.storelat = shopLat;
      userData.storelng = shopLng; 
      fields.forEach((field) => {
          userData[field.name] = field.value;
      })
      setuserData(userData);
      

      setloading(true);
      //console.log(config.apiBaseUrl)
      var url  = config.apiBaseUrl+'/auth/register_partner';
        axios.post(url,userData,{withCredentials: true}).then((response)=>{
            setloading(false);
            if(response.status == 200){
                window.open(config.host+"#/account/settings","_self");
            }else{
                seterror(true);
                seterrorMessage('Business already exist');
            }
        }).catch((error) => {
            setloading(false);
            seterror(true);
            seterrorMessage('Oops! an error occured');
        })


    }
}

//get user cordinates


  return (
    <Box>
        <Container maxWidth="sm" className={classes.signupBox}>
            <div style={{padding:10}}>
                <h3>Become a partner</h3>
                <p style={{fontSize:15,color:"rgba(0,0,0,0.8)",fontFamily:"Muli",textAlign:1.5}}>Exhibit your skills and earn extra income whilst you do your best.</p>
            </div>

            <form>
                    <Grid container>
                    <Grid style={{paddingTop:0,paddingBottom:0}} item xs={12} md={12} className={classes.formBox}>
                            <h4>Business detials</h4>
                            <hr/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[0].errorText} value={business_name} data={fields[0].data}  error={fields[0].error} showPass={fields[0].show} type={fields[0].type} onTextChange={(e)=>{
                            var value = fields[0].type === "phone" ? e : e.value;
                            setbusiness_name(value);
                            setValues(fields[0].name,value);
                            }} placeholder={fields[0].placeholder} label={fields[0].label}/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[1].errorText} value={email} data={fields[1].data}  error={fields[1].error} showPass={fields[1].show} type={fields[1].type} onTextChange={(e)=>{
                            var value = fields[1].type === "phone" ? e : e.value;
                            setemail(value);
                            setValues(fields[1].name,value);
                            }} placeholder={fields[1].placeholder} label={fields[1].label}/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[2].errorText} value={phone} data={fields[2].data}  error={fields[2].error} showPass={fields[2].show} type={fields[2].type} onTextChange={(e)=>{
                            var value = fields[2].type === "phone" ? e : e.value;
                            setphone(value);
                            setValues(fields[2].name,value);
                            }} placeholder={fields[2].placeholder} label={fields[2].label}/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[3].errorText} value={password} data={fields[3].data}  error={fields[3].error} showPass={fields[3].show} type={fields[3].type} onTextChange={(e)=>{
                            var value = fields[3].type === "phone" ? e : e.value;
                            setpassword(value);
                            setValues(fields[3].name,value);
                            }} placeholder={fields[3].placeholder} label={fields[3].label}/>
                        </Grid>

                        
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[12].errorText} value={home_service} data={fields[12].data}  error={fields[12].error} showPass={fields[12].show} type={fields[12].type} onTextChange={(e)=>{
                            var value = fields[12].type === "phone" ? e : e.value;
                            sethome_service(value);
                            setValues(fields[12].name,value);
                            }} placeholder={fields[12].placeholder} label={fields[12].label}/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[13].errorText} value={num_employess} data={fields[13].data}  error={fields[13].error} showPass={fields[13].show} type={fields[13].type} onTextChange={(e)=>{
                            var value = fields[13].type === "phone" ? e : e.value;
                            setnum_employess(value);
                            setValues(fields[13].name,value);
                            }} placeholder={fields[13].placeholder} label={fields[13].label}/>
                        </Grid>

                        <Grid item xs={12} md={12} className={classes.formBox}>
                            <Input errorText={fields[14].errorText} value={month_income} data={fields[14].data}  error={fields[14].error} showPass={fields[14].show} type={fields[14].type} onTextChange={(e)=>{
                            var value = fields[14].type === "phone" ? e : e.value;
                            setmonth_income(value);
                            setValues(fields[14].name,value);
                            }} placeholder={fields[14].placeholder} label={fields[14].label}/>
                        </Grid>

                        <Grid item xs={12} md={12} className={classes.formBox}>
                            {/* <Input errorText={fields[15].errorText} value={searchedLocation} data={fields[15].data}  error={fields[15].error} showPass={fields[15].show} type={fields[15].type} onTextChange={(e)=>{
                           
                            setsearchedLocation(e.value);
                            }} placeholder={fields[15].placeholder} label={fields[15].label}/> */}

                        <AddressBox suggestion={(address,lat,lng)=>{
                            setshopLat(lat);
                            setshopLng(lng);
                            setsearchedLocation(address);
                            setlocationError(false);
                        }}/>
                        {locationError ? <font color="red" size={2}>Please enter your shop's location</font>: null}
                        </Grid>

                        <Grid style={{paddingTop:0,paddingBottom:0}} item xs={12} md={12} className={classes.formBox}>
                            <h4>Bank details</h4>
                            <hr/>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[4].errorText} value={bac_holder_name} data={fields[4].data}  error={fields[4].error} showPass={fields[4].show} type={fields[4].type} onTextChange={(e)=>{
                            var value = fields[4].type === "phone" ? e : e.value;
                            setbac_holder_name(value);
                            setValues(fields[4].name,value);
                            }} placeholder={fields[4].placeholder} label={fields[4].label}/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[5].errorText} value={name_of_bank} data={fields[5].data}  error={fields[5].error} showPass={fields[5].show} type={fields[5].type} onTextChange={(e)=>{
                            var value = fields[5].type === "phone" ? e : e.value;
                            setname_of_bank(value);
                            setValues(fields[5].name,value);
                            }} placeholder={fields[5].placeholder} label={fields[5].label}/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[6].errorText} value={bank_acc} data={fields[6].data}  error={fields[6].error} showPass={fields[6].show} type={fields[6].type} onTextChange={(e)=>{
                            var value = fields[6].type === "phone" ? e : e.value;
                            setbank_acc(value);
                            setValues(fields[6].name,value);
                            }} placeholder={fields[6].placeholder} label={fields[6].label}/>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[7].errorText} value={bank_sort_code} data={fields[7].data}  error={fields[7].error} showPass={fields[7].show} type={fields[7].type} onTextChange={(e)=>{
                            var value = fields[7].type === "phone" ? e : e.value;
                            setbank_sort_code(value);
                            setValues(fields[7].name,value);
                            }} placeholder={fields[7].placeholder} label={fields[7].label}/>
                        </Grid> 
                        <Grid style={{paddingTop:0,paddingBottom:0}} item xs={12} md={12} className={classes.formBox}>
                        <h4>Bank/Building Society branch address (optional)</h4>
                            <hr/>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[8].errorText} value={address_one} data={fields[8].data}  error={fields[8].error} showPass={fields[8].show} type={fields[8].type} onTextChange={(e)=>{
                            var value = fields[8].type === "phone" ? e : e.value;
                            setaddress_one(value);
                            setValues(fields[8].name,value);
                            }} placeholder={fields[8].placeholder} label={fields[8].label}/>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[9].errorText} value={address_two} data={fields[9].data}  error={fields[9].error} showPass={fields[9].show} type={fields[9].type} onTextChange={(e)=>{
                            var value = fields[9].type === "phone" ? e : e.value;
                            setaddress_two(value);
                            setValues(fields[9].name,value);
                            }} placeholder={fields[9].placeholder} label={fields[8].label}/>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[10].errorText} value={town} data={fields[10].data}  error={fields[10].error} showPass={fields[10].show} type={fields[10].type} onTextChange={(e)=>{
                            var value = fields[10].type === "phone" ? e : e.value;
                            settown(value);
                            setValues(fields[10].name,value);
                            }} placeholder={fields[10].placeholder} label={fields[10].label}/>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.formBox}>
                            <Input errorText={fields[11].errorText} value={postal_code} data={fields[11].data}  error={fields[11].error} showPass={fields[11].show} type={fields[11].type} onTextChange={(e)=>{
                            var value = fields[11].type === "phone" ? e : e.value;
                            setpostal_code(value);
                            setValues(fields[11].name,value);
                            }} placeholder={fields[11].placeholder} label={fields[11].label}/>
                        </Grid>
                     

                        <Grid item xs={12} md={12} className={classes.formBox}>
                        <Box style={{display:"flex",justifyContent:"space-between",padding:10}}>
                            <div></div>
                      
                            <Button disabled={loading ? true : false} onClick={()=>{
                            validate();
                        }} style={{backgroundColor:"black",color:"white",borderRadius:0,paddingLeft:20,paddingRight:20}}>{loading ? <span> <CircularProgress className={classes.loader} size={20} /> PLEASE WAIT...</span> : <span>SIGNUP</span>} </Button>
                        
                        </Box>
                        </Grid>
                       
                    </Grid>
            </form>
        </Container>

        <Snackbar open={error} autoHideDuration={6000} onClose={()=>{
                seterror(false);
            }}>
            <Alert variant="filled" severity="error" onClose={()=>{
                seterror(false);
            }}>
                {errorMessage}
            </Alert>
            </Snackbar>
    </Box>
  );
  }
 

export default App;
