import React from 'react';
import {Container,makeStyles,Icon,Grid} from '@material-ui/core'
import {Link} from "react-router-dom";

// import "~slick-carousel/slick/slick.css"; 
// import "~slick-carousel/slick/slick-theme.css";


import '../App.css'





const useStyles = makeStyles((theme) => ({
    pricing:{
      paddingBottom:50,
      paddingTop:50,
      '& h3':{
        fontSize:40,
        fontFamily:"Muli",
        fontWeight:800,
        textAlign:"center",
        ['@media (max-width:928px)']: {
          fontSize:30,
        }
      },
      '& p':{
        textAlign:"center",
        fontFamily:"Muli",
        fontSize:16,
        lineHeight:1.6,
        width:"50%",
        margin:"auto",
        ['@media (max-width:928px)']: { width:"100%"}
       
      },
      '& h4':{
        fontSize:30,
        marginBottom:5,
        '& a':{
            color:"red",
            cursor:"pointer"
        }
      },
      '& .caption':{
          fontFamily:"Muli",
          fontSize:15,
          fontWeight:400,
          color:"rgba(0,0,0,0.9)",
          lineHeight:1.8
      }
      
    }
}));

function App(props) {
  const classes = useStyles();

  
  return (
      
    <Container maxWidth="lg" className={classes.pricing}>
    <h3>Packages</h3>
    <p>{props.label}</p>

    <Grid container>
        <Grid item xs={12} md={6} lg={4}>
            <h4><Link to="/sign_up/customer/Standard">Standard <Icon>arrow_right_alt</Icon></Link></h4>
            <span className="caption">Look your best everyday. Subscribe to any of our standard packages for your everyday cuts
at anytime. </span>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <h4><Link to="/sign_up/customer/Premium">Premium <Icon>arrow_right_alt</Icon></Link></h4>
            <span className="caption">Subscribe to our premium packages and experience real prestige. Enjoy priority services,
freebies and many offers available to you.</span>
        </Grid>


        <Grid item xs={12} md={6} lg={4}>
            <h4><Link to="/sign_up/customer/Family">Family <Icon>arrow_right_alt</Icon></Link></h4>
            <span className="caption">Manage your family’s grooming needs in one place. Give your family the look they deserve.
 </span>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <h4><Link >Corporate <Icon>arrow_right_alt</Icon></Link></h4>
            <span className="caption">Appearances do matter in a professional setting. Your staff would look and feel better with
our corporate packages.  </span>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <h4><Link to="/sign_up/customer/Custom">Custom <Icon>arrow_right_alt</Icon></Link></h4>
            <span className="caption">Create your own story with our custom package. Imagine, plan and choose what best fit
you.  </span>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <h4><Link to="/sign_up/customer/Dreads">Dreads <Icon>arrow_right_alt</Icon></Link></h4>
            <span className="caption">Maintain your unique style and look good on dreads  </span>
        </Grid>
    </Grid>
   </Container>
  );
  }
 

export default App;
