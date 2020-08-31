import React,{useState,useEffect} from 'react';

import {makeStyles,Box,Container,Button,Grid} from '@material-ui/core'
import '../App.css'
import Input from './textInput'
import Packages from './signuppackages'
import config from '../includes/config'
import AddressBox from './addressBox';
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
   }
}));




var  form_fields = [
{
    type:"text",
    placeholder:"First Name",
    label:"First Name",
    show:"false",
    name:"first_name",
    md:"6",
    error:false,
    data:[],
    errorText:"",
    value:""
},{
    type:"text",
    placeholder:"Last Name",
    label:"Last Name",
    show:"false",
    name:"last_name",
    md:"6",
    error:false,
    data:[],
    errorText:"",
    value:""
},{
    type:"email",
    placeholder:"Email Address",
    label:"Email Address",
    show:"false",
    name:"email",
    md:"6",
    error:false,
    data:[],
    errorText:"",
    value:""
},{
    type:"phone",
    placeholder:"Phone Number",
    label:"Phone Number",
    show:"false",
    name:"phone",
    md:"6",
    error:false,
    data:[],
    errorText:"",
    value:""
},{
    type:"number",
    placeholder:"Age",
    label:"Age",
    show:"false",
    name:"age",
    md:"6",
    error:false,
    data:[],
    errorText:"",
    value:""
},{
    type:"drop",
    placeholder:"Ethnicity",
    label:"Ethnicity",
    show:"false",
    name:"ethnicity",
    md:"6",
    error:false,
    data:['-- Select Ethinicity --','White','Black','Mixed Race','Asian','Caucasian','Hispanic','Other'],
    errorText:"",
    value:""
},{
    type:"text",
    placeholder:"Residential Address",
    label:"Residential Address",
    show:"false",
    name:"residential_address",
    md:"12",
    error:false,
    data:[],
    errorText:"",
    value:""
},{
    type:"drop",
    placeholder:"Hair Type",
    label:"Hair Type",
    show:"false",
    name:"hairtype",
    md:"6",
    error:false,
    data:['-- Select Hair Type --','Straight hair','Wavy Hair','Curly Hair','Coily Hair','Afro Hair'],
    errorText:"",
    value:""
},{
    type:"password",
    placeholder:"Password",
    label:"Password",
    show:"show",
    name:"password",
    md:"6",
    error:false,
    data:[],
    errorText:"",
    value:""
},{
    type:"drop",
    placeholder:"Security Question",
    label:"Security Question",
    show:"false",
    name:"security_question",
    md:"12",
    error:false,
    data:["-- Select Security Question -- ","What is the name of your favorite breakfast?","What is the name of your childhood friend","Who was your childhood crush","What is the name of your favorite street","What is your mother's maiden name?","Name of the primary school you attended"],
    errorText:"",
    value:""
},{
    type:"text",
    placeholder:"Answer",
    label:"Answer",
    show:"",
    name:"answer",
    md:"12",
    error:false,
    data:[],
    errorText:"",
    value:""
}
];




function App(props) {
  const classes = useStyles();
  const [fields, setfields] = useState(form_fields);
  const [stage, setstage] = useState("account_details");
  const [userData, setuserData] = useState([]);
  const [answer, setanswer] = useState("");
  const [security_question, setsecurity_question] = useState("-- Select Security Question -- ");
  const [passowrd, setpassowrd] = useState("");
  const [hairtype, sethairtype] = useState("-- Select Hair Type --");
  const [residential_address, setresidential_address] = useState("");
  const [ethnicity, setethnicity] = useState("-- Select Ethinicity --");
  const [age, setage] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [last_name, setlast_name] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [lat, setlat] = useState("");
  const [lng, setlng] = useState("");
  const [locationError, setlocationError] = useState(false);
  
  var new_fields = fields;

  useEffect(()=>{
    var subscription = ['Standard','Premium','Family','Custom','Dreads'];
    var index = subscription.indexOf(props.package);
    if(index < 0){
       window.open(config.host+"/#/sign_up/package/select","_self");
    }
  },[])

  useEffect(() => {
    window.scrollTo(0,0);
  }, [stage]);

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
      //window.open('https://google.com','_self');
      var next = true;
      var sfields = [];
      new_fields.forEach((field) => {
          if(field.value.trim().length < 1){
              field.error = true
              next = false
              field.errorText = field.label +" required";
          }else{
              
            //check if phone number is accurate
            var hasNumber = /\d/;
            if(hasNumber.test(field.value) && (field.name === "first_name" || field.name === "last_name")){
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

            }else if(field.type ==="age" && isNaN(field.value)){
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

      setfields(sfields);
      //return;
      if(lat.length < 1){
        setlocationError(true);
        next = false;
      }

      if(next){
        setstage("package");
        var userData = {};
        userData.lat = lat;
        userData.lng = lng;
        fields.forEach((field) => {
            userData[field.name] = field.value;
        })
        //console.log(userData);
        setuserData(userData);
      }
  }
 

  return (
    <Box>
       
        <Container maxWidth="sm" className={classes.signupBox}>
            <div style={{padding:10}}>
            <h3>Sign up as a client</h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,0.8)",fontFamily:"Muli",textAlign:1.5}}>Don't have an account yet? sign up with us and select any of our amazing packages.</p>
            </div>
            <form style={{display: stage === "account_details" ? "block" : "none"}}>
                <Grid container>
                    <Grid item xs={12} md={fields[0].md} className={classes.formBox}>
                        <Input errorText={fields[0].errorText} value={first_name} data={fields[0].data}  error={fields[0].error} showPass={fields[0].show} type={fields[0].type} onTextChange={(e)=>{
                        var value = fields[0].type === "phone" ? e : e.value;
                        setfirst_name(value);
                        setValues(fields[0].name,value);
                        }} placeholder={fields[0].placeholder} label={fields[0].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[1].md} className={classes.formBox}>
                        <Input errorText={fields[1].errorText} value={last_name} data={fields[1].data}  error={fields[1].error} showPass={fields[1].show} type={fields[1].type} onTextChange={(e)=>{
                            var value = fields[1].type === "phone" ? e : e.value;
                        setlast_name(value);
                        setValues(fields[1].name,value);
                        }} placeholder={fields[1].placeholder} label={fields[1].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[2].md} className={classes.formBox}>
                        <Input errorText={fields[2].errorText} value={email} data={fields[2].data}  error={fields[2].error} showPass={fields[2].show} type={fields[2].type} onTextChange={(e)=>{
                            var value = fields[2].type === "phone" ? e : e.value;
                        setemail(value);
                        setValues(fields[2].name,value);
                        }} placeholder={fields[2].placeholder} label={fields[2].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[3].md} className={classes.formBox}>
                        <Input errorText={fields[3].errorText} value={phone} data={fields[3].data}  error={fields[3].error} showPass={fields[3].show} type={fields[3].type} onTextChange={(e)=>{
                            var value = fields[3].type === "phone" ? e : e.value;
                        setphone(value);
                        setValues(fields[3].name,value);
                        }} placeholder={fields[3].placeholder} label={fields[3].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[4].md} className={classes.formBox}>
                        <Input errorText={fields[4].errorText} value={age} data={fields[4].data}  error={fields[4].error} showPass={fields[4].show} type={fields[4].type} onTextChange={(e)=>{
                            var value = fields[4].type === "phone" ? e : e.value;
                        setage(value);
                        setValues(fields[4].name,value);
                        }} placeholder={fields[4].placeholder} label={fields[4].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[5].md} className={classes.formBox}>
                        <Input errorText={fields[5].errorText} value={ethnicity} data={fields[5].data}  error={fields[5].error} showPass={fields[5].show} type={fields[5].type} onTextChange={(e)=>{
                            var value = fields[5].type === "phone" ? e : e.value;
                        setethnicity(value);
                        setValues(fields[5].name,value);
                        }} placeholder={fields[5].placeholder} label={fields[5].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[6].md} className={classes.formBox}>
                         <AddressBox place suggestion={(address,lat,lng)=>{
                            setlat(lat);
                            setlng(lng);
                            setresidential_address(address);
                            setValues(fields[6].name,address);
                            setlocationError(false);
                        }} placeholder={"Enter your location"}/>
                        {locationError ? <font color="red" size={2}>Please enter your shop's location</font>: null}
                    </Grid>

                    <Grid item xs={12} md={fields[7].md} className={classes.formBox}>
                        <Input errorText={fields[7].errorText} value={hairtype} data={fields[7].data}  error={fields[7].error} showPass={fields[7].show} type={fields[7].type} onTextChange={(e)=>{
                            var value = fields[7].type === "phone" ? e : e.value;
                        sethairtype(value);
                        setValues(fields[7].name,value);
                        }} placeholder={fields[7].placeholder} label={fields[7].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[8].md} className={classes.formBox}>
                        <Input errorText={fields[8].errorText} value={passowrd} data={fields[8].data}  error={fields[8].error} showPass={fields[8].show} type={fields[8].type} onTextChange={(e)=>{
                            var value = fields[8].type === "phone" ? e : e.value;
                        setpassowrd(value);
                        setValues(fields[8].name,value);
                        }} placeholder={fields[8].placeholder} label={fields[8].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[9].md} className={classes.formBox}>
                        <Input errorText={fields[9].errorText} value={security_question} data={fields[9].data}  error={fields[9].error} showPass={fields[9].show} type={fields[9].type} onTextChange={(e)=>{
                            var value = fields[9].type === "phone" ? e : e.value;
                        setsecurity_question(value);
                        setValues(fields[9].name,value);
                        }} placeholder={fields[9].placeholder} label={fields[9].label}/>
                    </Grid>

                    <Grid item xs={12} md={fields[10].md} className={classes.formBox}>
                        <Input errorText={fields[10].errorText} value={answer} data={fields[10].data}  error={fields[10].error} showPass={fields[10].show} type={fields[10].type} onTextChange={(e)=>{
                            var value = fields[10].type === "phone" ? e : e.value;
                        setanswer(value);
                        setValues(fields[10].name,value);
                        }} placeholder={fields[10].placeholder} label={fields[10].label}/>
                    </Grid>


                </Grid>
                <Box style={{display:"flex",justifyContent:"space-between",padding:10}}>
                    <div></div>
                    <Button onClick={validate} style={{backgroundColor:"black",color:"white",borderRadius:0,paddingLeft:20,paddingRight:20}}>NEXT</Button>
                </Box>
            </form>
           
                <form style={{display: stage !== "account_details" ? "block" : "none"}}>
                    {stage !== "account_details" ? <Packages forwho="ME" package={props.package} userData={userData} ethinicity={"WHITE"}/> : null}
                    <Box style={{display:"flex",justifyContent:"space-between",padding:10}}>
                        <Button onClick={()=>{setstage("account_details")}} style={{backgroundColor:"rgba(0,0,0,0.2)",color:"white",borderRadius:0,paddingLeft:20,paddingRight:20}}>BACK</Button>
                        
                   </Box>
                </form>
        </Container> 

    </Box>
  );
  }
 

export default App;
