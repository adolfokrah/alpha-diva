import React,{useEffect,useState} from 'react';
import Header from '../components/header'
import Config from '../includes/config'
import {makeStyles,Box,Grid,Snackbar,Container,CircularProgress,Button} from '@material-ui/core'
import Footer from '../components/footer'
import '../App.css'
import Input from '../components/textInput'
import { Alert } from '@material-ui/lab';
import {Link, useParams} from "react-router-dom";
import CheckAuth from '../includes/checkAuth'

var user = require('../includes/getUserDetails');

const axios = require('axios')

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    banner:{
        background:`radial-gradient(#A3A3A3,#7E7E7D)`,
    },
    bannerImage:{
      backgroundImage:`url(/images/banner.png)`,
      height:"100%",
      backgroundRepeat:"no-repeat",
      backgroundPosition:"bottom right 80px",
      padding:40,
      backgroundSize:700,
      paddingBottom:90,
      paddingTop:70,
      //backgroundAttachment:"fixed",
      ['@media (max-width:1118px)']: { // eslint-disable-line no-useless-computed-key
          backgroundPosition:"bottom right -100px",
        },
        ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
          backgroundSize:400,
          backgroundPosition:"bottom right 30px",
          paddingTop:40,
          paddingBottom:70,
        },['@media (max-width:689px)']: { // eslint-disable-line no-useless-computed-key
          padding:20,
          paddingTop:100,
          paddingBottom:70,
          backgroundSize:320,
          backgroundPosition:"bottom right -50px",
        },
    },
    bannerCaption:{
        backgroundColor:"white",
        width:500,
        padding:40,
        marginTop:90,
        boxSizing:"border-box",
        ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
          width:"50%",
          backgroundColor:"transparent",
          padding:0,
        },['@media (max-width:460px)']: { // eslint-disable-line no-useless-computed-key
          marginTop:50,
        },
    },
    captionText:{
        fontWeight:800,
        fontSize:38,
        fontFamily:"Muli",
        ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
          width:"100%",
          color:"white"
        },['@media (max-width:690px)']: { // eslint-disable-line no-useless-computed-key
          fontSize:24,
        }, ['@media (max-width:460px)']: { // eslint-disable-line no-useless-computed-key
          fontSize:18,
        },
    },
    bannerBtn:{
        backgroundColor:"#000",
        padding:15,
        marginTop:30,
        color:"white",
        fontFamily:"Muli",
        textTransform:"capitalize",
        width:"100%",
        fontSize:16,
        borderRadius:0,
        transition:"0.3s",
        '&:hover':{
            backgroundColor:"red"
        },['@media (max-width:460px)']: { // eslint-disable-line no-useless-computed-key
          fontSize:12,
          padding:10
        },
    },
    hide:{
      ['@media (max-width:928px)']: {
        display:"none"
      }
    },
    hide2:{
      ['@media (min-width:928px)']: {
        display:"none"
      } 
    },
    connectHeader:{
      fontFamily:"Muli",
      fontWeight:800,
      fontSize:40,
      marginTop:40,
      textAlign:"center",
      ['@media (max-width:928px)']: {
        fontSize:30
      } 
    },
    connectGrid:{
      textAlign:"center",
      lineHeight:1,
      paddingTop:40,
      paddingLeft:20,
      paddingRight:20,
      boxSizing:"border-box",
      '& img':{
        width:50
      },
      '& h3':{
        fontSize:15
      },
      '& p':{
        fontSize:13,
        lineHeight:1.2
      }
    },
    becomeP:{
      marginTop:50,
      backgroundColor:"#fdf0f0",
      paddingTop:30,
      paddingBottom:70,
      textAlign:"center",
      '& h3':{
        fontSize:40,
        fontFamily:"Muli",
        fontWeight:800,
        ['@media (max-width:928px)']: {
          fontSize:30
        } 
      },
      '& p':{
        lineHeight:1.5,
        fontSize:16,
        width:"50%",
        margin:"auto",
        ['@media (max-width:928px)']: {
          width:'100%'
        } 
      }
    },
    becomePBtn:{
      marginTop:20,
      backgroundColor:"#000",
      color:"white",
      width:"250px",
      margin:"auto",
      borderRadius:0,
      padding:10,
      boxSizing:"border-box",
      transition:"0.3s",
      '&:hover':{
        backgroundColor:"red"
      }
    },
    testimonials:{
      paddingTop:50,
      paddingBottom:0,
      ['@media (max-width:928px)']: {
        width:"100%",
        padding:0,
        paddingTop:30,
      },
      '& h3':{
        fontSize:40,
        fontFamily:"Muli",
        fontWeight:800,
        ['@media (max-width:928px)']: {
          fontSize:30,
          width:"88%",
          margin:"auto",
          marginTop:20,
          marginBottom:40,
        },
        textAlign:"center"
      }
    },
    stylebanner:{
      '& .style':{
        paddingBottom:60
      },
      '& a':{
          color:"black",
          borderBottom:"2px solid #000",
          fontFamily:"Muli",
          fontSize:15,
          fontWeight:800,
          textDecoration:"none",
          cursor:"pointer",
          '&:hover':{
            textDecoration:"none"
          }
      }
    },
    infoBanner:{
      backgroundImage:`url(/images/background.jpg)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize:"cover",
      marginTop:70,
      '& h3':{
        color:"white",
        fontSize:40,
        fontFamily:"Muli",
        fontWeight:800,
        ['@media (max-width:928px)']: {
          fontSize:30
        }
      },
      '& p':{
        color:"white",
        fontSize:15,
        lineHeight:2,
        fontFamily:"Muli",
      },
      '& .overlay':{
        backgroundColor:"rgba(0,0,0,0.3)",
        paddingTop:200,
        paddingBottom:200,
      }
    },
    infoBanner2:{
      backgroundImage:`url(/images/background2.jpg)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize:"cover",
      '& .overlay':{
        backgroundColor:"rgba(0,0,0,0.3)",
        paddingTop:200,
        paddingBottom:200,
      }
    },
    infoBannerBtn:{
      fontSize:15,
      width: 200,
      fontWeight:800,
      paddingTop:15,
      paddingBottom:15
    },
    shops_near_me:{
      paddingTop:50,
      paddinBottom:200,
      textAlign:'center',
      fontFamily:"Muli",
      '& h3':{
        fontWeight:800,
        fontSize:30
      },
      '& .box':{
        border:"2px solid black",
        cursor:"pointer",
        margin:"auto",
        display:"flex",
        justifyContent:"space-between",
        textDecoration:"none",
        color:"black",
        paddingLeft:10,
        paddingRight:10,
        alignItems:'center',
      }
    }
  }));

  var  form_fields = [
    {
        type:"text",
        placeholder:"Email / Account ID",
        label:"Email / Account ID",
        show:"false",
        name:"email / account id",
        md:"12",
        error:false,
        data:[],
        errorText:"",
        value:""
    },{
        type:"password",
        placeholder:"Password",
        label:"Password ",
        show:"show",
        name:"password",
        md:"12",
        error:false,
        data:[],
        errorText:"",
        value:"",
        required: true,
    }
    ];

function App() {
  const classes = useStyles();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState("");
  const [error, seterror] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const params = useParams();

  const [fields, setfields] = useState(form_fields);

    
  var new_fields = fields;

  useEffect(() => {
    CheckAuth.checkAuth('home');
  },[]);

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

function login(){
    var next = true;
    var sfields = [];
    new_fields.forEach((field) => {
        if(field.value.trim().length < 1){
            field.error = true
            next = false
            field.errorText = field.label +" required";
        }
        sfields.push(field);
    })
    setfields(sfields);

    if(next){
      setloading(true);
        var url  = Config.apiBaseUrl+'/auth/login/';
        axios.post(url,{user: email,password: password},{withCredentials: true}).then((response)=>{
            setloading(false);
            if(response.status == 200){
               var url = params.link ? params.link.replace('_','/') : "";
               user.getUserDetails(url);
               //console.log("login");
            }else{
                seterror(true);
                seterrorMessage('Wrong credentials provided');
            }
        }).catch((error) => {
            console.error(error);
            setloading(false);
            seterror(true);
            seterrorMessage('Oops! an error occured');
        })
    }
}
  



  return (
    <Box className={classes.root}>
        <Header transparent={false} setLatLng={()=>{}}/>
        <Box className={classes.shops_near_me}>
                <Container maxWidth="xs" style={{paddingTop:100,paddingBottom:160}}>
                      <h3>Sign in to your Accont</h3>
                      <form>
                      <Grid container style={{textAlign:"left"}}>

                        <Grid item xs={12} md={fields[0].md} className={classes.formBox}>
                        <Input errorText={fields[0].errorText} value={email} data={fields[0].data}  error={fields[0].error} showPass={fields[0].show} type={fields[0].type} onTextChange={(e)=>{
                            var value = fields[0].type === "phone" ? e : e.value;
                        setemail(value);
                        setValues(fields[0].name,value);
                        }} placeholder={fields[0].placeholder} label={fields[0].label}/>
                        </Grid>

                        <Grid style={{paddingTop:20}} item xs={12} md={fields[1].md} className={classes.formBox}>
                        <Input errorText={fields[1].errorText} value={password} data={fields[1].data}  error={fields[1].error} showPass={fields[1].show} type={fields[1].type} onTextChange={(e)=>{
                            var value = fields[1].type === "phone" ? e : e.value;
                        setpassword(value);
                        setValues(fields[1].name,value);
                        }} placeholder={fields[1].placeholder} label={fields[1].label}/>
                        </Grid>

                        <Grid style={{paddingTop:20}} item xs={12} md={12} className={classes.formBox}>
                            <Link to="/forgotten_pass">Forgotten password / Username?</Link>
                        </Grid>

                        <Grid style={{paddingTop:20}} item xs={12} md={12} className={classes.formBox}>
                            <Button disabled={loading ? true : false} onClick={()=>{
                                login();
                            }} style={{width:'100%',backgroundColor:"black",height:50,color:"white",borderRadius:0,paddingLeft:20,paddingRight:20}}>{loading ? <span> <CircularProgress className={classes.loader} size={20} /> PLEASE WAIT...</span> : <span>LOGIN</span>} </Button>
                        </Grid>
                        </Grid>
                      </form>
                      <center><p style={{fontFamily:"Muli"}}>Don't have an account?<br/><Link style={{textDecoration:"none"}} to="/sign_up/new_user/none">Sign up now</Link></p></center>
                </Container>
              </Box>
        <Footer/>

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
