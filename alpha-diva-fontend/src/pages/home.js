import React,{useState,useEffect} from 'react';
import Header from '../components/header'
import Testimonials from '../components/testimonials'
import Packages from '../components/packages'
import {makeStyles,Box,Container,Typography,Button,Icon,Grid} from '@material-ui/core'
import {Link,useHistory} from "react-router-dom";
import clsx from 'clsx';
import Footer from '../components/footer'
import Config from '../includes/config'
import CheckAuth from '../includes/checkAuth'
import '../App.css'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  banner:{
      background:'#321F40',
      height:650,
      ['@media (max-width:1272px)']: { // eslint-disable-line no-useless-computed-key
       height: 500
      }
  },
  bannerImage:{
    position:"relative",
    display: "flex",
    backgroundColor:"#d1d2d3",
    backgroundImage:`url(/images/banner.png)`,
    backgroundRepeat:"no-repeat",
    backgroundPosition:"bottom right 80px",
    backgroundSize:850,
    //backgroundAttachment:"fixed",
    ['@media (max-width:1118px)']: { // eslint-disable-line no-useless-computed-key
        backgroundPosition:"bottom right -100px",
      },
      ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
        backgroundSize:400,
        backgroundPosition:"bottom right 30px",
      },['@media (max-width:689px)']: { // eslint-disable-line no-useless-computed-key
        backgroundSize:320,
        backgroundPosition:"bottom right -50px",
      },
  },
  bannerCaption:{
      color:"white",
      padding:40,
      marginTop:90,
      boxSizing:"border-box",
      ['@media (max-width:326px)']: {
        padding:0
      }
  },
  captionText:{
      fontWeight:800,
      fontSize:38,
      fontFamily:"Muli",
      ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
        width:"100%",
        color:"white"
      },['@media (max-width:690px)']: { // eslint-disable-line no-useless-computed-key
        fontSize:34,
      }, ['@media (max-width:460px)']: { // eslint-disable-line no-useless-computed-key
        fontSize:28,
      },
  },
  bannerBtn:{
      backgroundColor:"red",
      padding:15,
      marginTop:30,
      color:"white",
      fontFamily:"Muli",
      textTransform:"capitalize",
      width:300,
      borderRadius:200,
      fontSize:16,
      transition:"0.3s",
      '&:hover':{
          backgroundColor:"red"
      },['@media (max-width:460px)']: { // eslint-disable-line no-useless-computed-key
        fontSize:12,
        padding:10
      }, ['@media (max-width:928px)']: {
        width:"100%"
      }
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
    marginBottom:50,
    textAlign:'center',
    '& h3':{
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
  },
  logoText:{
    marginTop:50,
    display:"flex",
    alignItems:"center",
    ['@media (max-width:928px)']: {
      margin:0
    }
  },
  dash:{
    marginRight:10,
    height:2,
    width:40,
    backgroundColor:"white"
  },
  title:{
    fontFamily:"Dancing Script",
  }
}));



function App() {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [styles, setstyles] = useState([]);
  const [scrolling, setscrolling] = useState(0);

  useEffect(()=>{
      //fetch the available hairstyles
      fetch(Config.apiBaseUrl+'/hairStyles/')
      .then((response)=>response.json())
      .then((json)=>setstyles(json))
      .catch((error)=>console.error(error))
      .finally()

      CheckAuth.checkAuth('home');

      //fetch testimonials
   },[])

  function getUserLocation(){
    var options = {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    navigator.geolocation.getCurrentPosition((position) => {
      var path = '/search/near_me/'+position.coords.latitude+'/'+position.coords.longitude+'/0';
      history.push(path);
    },error,{ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });

    function error(){

    }
  }


  return (
    <Box>
    <Box className={clsx(classes.content, {
      [classes.contentShift]: open,
    })}>
        <Header transparent={true} setLatLng={()=>{}}/>
        

         <Box>
            <Box className={classes.bannerImage}>
                <Grid container>
                  <Grid item xs={12} md={12} lg={6} className={classes.banner} >
                    
                  </Grid>
                  <Grid item xs={6}>

                  </Grid>

                  <Box style={{width:"100%",position:"absolute",top:"0"}}>
                  <Container container maxWidth="lg">
                      <Grid item xs={12} md={12} lg={6}>
                        <Box className={classes.bannerCaption}>
                          <div className={classes.logoText}>
                            <div className={classes.dash}></div>
                            <p className={classes.title}>Alpha-Diva</p>
                          </div>
                          <Typography variant="h5" className={classes.captionText}>
                            Find beauty professionals near you
                          </Typography>
                          <p>Instantly subscribe for your professional grooming needs at affordable prices near you</p>
                          
                            <Button  className={clsx(classes.bannerBtn)} onClick={()=>{
                              getUserLocation();
                            }}><Icon style={{marginRight:10}}>search</Icon> Discover shops near me</Button>
                        </Box>
                      </Grid>
                  </Container>
                  </Box>
                 
                </Grid>
            </Box>
            
            <Container maxWidth="lg">

             <Box style={{paddingTop:20,paddinBottom:20}}>
              <Typography variant="h4" className={classes.connectHeader}>
                Connect with the best stylist and babers
              </Typography>
              <Grid container>
                 <Grid  className={classes.connectGrid} item xs={12} sm={6} md={3}>
                    <img alt="fine" src={require('../images/mega.png')}/>
                    <h3>DISCOVER STYLES</h3>
                    <p variant="p">Get your preferred hairstyle done instantly by our pros</p>
                 </Grid>

                 <Grid  className={classes.connectGrid} item xs={12} sm={6} md={3}>
                    <img alt="fine" src={require('../images/styles.png')}/>
                    <h3>TALENTED PROS</h3>
                    <p variant="p">Browse profiles, see ratings, reviews and photos of their work.</p>
                 </Grid>

                 <Grid  className={classes.connectGrid} item xs={12} sm={6} md={3}>
                    <img alt="fine" src={require('../images/calander.png')}/>
                    <h3>SCHEDULE REQUEST</h3>
                    <p variant="p">Need a home service or a different timeslot? Make a request</p>
                 </Grid>

                 <Grid  className={classes.connectGrid} item xs={12} sm={6} md={3}>
                    <img alt="fine" src={require('../images/phone.png')}/>
                    <h3>CASHLESS PAYMENT</h3>
                    <p variant="p">Subscribe to our packages and enjoy amazing offers</p>
                 </Grid>
              </Grid>
             </Box>

            </Container>

            
            <Box className={classes.becomeP}>
                 <Container maxWidth="lg">
                 <h3>Want to become a partner?</h3>
                  <p>Our goal has always been to give professionals the platform to exhibit their skills and earn extra income whilst
they do their best.</p>
                  <Link style={{textDecoration:"none",color:"white"}} to="/sign_up/partner/new"><Button className={classes.becomePBtn}>SET UP YOUR BUSINESS</Button></Link>
                 </Container>
             </Box>

             <Box >
                 <Container maxWidth="lg" className={classes.testimonials}>
                  <h3>Why clients say we are excellent</h3>
                  <Testimonials/>
                 </Container>
               
              <Box className={classes.infoBanner}>
                 <div className="overlay">
                 <Container maxWidth="lg">
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={4} lg={6}></Grid>
                    <Grid item xs={12} md={8} lg={6}>
                      <h3>Alpha-diva takes you to the next level of simple booking</h3>
                      <p>We give you variety and wide coverage. You can move into any shop subscribed on the
system worldwide. Shops are rated so you can choose where you prefers per the ratings. Don't forget to give us a thumbs up if our service best fit your match :)
</p>
                      <Button className={clsx(classes.bannerBtn,classes.infoBannerBtn)}>
                        LEARN MORE
                      </Button>
                    </Grid>
                  </Grid>
                  </Container>
                 </div>
                 
              </Box>
             </Box>
                <Packages label="Need a perfect hair cut or style? Subscribe to our amazing packages and enjoy alot of offers!"/>
             <Box >

             <Box className={clsx(classes.infoBanner,classes.infoBanner2)}>
                 <div className="overlay">
                 <Container maxWidth="lg">
                  <Grid container>
                    
                    <Grid item xs={12} md={8} lg={6}>
                      <h3>Aright, lets go shopping!</h3>
                      <p>Let's style your brand, get hair grooming and beauty products, make-ups, shaving machines, ladies hairs etc from our list of trusted vendors.
</p>
                      <Button className={clsx(classes.bannerBtn,classes.infoBannerBtn)} style={{backgroundColor:"red"}}>
                        LET'S SHOP
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}></Grid>
                  </Grid>
                  </Container>
                 </div>
                 
              </Box>

              <Box className={classes.shops_near_me}>
                <Container maxWidth="md">
                      <h3>Okay, let's get our hair done!</h3>
                      <Grid container>
                        {/* <Grid item xs={12} md={4} style={{padding:10,boxSizing:"border-box"}}>
                            <Link to="/search/salons/0/0/0" className="box">
                              <p>Hair salons near me</p>
                              <Icon>east</Icon>
                            </Link>
                        </Grid> */}

                        <Grid item xs={12} md={6} style={{padding:10,boxSizing:"border-box"}}>
                            <Link onClick={()=>{
                              getUserLocation();
                            }} className="box">
                              <p>Baber shops near me</p>
                              <Icon>east</Icon>
                            </Link>
                        </Grid>

                        <Grid item xs={12} md={6} style={{padding:10,boxSizing:"border-box"}}>
                            <Link to="/market_place/hair_grooming/0/0/0" className="box">
                              <p>Hair grooming products</p>
                              <Icon>east</Icon>
                            </Link>
                        </Grid>

                      </Grid>
                </Container>
              </Box>


            {/* <Box  className={clsx(classes.becomeP,classes.stylebanner)}>
              <Container >
                <h3>Choose your style</h3>
                <Grid container>
                    {styles.map((style)=>
                    <Grid className="style" item xs={6} lg={4}>
                    <Link to={`/search/${style.hairstyleName}/0/0/0`}>{style.hairstyleName}</Link>
                 </Grid>
                 )}
                </Grid>
              </Container>
            </Box> */}

            <Footer/>
                 
               
             </Box>

        </Box>
   </Box>
    </Box>
  );
  }
 

export default App;

