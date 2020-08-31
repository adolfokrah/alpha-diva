import React,{useState,useEffect} from 'react';
import {Container,Avatar,Typography,makeStyles,Box,Drawer,Divider,Popover,Icon,Button,IconButton,AppBar,Toolbar,InputBase} from '@material-ui/core'
import clsx from 'clsx';
import {Link,useHistory} from "react-router-dom";
import '../App.css'
import Config from '../includes/config'
import axios from 'axios'
import CheckAuth from '../includes/checkAuth'

const drawerWidth = "100%"
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontFamily:"Dancing Script",
    color:"white",
    textDecoration:"none",
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
  menuButton:{
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
    fontWeight:300,
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
    transition:"background 0.6s",
    position:"fixed",
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

  }
}));


const customerMenu = [
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

function App(props) {
  const classes = useStyles();

  const [scroling,setScrolling] = useState(0);
  const [open,setOpen] = useState(false)
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setuserData] = useState([]);
  const [initials, setinitials] = useState("");
  const [userName, setuserName] = useState("");
  const [userType, setuserType] = useState("");
  const [menu, setmenu] = useState(customerMenu);
  const [_search, set_search] = useState(props.search);

  const toggleDrawer=()=>{
    setOpen(!open);
    //props.toggleOpen(open);
  }

  useEffect(()=>{
    

    axios.get(Config.apiBaseUrl+'/auth/checkAuth/',{withCredentials: true}).then((response)=>{


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

            setmenu(drawerMenus);
          
        }
        axios.get(Config.apiBaseUrl+'/auth/getUserDetails/'+userId+'/'+userType+'/',{withCredentials: true}).then((response)=>{
            
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
   
  },[])

  useEffect(()=>{
    window.addEventListener('scroll', handleScroll);
  })

  function handleScroll(){
      setScrolling(window.scrollY);
  }


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openP = Boolean(anchorEl);
  const id = openP ? 'simple-popover' : undefined;

  return (
    <Box>
      <AppBar elevation={0} position="fixed" style={{backgroundColor:scroling  > 10 || !props.transparent ? "#141414" : "transparent"}} className={classes.header}>
          
          <Container maxWidth="lg" disableGutters>
            <Toolbar>
            <IconButton onClick={toggleDrawer} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <Icon>menu</Icon> 
            </IconButton>
            <Link to="/" variant="h6" className={classes.title}>
          
              Alpha-Diva
            </Link>


{userType == "partner" ? <Box></Box> : <Box>
<Box className={clsx(classes.search,{[classes.search2]:scroling < 10 && props.transparent ? true : false,})}>
            <Box className={classes.searchIcon}>
              <Icon>search</Icon>
            </Box>
            <InputBase
              
              placeholder="Search shops and freelancers"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value = {_search}
              onChange={(e)=>{
                set_search(e.target.value);
              }}
              onKeyDown={(e)=>{
                if(e.keyCode === 13){
                  history.push(`search/${e.target.value}/0/0`)
                }
              }}
              // inputProps={{ 'aria-label': 'search' }}
            />
          </Box>
  </Box>}
            
          <Box className={classes.grow} />


            <Link style={{color:"white",textDecoration:"none"}} className={classes.menuBtns} to="/account/settings">
            <Avatar>{initials}</Avatar></Link>
              <Link style={{color:"white",textDecoration:"none"}} to="/account/settings"><Button onClick={handleClick}  color="inherit" className={classes.menuBtns}>My Account  <Icon style={{position:"relative",top:6}}>keyboard_arrow_down</Icon></Button>
              </Link>
             
              {userType == "partner" ? <Box></Box> : <Link style={{color:"white",textDecoration:"none"}} to="/search"><IconButton color="inherit" className={classes.searchBtn}><Icon>search</Icon></IconButton></Link>}
          </Toolbar>
          </Container>
      </AppBar>

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
        <Link to='/account/settings' style={{textDecoration:"none"}}>
        <Typography variant="h6" className={clsx(classes.title,classes.drawerTitle)}>
             Alpha-Diva
        </Typography>
        </Link>
        <IconButton style={{marginRight:-10}} onClick={()=>{setOpen(false)}}>
            <Icon style={{color:"white",fontSize:18}}>close</Icon>
        </IconButton>
        </Box>

          {menu.map((menu,index)=>{
            menu.key = index;
            var link = '/new_user/none';
            if(menu !== 'Sign up'){
              link = '';
            }
            return(
              <Link key={index} onClick={()=>{
                setOpen(false);
                //console.log('hell world')
              }} className={classes.link} to={'/'+menu.link.toLowerCase().replace(/ /g,'_')+link}>
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

