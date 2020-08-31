import React,{useEffect} from 'react';
import Header from '../components/header'

import {makeStyles,Box} from '@material-ui/core'
import Footer from '../components/footer'
import '../App.css'
import Packages from '../components/packages'
import CustomerSignUp from '../components/customerSignup'
import SelectRegistrationType from '../components/selectRegistrationType'
import PartnerSignup from '../components/partnerSignup'
import {
  useParams
} from "react-router-dom";
import CheckAuth from '../includes/checkAuth'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    banner:{
      backgroundImage:`url(/images/pricing_background.jpg)`,
      paddingTop:100,
      paddingBottom:60,
      backgroundPosition:"center",
      '& .heading':{
        color:"red",
        fontSize:50,
        paddingBottom:5,
        fontFamily:"Muli",
        fontWeight:900,
        borderBottom:"5px solid red",
      },
      '& .desc':{
        maxWidth:900,
        '& span':{
          fontSize:20,
        fontFamily:"Muli",
        fontWeight:300,
        backgroundColor:"black",
        color:"white",
        padding:5,
        }
      }
    },
    tabsBanner:{
      backgroundColor:"#f3f3f3",
      '& .MuiTabs-indicator':{
        background:"red",
      }
    },
    tabs:{
      '&.Mui-selected':{
        color:"red",
        fontFamily:"Google Sans",
        borderBottomColor:"red"
      },
      '&.MuiTab-root':{
        fontFamily:"Google Sans",
      }
       //PrivateTabIndicator-colorPrimary-41 MuiTabs-indicator
    },
    packageBox:{
      backgroundColor:"#e7e7e7",
      padding:20,
      '& .title':{
        textAlign:"center",
        fontSize:14,
        color:"#828384",
        fontFamily:"Muli",
        fontWeight:860
      },
      '& .duration':{
        textAlign:"center",
        fontFamily:"Muli",
        fontSize:13,
        textTransform:"uppercase"
      }
    }
}));




function App() {
  const classes = useStyles();

  var params = useParams();

  useEffect(() => {
    CheckAuth.checkAuth('home');
  },[]);
  

  return (
    <Box className={classes.root}>
         <Header transparent={false} setLatLng={()=>{}}/>
        {params.type === "customer" ? <CustomerSignUp package={params.package}/> : null}
        {params.type === "package" ? <div style={{paddingTop:100,paddingBottom:100}}><Packages label="Select any of our packages to continue"/></div> : null}
        {params.type === 'new_user' ? <SelectRegistrationType/>: null}
        {params.type === 'partner' ? <PartnerSignup/>: null}
        <Footer/>
    </Box>
  );
  }
 

export default App;
