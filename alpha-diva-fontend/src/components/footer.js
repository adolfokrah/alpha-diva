import React from 'react';
import {Container,Typography,makeStyles,Box,Tooltip,Icon} from '@material-ui/core'
import {Link} from "react-router-dom";

// import "~slick-carousel/slick/slick.css"; 
// import "~slick-carousel/slick/slick-theme.css";


import '../App.css'





const useStyles = makeStyles((theme) => ({
    footer:{
        backgroundColor:"#242626",
        paddingTop:20,
        paddingBottom:20,
        '& a':{
            color:"rgba(255,255,255,0.7)",
            fontSize:12,
            padding:20,
            paddingLeft:0,
            cursor:"pointer",
            textDecoration:"none"
        },
        '& .links':{
            borderBottom:"1px solid rgba(255,255,255,0.7)",
            paddingBottom:20
        },
        '& .fab':{
            marginLeft:20,
            ['@media (max-width:928px)']: {
               marginRight:20,
               marginLeft:0,
               marginTop:20
            }
        }
    },
    footerBottom:{
        display:"flex",alignItems:"center",marginTop:20,color:"white",justifyContent:"space-between",
        ['@media (max-width:928px)']: {
            display:"block"
        }
    }
}));

function App(props) {
  const classes = useStyles();

  
  return (
     <Box className={classes.footer}>
        <Container maxWidth="lg">
            <div className="links">
                <Link to="about_us">About us</Link>
                <Link to="privacy_policy">Privacy Policy</Link>
                <Link to="terms_of_service">Terms of Service</Link>
                <Link to="carrers">Careers</Link>
                <Link to="contact">Contact</Link>
            </div>
            <div className={classes.footerBottom}>
                <div style={{display:"flex",alignItems:"center"}}>
                    <Typography style={{fontFamily:"Dancing Script",fontWeight:"bold",fontSize:20,marginRight:20}}>
                        Alpha-Diva
                    </Typography>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}> © {new Date().getFullYear()} alpha-diva. All rights reserved</span>
                </div>

                <div>
                    <Tooltip title="alpha-diva" aria-label="add">
                        <Icon className="fab fa-facebook" />
                    </Tooltip>
                    <Tooltip title="@alpha-diva" aria-label="add">
                        <Icon className="fab fa-twitter" />
                    </Tooltip>
                    <Tooltip title="@alpha-diva" aria-label="add">
                        <Icon className="fab fa-instagram" />
                    </Tooltip>
                </div>
            </div>
        </Container>
     </Box>
  );
  }
 

export default App;

