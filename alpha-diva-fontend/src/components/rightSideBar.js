import React,{useState,useEffect} from 'react';
import {Container,Grid,makeStyles,Avatar,Box,Typography} from '@material-ui/core'
import {NavLink} from "react-router-dom";
import Config from '../includes/config';
const useStyles = makeStyles((theme) => ({
    sidebar:{
        borderRight:"1px solid rgba(0,0,0,0.06)",
        paddingTop:50
    },
    avatar:{
        width:70,
        height:70,
        fontSize:30,
        marginRight:10,
        border:"thin solid #ccc"
    },
    header:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        paddingBottom:30,
        '& h3':{
            marginBottom:5,
            marginTop:0
        },
        '& span':{
            fontSize:14,
            color:"rgba(0,0,0,0.5)"
        }
    },
    links:{
        boxSizing:"border-box",
        borderTop:"thin solid rgba(0,0,0,0.06)",
        width:"100%",
        cursor:"pointer",
        '&:hover':{
            backgroundColor:"rgba(0,0,0,0.02)"
        },
       display:"flex"
    },
    link:{
        width:"100%",
        boxSizing:"border-box",
        textDecoration:"none",
        color:"rgba(0,0,0,0.7)",
        fontFamily:"Muli",
        padding:18,
        paddingLeft:0
    },
    logout:{
        boxSizing:"border-box",
        textDecoration:"none",
        color:"rgba(0,0,0,0.3)",
        fontWeight:"bold",
        fontFamily:"Muli",
        padding:18,
        paddingLeft:0
    },
    active:{
        borderLeft:'3px solid black',
        paddingLeft:20,
        color:"black",
        fontWeight:"bold"
    }
   
}));
  

const customerMenu = [
    {
      name:"Account & Settings",
      link:"account/settings"
    },{
      name:'My Appointments',
      link:'account/My_Appointments'
    },
    {
      name:"Buy a package",
      link:"account/Buy a package"
    },
    {
        name:"Shops near me",
        link:"Shops near me"
    },{
        name:"Market place",
        link:"Market place"
    },{
        name:"FAQ",
        link:"faq"
    },{
        name:"Make a complain",
        link:"make a complain"
    },{
        name:"Call support",
        link:"call support"
    },{
        name:"Claim refund",
        link:"claim refund"
    },{
        name:"Log Out",
        link:"logout"
    }
];


function App(props){
    const classes = useStyles();
    const [menu, setmenu] = useState(customerMenu);
    const [phoneNumber, setphoneNumber] = useState("");
    const [userName, setuserName] = useState("");
    const [initials, setinitials] = useState("");
    const [storeLogo, setstoreLogo] = useState("");

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem("user"));
        //console.log(user.phohe);
        setphoneNumber(user.accountID ? user.accountID : user.accountId)
        setinitials(user.initials)
        setuserName(user.userName)
        if(user.storeLogo){
            setstoreLogo(user.storeLogo);
        }

        if(user.type == "partner"){
            const drawerMenus = [
                {
                  name:"Account & Settings",
                  link:"account/settings"
                },{
                  name:'My Appointments',
                  link:'account/My_Appointments'
                },{
                    name:"Market place",
                    link:"Market place"
                },{
                    name:"Advertise Vacancy",
                    link:"account/Advertise Vacancy"
                },{
                    name:"Go to store",
                    link:"account/Go to store"
                },{
                    name:"Help",
                    link:"help"
                },{
                    name:"FAQ",
                    link:"faq"
                },{
                    name:"Log Out",
                    link:"logout"
                }
              ];
            setmenu(drawerMenus);
        }
    }, []);
   return(
    <Box className={classes.sidebar}>
        <Box className={classes.header}>
            {storeLogo ? <Avatar className={classes.avatar} src={Config.apiEndPoint+''+storeLogo.replace('public/','')}></Avatar> : <Avatar className={classes.avatar}>{initials}</Avatar>}
            <Box >
                 <h3>{userName}</h3>
   <span>{phoneNumber}</span>
            </Box>
        </Box>

    
        {menu.map((menu,index)=>{
            
            return(
              <Box key={index} className={classes.links}>
                <NavLink  activeClassName={classes.active}  className={menu.link == "logout" ? classes.logout:classes.link} to={'/'+menu.link.toLowerCase().replace(/ /g,'_')}>
                    {menu.name}
                </NavLink>
              </Box>
            )
          })}

    </Box>
   )
}

export default App;