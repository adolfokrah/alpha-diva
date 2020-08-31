import React,{useState,useEffect} from 'react';
import {makeStyles,Box,AppBar,Hidden,useScrollTrigger,Button,Toolbar,Icon,Grid} from '@material-ui/core'
import {Link,useParams} from "react-router-dom";
import clsx from 'clsx';
import Config from '../includes/config'
import Header from '../components/header'
import LoginHeader from '../components/LoginHeader'
import axios from 'axios';
import '../App.css'
import { GoogleMap,Marker, Circle,InfoBox,OverlayView } from '@react-google-maps/api';
import ContentLoader  from 'react-content-loader'


const exampleMapStyles = [
  {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "poi.attraction",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.attraction",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.attraction",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.business",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.business",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.business",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.government",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.government",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.government",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.medical",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.medical",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.medical",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.place_of_worship",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.place_of_worship",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.place_of_worship",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.school",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.sports_complex",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  }
];

const options = {
  strokeColor: '#FF0000',
  strokeOpacity: 1,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.05,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 9000,
  zIndex: 1
}

const useStyles = makeStyles((theme) => ({
    header: {
        backgroundColor:"#141414",
        transition:"0.3s",
        top:0,
        left:0,
    },
    content:{
      position:"fixed",
      paddingTop:60,
      height:"100vh",
      top:0,
      ['@media (max-width:928px)']:{
        paddingTop:125
      }
    },
    contentHeader:{
      backgroundColor:"white",
      boxShadow:"-2px 1px 3px 1px rgba(0,0,0,0.2)",
      position:"relative",
      zIndex:200
    },
    contentMenus:{
      padding:15,
      textAlign:'center',
      borderRight:"thin solid rgba(0,0,0,0.1)",
      cursor:"pointer",
      fontSize:13,
      fontWeight:500,
      fontFamily:"Google Sans",
      ['@media (max-width:928px)']:{
        fontSize:10,
      }
    },
    contentBody:{
      backgroundColor:"white",
      height:"78vh",
      maxHeight:"1200px",
      overflowY:"auto",
      padding:10,
    },
    contentMap:{
      height:"100%",
    },
    infoBox:{
      width:190,
      height:200,
      backgroundColor:"white",
      boxShadow:"0px 0px 3px 1px rgba(0,0,0,0.1)"
    },
    caret:{
      color:"white",
      transform: "rotate(90deg)",
      fontSize:40,
      marginTop:-15,
     
    },
    shopLogo:{
      height:120,
      backgroundSize:"cover",
      backgroundRepeat:"no-repeat",
      backgroundColor:"#ccc",
      backgroundPosition:"center",
      
    },
    infoBoxContent:{
      padding:10,
      '& h5':{
        whiteSpace: "nowrap",
        overflow:"hidden",
        width:170,
        textOverflow: "ellipsis !important",
        margin:0,
        padding:0,
        fontSize:13,
        fontFamily:"Muli",
      },
      '& p':{
        whiteSpace: "nowrap",
        overflow:"hidden",
        width:170,
        textOverflow: "ellipsis !important",
        marginBottom:10,
        color:"rgba(0,0,0,0.7)",
        margin:0,
        padding:0,
        marginTop:5
      }
    },
    storeDetails:{
        padding:"0px 10px 10px 10px",
        '& h3':{
            margin:0,
            color:"#000",
            fontFamily:"Muli",
            fontSize:15,
            marginBottom:8
        }
    },
    star:{
        color:"red",
        fontSize:17
    },
    stars:{
        display:"flex",
        alignItems:"center",
        fontFamily:"Muli,",
        color:"#ccc"
    },
    location:{
        fontSize:14,
        marginTop:5,
        color:"#88888a",
        display:"flex",
        alignItems:"center",
        fontFamily:"Muli"
    },
    openStatus:{
        fontSize:12,
        fontFamily:"Google Sans",
        display:"flex",
        flexDirection:"row-reverse",
        color:"red"
    }
}));


const Tabs = ['ALL','AT BUSINESS','HOME SERVICE'];

const containerStyle = {
  width: '100%',
  height: '100%'
};


const _shops =[
  {
    lat:55.378051,
    lng:-3.435973
  }
]



function App(props) {
  const classes = useStyles();
  const params = useParams();
  const trigger = useScrollTrigger();
  const [user, setuser] = useState([]);
  const [lat, setlat] = useState(0);
  const [lng, setlng] = useState(0);
  const [userCurrentAddress, setuserCurrentAddress] = useState("");
  const [currentTab, setcurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [startSearch, setStartSearch] = useState(0);
  const [_infoBox, set_infoBox] = useState(false);
  const [_infoBoxLat, set_infoBoxLat] = useState(0);
  const [_infoBoxLng, set_infoBoxLng] = useState(0);
 const [current, setcurrent] = useState(0);
 const [_type, set_type] = useState("ALL");
 const [refs, setrefs] = useState([]);
 const [_showMap, set_showMap] = useState(false);
 const myRef = React.createRef()
  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("user"));
    if(user != null){
        setuser(user);
    }

    getCoordinatesAddress();

  }, []);

  async function getCoordinatesAddress(){
    setlat(params.lat);
    setlng(params.lng);
    

    //get user location address
    if(params.address !=='0'){
      setuserCurrentAddress(params.address);
      fetchShops(params.lat,params.lng,'ALL',0);
      return;
    }

    if(params.lat !== "0"){
      
      try {
        var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${params.lat},${params.lng}&key=${Config.mapsApiKey}`;
        var request = await axios.get(url);
        var results = request.data;
        
        setuserCurrentAddress(results.results[0].formatted_address);
      } catch (error) {
        //console.error("Connection failed");
      }
    
      fetchShops(params.lat,params.lng,'ALL',0);
    }

    
  }

  async function fetchShops(_lat,_lng,type,start){   
    try {

      if(start == 0){
        setLoading(true);
        setShops([]);
        setStartSearch(0)
        set_infoBox(false);
      }
      const request = await axios.get(Config.apiBaseUrl+`/fetchShops/${_lat}/${_lng}/${start}/${type}`);
      setLoading(false);
      var results = request.data;
      const nrefs = results.reduce((acc, value,index) => {
        acc[index] = React.createRef();
        return acc;
      }, {});
      if(results.length > 0){
          var nresults = start == 0 ? [] : shops;
          //nresults.concat(results);
          results.forEach((shop) => {
              nresults.push(shop);
          })
          setShops(nresults);
          setrefs(nrefs);
          setStartSearch(startSearch+10);
      }
     
     
    } catch (error) {
      
    }
    
  }

  const Rating =props=>(
    <Box className={classes.stars}>
        <Icon className={classes.star}>star</Icon>
        <Icon className={classes.star}>star</Icon>
        <Icon className={classes.star}>star</Icon>
        <Icon className={classes.star}>star</Icon>
        <Icon className={classes.star}>star</Icon>
        <strong style={{color:"#000",fontSize:13}}>{props.rate/100 * 5}/5</strong><span style={{color:"rgba(0,0,0,0.5)",marginLeft:10}}>({props.reviews})</span>
    </Box>
  );


 
 
  const handleClick = id =>{
    refs[id].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
  }

  const Distance = props=>{
    var lat1 = props.lat1;
    var lon1 = props.lon1;
    var lat2 = props.lat2;
    var lon2 = props.lon2;

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    d = d.toFixed(2);
    return(
        <span>{d} km</span>
    )
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  function scrolling(e){
    const node = myRef.current
    const scrolling = node.scrollHeight - node.scrollTop;
    const clientHeight =  node.clientHeight;
    const bottom = scrolling - clientHeight < 2;
    if(bottom){
        fetchShops(lat,lng,_type,startSearch);
    }
  }
  
  const ShopBox = props=>{
      var shop = props.shop;
      var index = props.index;

      return(
        <Box style={{marginBottom:10,borderRight:current == index ? "2px solid red" : "none",textDecoration:"none"}}>
        <Link to={`/shopDetails/${shop.accountId}`} style={{textDecoration:"none"}} ref={refs[index]}>
         <Grid container>
             <Grid item xs={4} sm={3} md={4} lg={4}>
             <img style={{borderRadius:2}} width="100%" src={`${Config.apiEndPoint+''+shop.storeLogo.replace('public/','')}`}/>
             </Grid>
             <Grid item xs={8} className={classes.storeDetails}>
                 <h3>{shop.business_name}</h3>
                 <Rating rate={shop.rating} reviews={shop.reviews}/>
                 <Box className={classes.location}>
                       <span>{shop.businessLocation}</span>
                 </Box>
                 <Box className={classes.location}>
                     <Icon style={{fontSize:16}}>near_me</Icon> <Distance lat1={lat} lon1={lng} lat2={shop.storelat} lon2={shop.storelng}/>
                 </Box>
                 <Box className={classes.openStatus}>
                     {shop.closed == 'true' ? <span>Closed Now</span> : <span style={{color:"green"}}>Opened Now</span>}
                 </Box>
             </Grid>
         </Grid>
         {index < (shops.length - 1) ? <Box style={{height:1,backgroundColor:"#ccc"}}/> : null}
        </Link>
        </Box>
      )
  }


  return (
    <Box>
        <Header initialaddress={userCurrentAddress} search={params.query === "near_me" ? "": params.query} searchPage={true}
        
        setLatLng={(address,lat,lng)=>{
          setuserCurrentAddress(address);
          setlat(lat);
          setlng(lng);

          fetchShops(lat,lng,_type,0)
        }}
        

        onSearch={(value)=>{
           var url = Config.host+`#/search/${value}/${lat}/${lng}/${userCurrentAddress}`;
           window.location = (url);
        }}
        showMap={()=>{
            set_showMap(!_showMap);
        }}
        />
        
        {/* Contents */}
        <Grid container className={classes.content}>

          <Grid item xs={12} sm={12} md={3} lg={3} style={{display:window.innerWidth <= 928 && _showMap ? "none" : "block"}}>
             <Grid container className={classes.contentHeader}>
               {Tabs.map((tab,index)=>
                <Grid key={index} onClick={()=>{
                  if(currentTab != index){
                    setcurrentTab(index);
                    setStartSearch(0);
                    set_type(tab);
                    fetchShops(lat,lng,tab,0);
                  }
                  
                }} key={index} style={{backgroundColor:currentTab == index ? "rgba(255,0,0,0.1)" : "white"}} className={classes.contentMenus} item xs={4}>
                  {tab}
                </Grid>
               )}
             </Grid>

             {shops.length < 1 && !loading ? 
                <div style={{width:200,margin:'auto',marginTop:50}}>
                    <center><p style={{fontSize:14}}>Sorry, we couldn't find any results in <span style={{color:"red"}}>{userCurrentAddress}</span></p>
                    <Button style={{backgroundColor:"black",color:"white",fontSize:10,borderRadius:0}}>Retry search</Button>
                    </center>
                </div>
             : null}
             {loading ? <div style={{padding:10}}>

                <ContentLoader viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>

             </div> : null}
             {!loading  ? 
             <Box className={classes.contentBody} onScroll={scrolling}   ref={myRef}>
             {/* Contents come here */}
             {shops.map((shop,index)=>
               <ShopBox shop={shop} index={index}/>
             )}
           </Box> : null}
          </Grid>

           <Grid className={classes.contentMap} item xs={12} sm={12} md={9} lg={9}>
           
            <GoogleMap
                options={{
                  styles: exampleMapStyles,
              }}
              mapContainerStyle={containerStyle}
              center={{lat:Number(lat),lng:Number(lng)}}
              zoom={13}
              onClick={()=>{
                set_infoBox(false)
              }}
            >
              { /* Child components, such as markers, info windows, etc. */ }
              {/* <Circle center={{lat:Number(lat),lng:Number(lng)}} options={options}/> */}

              {shops.map((shop,index)=>
                <Marker
                onClick={()=>{
                  set_infoBox(true);
                  set_infoBoxLat(shop.storelat);
                  set_infoBoxLng(shop.storelng);
                  setcurrent(index);
                  handleClick(index);
                }}
                icon={{
                  url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAABmJLR0QA/wD/AP+gvaeTAAADHUlEQVRYhbXYzWtcVRjH8c9JJlVHQZFgQkFFi4roykGLjWOi2GLpwi5a1D/ARX0BS0W01J0LEUsXLkRXFbUiQcVWqGLVkBlbRALWEruqRaHQ1Fi7iCnamTkuTEvJ3Htm5mZ8ls/L73zPveee85wbrMDihGGMahhWMo/TYcp8Ub3QM8C4qugJ0UbckpHyi+ig4MNQ893/AhPHVbW8igd70J/Crm6hOsLECSUtu0SvYKAHkEsSgjf95YUw40JhmLjRFRbsx4YCEMvtC2c9Fmb9k5eQO9O41aAF7/cJBB51vY/ihFLPMOa8jC19ArlomzXsyAtmvqa4zhqDjuGqhHBD8KmWQwbMaxkWrMdm8mePRcHdYdrJ5YHsopKdYhLkOLaEaT8v878Tx9xlwCTuzKkti3biqeWBticTJ1yp6TSuzRH7VdN94bAzeaRxnRsM+gE35aScc43RcNDflzvb10zLhgQIPJ8CgXDYGcH2RMp1Fjyy3Jm1gO/JlYjm1OxPgVyyEZ/h90RG2zjtMNFIbnlwNNDqhiVMaop+TGiNdoZJW3IHzRgwPz+2j50Fk1oPt/cEwx25kWCuM0xwNCF+W3xApRuKOO5erMlPaH+F7TANdel1sSdWDCVBKoa07EmkNA2qd4RZ+myncmWCqrL34v3Zm2KsKLvaBxhLwHyb1YRl78DRXsHDCbHHlayNVbsNOqRhTsmIpvXYIbo5UUuwN9udxVIxpOwEbkyKFrHglD/cmtVKZH7aS03Q630Hgei1vJ4mf58Z9RaO9RnluEVv5wVzYcKkJsnzpYhtT7WeyR041HwtONAXjOBAqPkyldL5OLhgG86uEOWclmc7JXWECUecEjy3IpTo6VD3W8exutar2ocnC6B8HGrd9dLdn9rRM7T3rR3spNjeXq4YJtT96b9me7HLkvOirUt1/YWBUPOT0OVMg22hbqYX/Z6vq2HaPtHuDmlvhGnv9qpd5O5M3YuiT3Kinxv1UhHZnn+JXLRYUVb2DdZe5v5ew0PhiPNFNIs9GYQZi1bZhNkl16xVNhUF6YvFMatj1VdxzOqVav0Ln17Xrn0u2pEAAAAASUVORK5CYII=',
                }}
                clickable={true}
                key = {index}
                zIndex={0}
                position={{lat:Number(shop.storelat),lng:Number(shop.storelng)}}
              >

             {_infoBox && current == index  ? 
              <OverlayView
              onClick={()=>{
                
              }}
              options={{
                alignBottom: true,
                pane: 'mapPane',
                boxStyle: {
                  width: '300px'
                },
                closeBoxURL: ``,
                enableEventPropagation: true,
                 zIndex:1
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
             
              position={{lat:Number(_infoBoxLat),lng:Number(_infoBoxLng)}}
              zIndex={2}
            >
                <Box style={{marginLeft:-95,marginTop:-245}}>
                <Box className={classes.infoBox}>
                  <Box className={classes.shopLogo} style={{backgroundImage:`url(${Config.apiEndPoint+''+shop.storeLogo.replace('public/','')})`}}/>
                  <Box className={classes.infoBoxContent}>
                     <h5>{shop.business_name}</h5>
                     <p>{shop.businessLocation}</p>
                     <div style={{display:"flex",alignItems:"center"}}>
                        <Icon style={{fontSize:16,color:"red",marginRight:10}}>star</Icon>
                        <strong>{shop.rating/100 * 5}/5</strong><span style={{color:"rgba(0,0,0,0.5)",marginLeft:10}}>{shop.reviews} reviews</span>
                     </div>
                  </Box>
                </Box>
                <center><Icon className={classes.caret}>play_arrow</Icon></center>
                </Box>
            </OverlayView> : null}
              </Marker>
              )}

              
            </GoogleMap>
          
            </Grid>
        </Grid>
        {/* Contents end */}
    </Box>
  );

  }
 

export default App;

