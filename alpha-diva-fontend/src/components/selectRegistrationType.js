import React,{useState,useEffect} from 'react';

import Packages from '../components/packages'
import {makeStyles,Box,Container,Typography,Button,Icon,Grid} from '@material-ui/core'
import {Link} from "react-router-dom";
import clsx from 'clsx';
import Config from '../includes/config'
import '../App.css'

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



function App() {
  const classes = useStyles();
  const [styles, setstyles] = useState([]);

  useEffect(()=>{
      //fetch the available hairstyles
      fetch(Config.apiBaseUrl+'/hairStyles/')
      .then((response)=>response.json())
      .then((json)=>setstyles(json))
      .catch((error)=>console.error(error))
      .finally()

      //fetch testimonials
   },[])

  return (
    <Box>
        <Box className={classes.shops_near_me}>
                <Container maxWidth="xs" style={{paddingTop:100,paddingBottom:160}}>
                      <h3>Signup with Alpha-Diva</h3>
                      <p style={{fontFamily:"Muli"}}>Don't have an account yet? Choose any of our registration types and continue</p>
                      <Grid container>
                        <Grid item xs={12} md={12} style={{padding:10,boxSizing:"border-box"}}>
                            <Link to="/sign_up/package/select" className="box">
                              <p>I'm a customer</p>
                              <Icon>east</Icon>
                            </Link>
                        </Grid>

                        <Grid item xs={12} md={12} style={{padding:10,boxSizing:"border-box"}}>
                            <Link to="/sign_up/partner/new" className="box">
                              <p>Become a partner</p>
                              <Icon>east</Icon>
                            </Link>
                        </Grid>
                       
                      </Grid>
                      <center><p style={{fontFamily:"Muli"}}>Already have an account?<br/><Link style={{textDecoration:"none"}} to="/sign_in">Log in now</Link></p></center>
                </Container>
              </Box>

    </Box>
  );
  }
 

export default App;

