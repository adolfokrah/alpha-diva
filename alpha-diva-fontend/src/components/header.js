import React,{useState,useEffect} from 'react';
import {Container,Typography,Grid,Hidden,Avatar,makeStyles,Box,Drawer,Icon,Button,IconButton,AppBar,Toolbar,InputBase} from '@material-ui/core'
import clsx from 'clsx';
import {Link,useHistory} from "react-router-dom";
import AddressBox from './addressBox';
import '../App.css'
import config from '../includes/config';
import axios from 'axios'


const drawerWidth = "100%"
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display:"none",
    ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
      display:"block"
    }
  },
  title: {
    fontFamily:"Dancing Script",
    color:"white",
    textDecoration:"none",
    fontSize:20,
    fontWeight:"bolder",
    ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
      flexGrow:1,
      textAlign:"center"
    }
  },
  search:{
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#414141",
    '&:hover': {
      backgroundColor: "#414141",
    },
    marginRight: theme.spacing(2),
    marginLeft: 10,
    width: '40%',
    display:"block",
    ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
      display:"none"
    }
  },
  search2:{
   display:"none"
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width:'100%'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    fontFamily:"Google Sans",
    width: '100%',
    [theme.breakpoints.up('md')]: {
      //width: '20ch',
    },
  },
  grow:{
    flexGrow:1,
    ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
      display:"none"
    }
  },
  searchBtn:{
    display:"none",
    ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
      display:"block"
    }
  },
  menuBtns:{
    display:"block",
    ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
      display:"none"
    },
    fontWeight:500,
    fontSize:15,
    fontFamily:"Muli",
    textTransform:"capitalize"
  },
  forpatners:{
    display:"block",
    ['@media (max-width:928px)']: { // eslint-disable-line no-useless-computed-key
      display:"none"
    },
    fontFamily:"Muli",
    textTransform:"capitalize",
    backgroundColor:"red",
    paddingLeft:20,
    paddingRight:20,
    '&:hover':{
      backgroundColor:"#850202",
    }
  },
  header: {
    backgroundColor:"#141414",
    transition:"0.3s",
    top:0,
    left:0,
    zIndex:2000,
  },headerDefault:{
    transition:"0.3s",
    backgroundColor:"white",
    width:"90%",
    marginRight:"5%",
    marginTop:20,
    borderRadius:2,
    zIndex:2000,
    ['@media (min-width:1281px)']: {
      maxWidth:"1230px",
      left: "50%",
      marginLeft: "-615px",
    }
  },drawer: {
    width: drawerWidth,
    flexShrink: 0,
    position:"fixed",
    zIndex:2000,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor:"#141414",
    color:"white",
    paddingLeft:20,
    paddingRight:20,
    boxSizing:"border-box",
  },
  drawerTitle:{
    color:"white",
    textAlign:"left",
    fontWeight:"bold",
    flexGrow:0,
    fontSize:25
  },
  link:{
    color:"white",
    fontFamily:"Muli",
    paddingTop:15,
    paddingBottom:15,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    textDecoration:"none",
    '&:hover':{
      textDecoration:"none"
    }
  },
  linkText:{
    fontSize:15,
    fontFamily:"Muli",
    fontWeight:300,
    textDecoration:"none"
  },
  drawerHeader:{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      marginTop:20,
     marginBottom:40
  },
  searchBox:{
    display:"none",
    backgroundColor:"#141414",
    position:"fixed",
    zIndex:2000,
    width:"100%",
    paddingTop:10,
    top:60,
    paddingBottom:10,
    ['@media (max-width:928px)']:{
      display:"block"
    },
    ['@media (max-width:600px)']: {
      top:50
    }
  },
  new_search_box:{
    border:"thin solid rgba(255,255,255,0.3)",
    borderRadius:5,
    alignItems:"center",
    color:"white",
    padding:0
  },
  inputRoot2:{
    paddingTop:5,
    paddingBottom:5,
    color:"white",
  },
  inputinput2:{
    fontWeight:"200 !important",
    fontFamily:"Muli !important"
  },
  searchInputGrids:{
    padding:0,
    display:"flex",
    alignItems:"center"
  },
  searchInput:{
    borderRight:"thin solid rgba(255,255,255,0.3)",
    ['@media (max-width:600px)']: {
      borderRight:"none",
      borderBottom:"thin solid rgba(255,255,255,0.3)",
    }
  },
  searchInputAddressGrid:{
    display:"flex",
    alignItems:"center",
    borderRight:"thin solid rgba(255,255,255,0.3)",
  }
}));



const _drawerMenus = [
  {
    name:"Sign in",
    link:"Sign in"
  },
  {
    name:"Sign up",
    link:"sign_up/new_user/none"
  },
  {
    name:"Market place",
    link:"Market place"
  },
  {
    name:"Training programs",
    link:"Training programs"
  },
  {
    name:"Packages",
    link:"Packages"
  },
  {
    name:"Careers",
    link:"Careers"
  },
  {
    name:"Support",
    link:"Support"
  },
  {
    name:"About us",
    link:"About us"
  },
  {
    name:"Contact us",
    link:"Contact us"
  }
]
function App(props) {
  const classes = useStyles();

  const [scroling,setScrolling] = useState(0);
  const [open,setOpen] = useState(false)
  const history = useHistory();
  const [_search, set_search] = useState(props.search);
  const [drawerMenus, setdrawerMenus] = useState(_drawerMenus);
  const [userType, setuserType] = useState('customer');
  const [userData, setuserData] = useState([]);
  const [userName, setuserName] = useState('');
  const [initials, setinitials] = useState('');

  const toggleDrawer=()=>{
    setOpen(!open);
    //props.toggleOpen(open);
  }

  useEffect(()=>{
    window.addEventListener('scroll', handleScroll);
    CheckUserLogin();
  },[])

  function handleScroll(){
      setScrolling(window.scrollY);
  }

  function getUserLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
      var path = '/search/near_me/'+position.coords.latitude+'/'+position.coords.longitude+'/0';
      history.push(path);
    });
  }


  function CheckUserLogin(){
    axios.get(config.apiBaseUrl+'/auth/checkAuth/',{withCredentials: true}).then((response)=>{

      if(response.data == 'error'){
        return;
      }

      var userId = response.data.user_account_id;
      
      var userType = response.data.user_type;
      setuserType(userType);

      if(userType == 'partner'){ 
        const drawerMenus = [
          {
            key:"0",
            name:"Account & Settings",
            link:"account/settings"
          },{
            key:"1",
            name:'My Appointments',
            link:'account/My_Appointments'
          },{
            key:"2",  
            name:"Market place",
              link:"account/Market place"
          },{
            key:"3",  
            name:"Advertise Vacancy",
              link:"account/Advertise Vacancy"
          },{
            key:"4",  
            name:"Go to store",
              link:"account/Go to store"
          },{
            key:"5",  
            name:"Partner Policies",
              link:"Partner policies"
          },{
            key:"6",  
            name:"Help",
              link:"help"
          },{
            key:"7",  
            name:"FAQ",
              link:"faq"
          },{
            key:"8",  
            name:"Log Out",
              link:"logout"
          }
        ];

          setdrawerMenus(drawerMenus);
        
      }else{
        const drawerMenus = [
          {
            key:"0",
            name:"Account & Settings",
            link:"account/settings"
          },{
            key:"1",
            name:'My Appointments',
            link:'account/My_Appointments'
          },
          {
            key:"2",
            name:"Buy a package",
            link:"account/Buy a package"
          },
          {
            key:"3",  
            name:"Shops near me",
              link:"Shops near me"
          },{
            key:"4",  
            name:"Market place",
              link:"Market place"
          },{
            key:"5",  
            name:"FAQ",
              link:"faq"
          },{
            key:"6",  
            name:"Make a complain",
              link:"make a complain"
          },{
            key:"7",  
            name:"Call support",
              link:"call support"
          },{
            key:"8",  
            name:"Claim refund",
              link:"claim refund"
          },{
            key:"9",  
            name:"Log Out",
              link:"logout"
          }
        ];
        setdrawerMenus(drawerMenus);
      }
      axios.get(config.apiBaseUrl+'/auth/getUserDetails/'+userId+'/'+userType+'/',{withCredentials: true}).then((response)=>{
          
          setuserData(response.data[0]);

          //console.log(response);
          if(response.data[0].business_name){
              var init = response.data[0].business_name[0]+''+response.data[0].business_name[1];
              setuserName(response.data[0].business_name)
              setinitials(init.toUpperCase())

              var user = response.data[0];
              user.initials = init.toUpperCase();
              user.userName = response.data[0].business_name;
              user.type = 'partner';
              localStorage.setItem("user",JSON.stringify(user));
              
          }else{
              var init = response.data[0].first_name[0]+''+response.data[0].last_name[0];
              setuserName(response.data[0].first_name +' '+response.data[0].last_name)
              setinitials(init.toUpperCase())

              var user = response.data[0];
              user.initials = init.toUpperCase();
              user.type = 'customer';
              user.userName = response.data[0].first_name +' '+response.data[0].last_name;
              localStorage.setItem("user",JSON.stringify(user));
          }
          
      }).catch((error) => {
          
      })

   }).catch((error) => {
      
   })
  }

  const VisitorLinks =props=>{

   var links = [
    <Link key={0} style={{color:"white",textDecoration:"none"}} to="/marketplace"><Button color="inherit" style={{color:scroling < 10 && props.transparent ? "black" : "white"}} className={classes.menuBtns}>Market place</Button></Link>,
    <Link key={1} style={{color:"white",textDecoration:"none"}} to="/sign_in"><Button color="inherit" style={{color:scroling < 10 && props.transparent ? "black" : "white"}} className={classes.menuBtns}>Sign in</Button></Link>,
    <Link key={2} style={{color:"white",textDecoration:"none"}} to="/sign_up/new_user/none"><Button color="inherit" style={{color:scroling < 10 && props.transparent ? "black" : "white"}} className={classes.menuBtns}>Sign up</Button></Link>,
    <Link key={3} style={{color:"white",textDecoration:"none"}} to="/sign_up/partner/new"><Button color="inherit"  className={classes.forpatners}>For partners</Button></Link>,
   ];

   if(initials.trim().length > 0){
     links = [
      <Link key={0} style={{color:"white",textDecoration:"none"}} className={classes.menuBtns} to="/account/settings">
      <Avatar>{initials}</Avatar></Link>,
       <Link key={1} style={{color:"white",textDecoration:"none"}} to="/account/settings"><Button color="inherit" className={classes.menuBtns}>My Account  <Icon style={{position:"relative",top:6}}>keyboard_arrow_down</Icon></Button>
       </Link>
     ]
   }

  return links;
            
  };

  return (
    <Box style={{width:"100%"}}>
      <AppBar  elevation={0} className={scroling > 10 ? classes.header : props.transparent ? classes.headerDefault : classes.header}>
          
          <Container maxWidth="lg" disableGutters>
            <Toolbar>
            <IconButton onClick={()=>{setOpen(true)}} style={{color:scroling < 10 && props.transparent ? "black" : "white"}} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <Icon>menu</Icon> 
            </IconButton>
            <Link to="/" variant="h6" className={classes.title} style={{color:scroling < 10 && props.transparent ? "black" : "white"}}>
              Alpha-Diva 
            </Link>

            {/* Search Box */}

            {userType == 'customer' ?
            <Box className={clsx(classes.search,{[classes.search2]:scroling < 10 && props.transparent ? true : false,})}>
            <Box className={classes.searchIcon}>
              <Icon style={{fontSize:15}}>location_on</Icon>
            </Box>

             <AddressBox placeholder={"Search shops by location"} searchPage={true} style={{
                      backgroundColor:"transparent",
                      color:"white",
                      outline:"none",
                      border:"none",
                      borderRadius:"none",
                      marginTop:5,
                      paddingLeft:50,
                      height:25,
                      }} suggestion={(address,lat,lng)=>{
                        //var search = _search.trim().length < 1 ? 'near_me' : _search;
                        window.open(config.host+`#/search/near_me/${lat}/${lng}/${address}`,'_self');
                        props.setLatLng(address,lat,lng);
                        
                      }}
                      initialaddress={props.initialaddress}/> 
               
          
          </Box>: null}
          {/* Search Box */}

          <Box className={classes.grow} />
              
              <VisitorLinks transparent={props.transparent}/>

              {props.searchPage == true || userType == "partner"  ? <IconButton></IconButton>  : 
              <Link style={{color:"white",textDecoration:"none"}} to="/search/near_me/0/0"><IconButton color="inherit" style={{color:scroling < 10 && props.transparent ? "black" : "white"}} className={classes.searchBtn} onClick={getUserLocation}><Icon>search</Icon></IconButton></Link> }

              
          </Toolbar>
          </Container>
      </AppBar>
      {props.searchPage ?
        <Box className={classes.searchBox}>
           <Container maxWidth="lg">
            <Grid item xs={12} sm={12} md={12} lg={8}>
              
            <Grid container className={classes.new_search_box}>
              {/* <Grid className={clsx(classes.searchInputGrids,classes.searchInput)}  item xs={12} sm={6} md={6} lg={6}>
                <Box className={classes.searchIcon}>
                  <Icon>search</Icon>
                </Box>
                <InputBase
                  
                  placeholder="Type your search"
                  classes={{
                    root: classes.inputRoot2,
                    input: clsx(classes.inputInput,classes.inputInput2),
                  }}
                  value = {_search}
                  onChange = {(e)=>{
                    set_search(e.target.value)
                  }}
                  onKeyDown={(e)=>{
                    if(e.keyCode === 13){
                      props.onSearch(e.target.value)
                    }
                  }}
                  // inputProps={{ 'aria-label': 'search' }}
                />
              </Grid> */}
              <Grid className={clsx(classes.searchInputGrids)} item xs={12}>
              
                  <Grid item xs={8} className={classes.searchInputAddressGrid}>
                    <Box style={{marginLeft:15}}>
                    <Icon>location_on</Icon>
                    </Box>

                    <AddressBox placeholder={"Location"} searchPage={true} style={{
                      backgroundColor:"transparent",
                      color:"white",
                      outline:"none",
                      border:"none",
                      borderRadius:"none",
                      marginTop:5,
                      }} suggestion={(address,lat,lng)=>{
                        //var search = _search.trim().length < 1 ? 'near_me' : _search;
                        window.open(config.host+`#/search/near_me/${lat}/${lng}/${address}`,'_self');
                        props.setLatLng(address,lat,lng);
                        
                      }}
                      initialaddress={props.initialaddress}/>
                      
                  </Grid>
                  <Grid item xs={2} style={{borderRight:"thin solid rgba(255,255,255,0.3)",lineHeight:"55px",height:"55px"}} onClick={()=>{
                    getUserLocation();
                  }}>
                     <center><IconButton onClick={getUserLocation}><Icon style={{color:"white"}}>my_location</Icon></IconButton></center>
                  </Grid>
                  <Grid item xs={2}>
                     <center><IconButton  onClick={()=>{props.showMap()}}><Icon style={{color:"white"}}>maps</Icon></IconButton></center>
                  </Grid>
                </Grid>
            </Grid>
            </Grid>
           </Container>
        </Box>
      : null}

      <Drawer
        className={clsx(classes.drawer)}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Box className={classes.drawerHeader}>
        <Link to="/" style={{textDecoration:"none"}}>
        <Typography variant="h6" className={clsx(classes.title,classes.drawerTitle)}>
             Alpha-Diva
        </Typography>
        </Link>
        <IconButton style={{marginRight:-10}} onClick={()=>{setOpen(false)}}>
            <Icon style={{color:"white",fontSize:18}}>close</Icon>
        </IconButton>
        </Box>

          {drawerMenus.map((menu,index)=>{
            var link = '/new_user/none';
            if(menu !== 'Sign up'){
              link = '';
            }
            return(
              <Link key={index} onClick={()=>{setOpen(false)}} className={classes.link} to={'/'+menu.link.toLowerCase().replace(/ /g,'_')+link}>
                <Typography className={classes.linkText}>{menu.name}</Typography>
                <Icon>keyboard_arrow_right</Icon>
              </Link>
            )
          })}
      </Drawer>
    </Box>
  );
  }
 

export default App;

