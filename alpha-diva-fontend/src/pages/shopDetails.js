import React,{useState,useEffect} from 'react';
import {Box,Container,Grid,Icon,TextField,Snackbar,Checkbox,makeStyles,Button,LinearProgress,withStyles,IconButton,CircularProgress} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import '../App.css'
import {useParams,useHistory} from "react-router-dom";
import axios from 'axios';
import Config from '../includes/config'
import Header from '../components/header';
import ContentLoader  from 'react-content-loader'
import 'react-bnb-gallery/dist/style.css'
import ReactBnbGallery from 'react-bnb-gallery';
import { GoogleMap,Marker, Circle,InfoBox,OverlayView } from '@react-google-maps/api';
import PackageSummaryModal from '../components/packageSummaryModal';

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

const useStyles = makeStyles((theme) => ({
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
    shopDetails:{
        paddingLeft:20,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        '& h3':{
            marginTop:0,
            marginBottom:10
        },
    },
    btn:{
        borderRadius:0,
        backgroundColor:"#000",
        color:"white",
        fontSize:12,
        padding:5,
        fontWeight:"bold",
        paddingLeft:20,
        paddingRight:20,
        '&:hover':{
            backgroundColor:"black"
        }
       
    },
    openStatus:{
        fontSize:12,
        color:"red",
        marginTop:10
    },
    images:{
        backgroundSize:"Cover",
        backgroundRepeat:"no-repeat",
        backgroundPosition:"center"
    },
    overlay:{
        backgroundColor:"rgba(0,0,0,0.5)",
        width:"100%",
        alignItems:"center",
        display:"grid",
        placeItems:"center",
    },
    businessHours:{
        color:"rgba(0,0,0,0.7)",
        fontSize: 12,
        lineHeight:0.1,
        // lineHeight:0.5,
    },
    day:{
        textAlign:"right",
        paddingRight:10
    },
    modal:{
        width:"100%",
        height:"100vh",
        position:"fixed",
        top:0,
        backgroundColor:"rgba(0,0,0,0.5)",
        display:"grid",
        placeItems:"center"
    },
    modalBox:{
        width:280,
        textAlign:"center",
        
        backgroundColor:"white"
    },
    header:{
        backgroundColor:"rgba(0,0,0,0.1)",
        fontSize:14,
        padding:10
    },
    label:{
        fontFamily:"Google Sans",
        marginBottom:25,
        fontSize:13
    },
    select:{
        border:"2px solid #000",
        marginLeft:0,
        marginTop:5,
        padding:15,
        width:"100%",
        backgroundColor:"white",
        fontFamily:"Google Sans",
        '&:focus':{
            boder:"none",
            outline:"none"
        }
    }
}));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 5,
      borderRadius: 5,
      width:170
    },
    colorPrimary: {
      backgroundColor: "#ccc",
    },
    bar: {
      borderRadius: 5,
      backgroundColor: 'red',
    },
  }))(LinearProgress);


const stars = [
    {
        name:"5 star",
        count:0
    },
    {
        name:"4 star",
        count:0
    },
    {
        name:"3 star",
        count:0
    },
    {
        name:"2 star",
        count:0
    },
    {
        name:"1 star",
        count:0
    }
];
function App(){
    const classes = useStyles();
    const params = useParams();
    const history = useHistory();
    const [shopId, setShopId] = useState(params.id);
    const [shopDetails, setShopDetails] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [start, setStart] = useState(0);
    const [endStart, setEndStart] = useState(5);
    const [_loading, set_loading] = useState(false);
    const [_open_gallery, set_open_gallery] = useState(false);
    const [_photos, set_Photos] = useState([]);
    const [imageActiveIndex, setImageActiveIndex] = useState(0);
    const [_stars, set_Stars] = useState(stars);
    const [d_reviews, setd_reviews] = useState([]);
    const [businessHours, setBusinessHours] = useState([]);
    const [showModal, setshowModal] = useState(false);
    const [login, setLogin] = useState(false);
    const [subscribedPackage, setSubscribedPackage] = useState([]);
    const [addOnBenefits, setAddOnBenefits] = useState([]);
    const [addOnServices, setAddOnServices] = useState([]);
    const [appointmentDate, setappointmentDate] = useState(new Date().toJSON().slice(0, 10)+'T'+("0" + new Date().getHours()).slice(-2)+':'+("0" + new Date().getMinutes()).slice(-2));
    const [place_booking, setPlace_booking] = useState(false);
    const [minDate, setMinDate] = useState(appointmentDate);
    const [showModal2,setshowModal2] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const [baseHairStyles, setBaseHairStyles] = useState([]);
    const [showModal1, setshowModal1] = useState(false);
    const [otherServices, setotherServices] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [error, seterror] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
    const [clientSecret, setclientSecret] = useState("");
   

    useEffect(() => {
        fetchJobDetails();
        var user = JSON.parse(localStorage.getItem("user"));
        setUserDetails(user);
    }, []);

    
    async function fetchJobDetails(){
        try {
            set_loading(true);
            const request = await axios.get(Config.apiBaseUrl+`/shopDetails/${shopId}/${start}`);
            set_loading(false);
            setShopDetails(request.data.storeInfo);
            setGallery(request.data.gallery);
            setReviews(request.data.reviews);
            setBusinessHours(request.data.businessHours);
            var stars = _stars;
            request.data.reviews.forEach((review) => {
                var index = 0;
                switch (Number(review.rate)) {
                    case 1:
                        index = 4;
                        break;
                    case 2:
                        index = 3;
                        break;
                    case 3:
                        index = 2;
                        break;
                    case 4:
                        index = 1;
                        break;
                    default:
                        index = 0;
                        break;
                }
                stars[index]['count'] += 1;
            })
            var photos = [];
            request.data.gallery.forEach((image) => {
                image.large = Config.apiEndPoint+''+image.large.replace('public/','');
                photos.push(image.large);
            })
            set_Stars(stars);
            set_Photos(photos);
            LoadReviews(request.data.reviews);

            if(request.data.storeInfo.length < 1){
                history.push('/404');
            }
            
            
        } catch (error) {
            
        }
    }

    function LoadReviews(reviews){
        var d = d_reviews;
        var mreviews = d;
        var end  =  reviews.length  > endStart ? endStart : reviews.length;
        for (let index = start; index < end; index++) {
            mreviews.push(reviews[index]);
        }
        var end = endStart+5 > reviews.length ? reviews.length : endStart+5;
        
        setStart(endStart);
        setEndStart(end);
        setd_reviews(mreviews);

    }

    const Rating =props=>(
        <Box className={classes.stars}>
            <Icon className={classes.star}>star</Icon>
            <Icon className={classes.star}>star</Icon>
            <Icon className={classes.star}>star</Icon>
            <Icon className={classes.star}>star</Icon>
            <Icon className={classes.star}>star</Icon>
            <strong style={{color:"#000",fontSize:13}}>{props.rate/100 * 5}/5</strong><span style={{color:"rgba(0,0,0,0.5)",marginLeft:10}}>({reviews.length})</span>
        </Box>
      );

    const Stars=props=>{
        var stars = [];

        for (let index = 0; index < props.rate; index++) {
            stars.push(
                <Icon className={classes.star}>star</Icon>
            )
        }

        for (let index = 0; index < (5-props.rate); index++) {
            stars.push(
                <Icon style={{color:"#ccc"}} className={classes.star}>star</Icon>
            )
        }

        return stars;
    }

   
    function shareLink(to){
        var url = 'example.org'
        if(to == 'facebook'){
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`,'_blank');
        }else if(to == "twitter"){
            window.open(`https://twitter.com/share?url=${url}`,'_blank');
        }else{
            window.open(`whatsapp://send?text=${url}`,'_blank');
        }
    }

    async function bookAppointment(){
        set_loading(true);
        const request = await axios.get(Config.apiBaseUrl+'/auth/checkAuth/',{withCredentials: true});
        set_loading(false);
        if(request.data == 'error'){
            var path = 'shopDetails_'+shopDetails[0].accountId;
            path = encodeURI(path);
            history.push('/sign_in/'+path);
            return;
        }

        //console.log(request.data.user_type);
        if(request.data.user_type == "partner"){
            setshowModal(true);
            setLogin(true);
            return;
        }

        if(shopDetails[0].home_service == 'YES'){
            
            setshowModal(true);
        }else{
            setshowModal1(true);
            fetchCustomerPackage();
        }

    }

    async function fetchCustomerPackage(){
       
        set_loading(true);
        var url  = Config.apiBaseUrl+'/auth/fetchUserSubscription/';
        const request = await  axios.get(url,{withCredentials: true});
        set_loading(false);
        if(request.data == 'expired'){
            return;
        }else if(request.data == 'none'){
            return;
        }else{
            setSubscribedPackage(request.data);

            var f_addOnBenefits = request.data.addOnBenefits;
            var f_addonOtherServices = request.data.addonOtherServices;

            var new_addOnBenefits = [];
            var new_addOnService = [];

            f_addOnBenefits.forEach((benefit) => {
                if(benefit.fixed){
                    new_addOnBenefits.push(benefit);
                }
            })

            f_addonOtherServices.forEach((service) => {
                if(service.fixed){
                    new_addOnService.push(service);
                }
            })

            setAddOnBenefits(new_addOnBenefits);
            setAddOnServices(new_addOnService);
        }

    }

    function addRemoveAddOnBenfits(style){
       
        var new_addOnBenefits = [];
        addOnBenefits.forEach((hairstyle) => {
            if(hairstyle.fixed){
                return;
            }
            new_addOnBenefits.push(hairstyle);
        })
        if(new_addOnBenefits.length < 1){
            new_addOnBenefits.push(style);
        }else{
            var add = true;
            for (let index = 0; index < new_addOnBenefits.length; index++) {

                if(new_addOnBenefits[index].hairstyleName == style.hairstyleName){
                    new_addOnBenefits.splice(index,1);
                    var add = false;
                    break;
                }
            }
            if(add){
                new_addOnBenefits.push(style);
            }
        }

        
        setAddOnBenefits(new_addOnBenefits);
        calculateHomeServiceCost(new_addOnBenefits,addOnServices);
     }

     function addRemoveAddOnService(service){


        var new_addOnService = [];

        addOnServices.forEach((service) => {
            if(service.fixed){
                return;
            }
            new_addOnService.push(service);
        })

        if(new_addOnService.length < 1){
            new_addOnService.push(service);
        }else{
            var add = true;
            for (let index = 0; index < new_addOnService.length; index++) {
                if(new_addOnService[index].service == service.service){
                    new_addOnService.splice(index,1);
                    var add = false;
                    break;
                }
            }
            if(add){
                new_addOnService.push(service);
            }
        }

        setAddOnServices(new_addOnService);
        calculateHomeServiceCost(addOnBenefits,new_addOnService);
       
     }

     function calculateHomeServiceCost(new_addOnBenefits,new_otherServices){
        
        var cost =  0;
        //var addonsCost = 0;
        new_addOnBenefits.forEach((benefit) => {
            cost += benefit.cost;
            //addonsCost +=benefit.cost;
        })

        // var otherServicesCost = 0;
        new_otherServices.forEach((benefit) => {
            cost += benefit.cost;
        })

        setTotalCost(cost.toFixed(2));
     }

     async function placeBooking(){
         setAddOnServices([]);
         setAddOnBenefits([]);
         if(place_booking){
             return;
         }

         setPlace_booking(true);

         //console.log(subscribedPackage);
         var cost = subscribedPackage.initialCost > 0 ? subscribedPackage.initialCost / subscribedPackage.cuts : 0;

         addOnServices.forEach((service)=>{
             if(service.fixed){
                 return;
             }else{
                cost += service.cost;
             }
             
         })
         addOnBenefits.forEach((benefit)=>{
            if(benefit.fixed){
                return;
            }else{
                cost += benefit.cost;
            }
           
        })

         var data = {
             "sub_id" : subscribedPackage.subId,
             "add_on_services": addOnServices,
             "add_on_benefits": addOnBenefits,
             "partner_id": shopDetails[0].accountId,
             "appointment_date": appointmentDate,
             "appointment_status": "pending",
             "appointment_pass": "",
             "appointment_cost": cost,
             "initial_cost": subscribedPackage.initialCost > 0 ? subscribedPackage.initialCost / subscribedPackage.cuts : 0,
             "service_type": showModal2 ? "Home service" : "Normal"
             
         };
         try {
          
            var url  = Config.apiBaseUrl+'/auth/createbooking/';
            const request = await axios.post(url,{data:data},{withCredentials:true});
            setPlace_booking(false);
            if(request.status == 200){
                history.push('/account/booking/'+request.data);
            }
         } catch (error) {
            setPlace_booking(false);
         }

     }
    
     function fetchHairStyles(){        
         setshowModal2(true);
         setAddOnBenefits([]);
         set_loading(true);
        fetch("https://api.ipify.org/?format=json")
        .then(response => {
        return response.json();
        }, "jsonp")
        .then(res => {
            getUserLocation(res.ip);

        })
        .catch(err => {
            seterror(true);
            seterrorMessage('Oops! an error occured');
        })
     }

     function getUserLocation(ip){
        fetch("https://ipapi.co/"+ip+"/json/")
        .then(response => {
          return response.json();
         }, "jsonp")
        .then(res => {
          var country = res.country;
          var city = res.city;
          fetchBaseHairStyles(city,country);
          fetchOtherServices(city,country);
        })
        .catch(err => {
                 seterror(true);
                seterrorMessage('Oops! an error occured');
        })
     }

     function fetchBaseHairStyles(city,country,){
        city = 'Birmingham';
        country = 'United Kingdom';
       fetch(Config.apiBaseUrl+'/baseHairStyles/'+userDetails.ethinicity+'/'+city+'/'+country+'/')
       .then((response)=>response.json())
       .then((json)=>{
           //console.log(json);
           setBaseHairStyles(json);
           set_loading(false);
       })
       .catch((error)=>{
               seterror(true);
               seterrorMessage('Oops! an error occured');
            })
       .finally()
    }


    function fetchOtherServices(city,country){
       city = 'Birmingham';
       country = 'United Kingdom';
      fetch(Config.apiBaseUrl+'/otherSerivices/'+userDetails.ethinicity+'/'+city+'/'+country+'/')
      .then((response)=>response.json())
      .then((json)=>{

           set_loading(false);
          setotherServices(json)})
      .catch((error)=>{
          seterror(true);
        seterrorMessage('Oops! an error occured');
    })
      .finally()
   }

   async function createPaymentIntent(){
       set_loading(true);
       var body = {
        'userData': [],
        'totalCost': totalCost
     }

        var url = Config.apiBaseUrl+'/create-payment-intent';
        var request = await axios.post(url,{body},{withCredentials: true});
        set_loading(false);
        setclientSecret(request.data.clientSecret);
        setShowPaymentModal(true);
   }

    return(
        <Box>
           <Header transparent={false} setLatLng={()=>{}}/>
           {shopDetails.length > 0 ? 
        <Container maxWidth="md"style={{paddingTop:100}}>
        <Grid container>
        <Grid item xs={12} md={12} lg={7}>
             <Grid container>
                 <Grid item xs={3}>
                  <img style={{borderRadius:0,border:"3px solid #000"}} width="100%" src={`${Config.apiEndPoint+''+shopDetails[0].storeLogo.replace('public/','')}`}/>
                 </Grid>
                 <Grid item xs={9} className={classes.shopDetails}>
                        <div><h3>{shopDetails[0].business_name}</h3>
                        <Rating rate={shopDetails[0].rating}/>
                        <Box className={classes.openStatus}>
                            {shopDetails[0].closed == 'true' ? <span>Closed Now</span> : <span style={{color:"green"}}>Opened Now</span>}
                        </Box>
                        </div>
                        <div style={{display:"flex",flexDirection:"row-reverse"}}>
                            <Button disabled={_loading} className={classes.btn} onClick={()=>{
                                bookAppointment();
                            }}>
                                {_loading ? <CircularProgress size={20} style={{color:"white"}}/> : "Book appointment"}
                            </Button>
                        </div>
                 </Grid>
                 <Grid container style={{marginTop:10}}>
                     {gallery.map((image,index)=>{
                         if(index <= 3){
                            return(
                               <Grid key={index} item xs={6} sm={3} md={3} md={3} style={{padding:1}}>
                                   <div className={classes.images} style={{backgroundImage:`url(${Config.apiEndPoint}${image.thumb.replace('public/','')})`}} onClick={()=>{
                                        set_open_gallery(true);
                                        setImageActiveIndex(index);
                                   }}>

                                   {gallery.length >  3 && index ==3 ?
                                    <div style={{paddingTop:42,paddingBottom:42}} className={classes.overlay}>
                                        <Button style={{color:"white"}}>SEE ALL <Icon>navigate_next</Icon></Button>
                                    </div>
                                    : <div style={{padding:60}}></div>} 

                                   </div>
                               </Grid>
                            )
                         }
                     })}
                 </Grid>
             </Grid>
             <Box style={{marginTop:10,backgroundColor:"#E0F3FD",padding:10,paddingLeft:30,paddingRight:30}}>
                    <div style={{width:150,margin:"auto",textAlign:"center"}}>
                    <h3 style={{marginBottom:5,fontFamily:"Muli"}}>Reviews</h3>
                    <Rating rate={shopDetails[0].rating}/>
                    </div>
                    <hr/>
                    <Box style={{width:250,height:140,margin:"auto"}}>
                        {stars.map((star,index)=>
                            <div key={index}  style={{marginBottom:5,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                <div style={{flexGrow:1}}>
                                <span style={{fontSize:13}}>{star.name}</span>
                                </div>

                                <BorderLinearProgress variant="determinate" value={Number(star.count)} />

                                <div style={{flexGrow:1}}>
                                    <center><span style={{fontSize:13}}>{star.count}</span></center>
                                </div>
                            </div>
                        )}
                    </Box>

            </Box>
            <br/>
            <center>
                    <font style={{fontSize:13}}>{reviews.length} written reviews</font>
            </center>

            {reviews.length > 0 ? <Box style={{marginTop:10}}>
                {d_reviews.map((review,index)=>
                 <div key={index} style={{marginBottom:40}}>
                     <div style={{display:"flex",alignItems:"center"}}>
                <Stars rate={review.rate}/> <span style={{fontSize:13,fontFamily:"Muli",fontWeight:"bold",marginLeft:20}}>{review.first_name} {review.last_name}</span>
                     </div>
                <p style={{fontSize:14}}>{review.message}</p>
                 <div style={{fontSize:14,display:"flex",flexDirection:"row-reverse"}}>
                     {new Date(review.date_posted).getDay()+'/'+new Date(review.date_posted).getMonth()+'/'+new Date(review.date_posted).getFullYear()}
                 </div>
                 </div>
                )}
                <div>
                    <center>{reviews.length > d_reviews.length ? <Button onClick={()=>{LoadReviews(reviews)}}>SEE MORE</Button>: null}</center>
                </div>
            </Box> : null}

        </Grid>
        <Grid item xs={12} md={12} lg={5} style={{paddingLeft:10,paddingRight:10}}>
            {/* <p>{shopDetails[0].storeLat}</p> */}
            <GoogleMap
            clickableIcons={false}
                
                 options={{
                    styles: exampleMapStyles,
                    fullscreenControl: false,
                    fullscreenControlOptions:false,
                    disableDoubleClickZoom:true,
                    draggable:false
                }}
                mapContainerStyle={{width:"100%",height:150}}
                center={{lat:Number(shopDetails[0].storelat),lng:Number(shopDetails[0].storelng)}}
                zoom={13}
        >
              <Marker
                position={{lat:Number(shopDetails[0].storelat),lng:Number(shopDetails[0].storelng)}}
                icon={{
                  url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAABmJLR0QA/wD/AP+gvaeTAAADHUlEQVRYhbXYzWtcVRjH8c9JJlVHQZFgQkFFi4roykGLjWOi2GLpwi5a1D/ARX0BS0W01J0LEUsXLkRXFbUiQcVWqGLVkBlbRALWEruqRaHQ1Fi7iCnamTkuTEvJ3Htm5mZ8ls/L73zPveee85wbrMDihGGMahhWMo/TYcp8Ub3QM8C4qugJ0UbckpHyi+ig4MNQ893/AhPHVbW8igd70J/Crm6hOsLECSUtu0SvYKAHkEsSgjf95YUw40JhmLjRFRbsx4YCEMvtC2c9Fmb9k5eQO9O41aAF7/cJBB51vY/ihFLPMOa8jC19ArlomzXsyAtmvqa4zhqDjuGqhHBD8KmWQwbMaxkWrMdm8mePRcHdYdrJ5YHsopKdYhLkOLaEaT8v878Tx9xlwCTuzKkti3biqeWBticTJ1yp6TSuzRH7VdN94bAzeaRxnRsM+gE35aScc43RcNDflzvb10zLhgQIPJ8CgXDYGcH2RMp1Fjyy3Jm1gO/JlYjm1OxPgVyyEZ/h90RG2zjtMNFIbnlwNNDqhiVMaop+TGiNdoZJW3IHzRgwPz+2j50Fk1oPt/cEwx25kWCuM0xwNCF+W3xApRuKOO5erMlPaH+F7TANdel1sSdWDCVBKoa07EmkNA2qd4RZ+myncmWCqrL34v3Zm2KsKLvaBxhLwHyb1YRl78DRXsHDCbHHlayNVbsNOqRhTsmIpvXYIbo5UUuwN9udxVIxpOwEbkyKFrHglD/cmtVKZH7aS03Q630Hgei1vJ4mf58Z9RaO9RnluEVv5wVzYcKkJsnzpYhtT7WeyR041HwtONAXjOBAqPkyldL5OLhgG86uEOWclmc7JXWECUecEjy3IpTo6VD3W8exutar2ocnC6B8HGrd9dLdn9rRM7T3rR3spNjeXq4YJtT96b9me7HLkvOirUt1/YWBUPOT0OVMg22hbqYX/Z6vq2HaPtHuDmlvhGnv9qpd5O5M3YuiT3Kinxv1UhHZnn+JXLRYUVb2DdZe5v5ew0PhiPNFNIs9GYQZi1bZhNkl16xVNhUF6YvFMatj1VdxzOqVav0Ln17Xrn0u2pEAAAAASUVORK5CYII=',
                }}
                />
        </GoogleMap>
         <Box style={{paddingTop:20}}>
            <Box style={{width:200,margin:"auto",}}>
                <center style={{fontSize:12,fontWeight:"bold"}}>{shopDetails[0].business_name}</center>
                <center style={{fontSize:11,color:"rgba(0,0,0,0.5)",paddingTop:10}}>
                    {shopDetails[0].businessLocation}
                </center>
            </Box>
            <hr style={{border:"thin solid rgba(0,0,0,0.1)"}}/>
            <center style={{fontSize:13,fontWeight:"bold",marginTop:20}}>Business Hours</center>
            <Box style={{marginTop:20}}>
            {businessHours.map((hours,index)=>
                    <Grid key={index} style={{fontWeight:new Date().getDay() == index ? "bold" : "300"}} container className={classes.businessHours}>
                    <Grid  item xs={6}>
                       <p className={classes.day}>{hours.day}: </p>
                    </Grid>
                    <Grid  item xs={6}>
                     {hours.closed == 'false' ? <p>{hours.from} - {hours.to}</p> : <p>Closed</p>}
                    </Grid>
            </Grid>)}
            </Box>
            <hr style={{border:"thin solid rgba(0,0,0,0.1)"}}/>
            <center style={{fontSize:13,fontWeight:"bold",marginTop:20}}>SHARE PROFILE</center>
            <div style={{textAlign:"center",marginTop:10}}>

                <IconButton style={{color:"black"}} onClick={()=>{shareLink('facebook')}}>
                    <Icon className="fab fa-facebook" />
                </IconButton>
                <IconButton style={{color:"black"}} onClick={()=>{shareLink('twitter')}}>
                <Icon className="fab fa-twitter" />
                </IconButton>
                <IconButton style={{color:"black"}} onClick={()=>{shareLink('instagram')}}>
                <Icon className="fab fa-whatsapp" />
                </IconButton>
            </div>
         </Box>
        </Grid>
        </Grid>
        <ReactBnbGallery
              activePhotoIndex	={imageActiveIndex}
              show={_open_gallery}
              photos={_photos}
              onClose={() => set_open_gallery(false)}
            />

    </Container> : null   
        }

        {showModal ? 
        <Box className={classes.modal}>
        <Box className={classes.modalBox}>
            <Box style={{display:"flex",border:"thin soid #000",justifyContent:"space-between",fontSize:14,padding:15,cursor:"pointer"}} onClick={()=>{
                setshowModal(false);
                fetchHairStyles();
            }}>
                <div>Request for home service</div>
                <Icon style={{fontSize:14}}>arrow_forward</Icon>
            </Box>

            <Box style={{display:"flex",border:"thin soid #000",justifyContent:"space-between",fontSize:14,padding:15,cursor:"pointer"}} onClick={()=>{
                setshowModal(false);
                setshowModal1(true);
                fetchCustomerPackage();
            }}>
                <div>Use my package</div>
                <Icon style={{fontSize:14}}>arrow_forward</Icon>
            </Box>

         </Box>
         </Box> : null}

        { showModal1 ? <Box className={classes.modal}>
            {login ? <Box className={classes.modalBox} style={{padding:20}}>
                 <p>In order to book an appointment, you need to login as a client</p>
                 <Button className={classes.btn} onClick={()=>{
                     history.push("/logout");
                 }}>LOGIN</Button>
            </Box> : 
            <Box className={classes.modalBox}>
                {_loading ? <center><CircularProgress size={20}/></center> : 
                <Box>
                

                    {subscribedPackage.length == 0 ? 
                    <Box style={{padding:10}}>
                        <Icon style={{fontSize:90,color:"#ccc"}}>error_outline</Icon>
                        <p>Oops! you have not subscribe to any of our packages</p>
                    </Box>
                    : 
                        <Box>
                    <p style={{fontSize:13,marginTop:0}} className={classes.header}>YOUR CURRENT PACKAGE</p>
                    <Box className={classes.header} style={{backgroundColor:"#fef4c5",marginTop:-15,fontSize:12}}>{subscribedPackage.selectedPackage.indexOf("Custom") > -1 ? "Custom Package": subscribedPackage.selectedPackage}</Box>
                     <Box style={{padding:10,maxHeight:400,
                            overflowY:"auto"}}>
                     <Box style={{textAlign:"left"}}>
                        {subscribedPackage.addOnBenefits ? 
                        <Box>
                            <p style={{fontSize:14}}>Package Benefits</p>
                        {subscribedPackage.addOnBenefits.map((benefit,index)=>
                         <Box key={index}>
                             <Checkbox checked={benefit.fixed} style={{padding:0}} disabled={benefit.used} onChange={(e)=>{
                                 addRemoveAddOnBenfits(benefit);
                             }} name="checkedA" />
                            <span style={{fontSize:12}}>{benefit.hairstyleName} x {benefit.num_of_cuts}</span>
                         </Box>
                        )}
                        </Box>
                        : null}
                     </Box>
                     
                     <Box style={{textAlign:"left"}}>
                        {subscribedPackage.addonOtherServices ? 
                        <Box>
                        <p style={{fontSize:14}}>Addon Services</p>
                        {subscribedPackage.addonOtherServices.map((service,index)=>
                         <Box key={index}>
                             <Checkbox checked={service.fixed} style={{padding:0}} disabled={service.used}  onChange={(e)=>{
                                 if(service.fixed){
                                     return;
                                 }
                                 addRemoveAddOnService(service);
                             }}  name="checkedA" />
                            <span style={{fontSize:12}}>{service.service} x {service.num_of_cuts}</span>
                         </Box>
                        )}
                        </Box>
                        : null}
                     </Box>
                        <br/>
                     <TextField
                             InputProps={{inputProps: { min: minDate} }}
                            id="date"
                            label="Appointment Date"
                            type="datetime-local"
                            defaultValue={appointmentDate}
                            style={{width:"100%"}}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={(e)=>{
                                //console.log(e.target.value);
                                setappointmentDate(e.target.value);
                            }}
                        />

                     </Box>
                        </Box>
                    }
                     {subscribedPackage.length == 0 ?
                     <Grid container>
                    <Grid item xs={6} style={{backgroundColor:"#ccc",padding:10,fontSize:12,cursor:"pointer"}} onClick={()=>{setshowModal1(false)}}>
                            <span>CANCEL</span>
                         </Grid>

                     <Grid item xs={6} style={{backgroundColor:"#000",color:"white",padding:10,fontSize:12,cursor:"pointer"}}  onClick={()=>{history.push('/account/buy_a_package')}}>
                        <span>SUBSCRIBE</span>
                     </Grid>
                     </Grid>
                     : <Grid container>
                         <Grid item xs={6} style={{backgroundColor:"#ccc",padding:10,fontSize:12,cursor:"pointer"}} onClick={()=>{setshowModal1(false)}}>
                            <span>CANCEL</span>
                         </Grid>
                         <Grid item xs={6} style={{backgroundColor:"#000",color:"white",padding:10,fontSize:12,cursor:"pointer"}} onClick={placeBooking}>
                             {place_booking ? "plase wait...." : <span>PLACE BOOKING</span>}
                         </Grid>
                     </Grid>}
                </Box>
                }
            </Box>
            }

            
        </Box> : null}

        {showModal2 ? 
         <Box className={classes.modal}>
                <Box className={classes.modalBox}>
                {_loading ? <center><CircularProgress size={20}/></center> : 
                <Box>
                    <p style={{fontSize:13,marginTop:0}} className={classes.header}>SELECT YOUR SERVICE</p>
                    <Box style={{textAlign:"left",padding:10}}>
                    <label className={classes.label}>Select your prefered hair style</label><br/>
                    <select className={classes.select} 
                    onChange={(e)=>{
                        if(e.target.value == ""){
                            return;
                        }
                            addRemoveAddOnBenfits(JSON.parse(e.target.value));
                            //setofferType("custom");
                        }}>
                        <option value="">--SELECT---</option>
                        {baseHairStyles.map((style,index)=>
                            <option value={JSON.stringify(style)} key={index}>{style.hairstyleName}</option>
                        )}
                        </select>

                        {addOnBenefits.map((style,index)=>
                            <Box key={index} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <p>{style.hairstyleName}</p>
                                <Box>
                                    <span>{style.base+' '+style.cost} </span>
                                    <IconButton onClick={()=>{
                                        addRemoveAddOnBenfits(style);
                                    }}><Icon style={{color:"red",fontSize:14}}>close</Icon></IconButton>
                                </Box>
                            </Box>
                        )}

                    <hr/>
                    <label className={classes.label} >Select your prefered addon Services</label><br/>
                    <select className={classes.select} 
                    onChange={(e)=>{
                        if(e.target.value == ""){
                            return;
                        }
                        addRemoveAddOnService(JSON.parse(e.target.value));
                            //setofferType("custom");
                        }}>
                        <option value="">--SELECT---</option>
                        {otherServices.map((service,index)=>
                            <option value={JSON.stringify(service)} key={index}>{service.service}</option>
                        )}
                        </select>

                        {addOnServices.map((service,index)=>
                            <Box key={index} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <p>{service.service}</p>
                                <Box>
                                    <span>{service.base+' '+service.cost} </span>
                                    <IconButton onClick={()=>{
                                        addRemoveAddOnService(service);
                                    }}><Icon style={{color:"red",fontSize:14}}>close</Icon></IconButton>
                                </Box>
                            </Box>
                        )}

                        <br/><br/>
                     <TextField
                             InputProps={{inputProps: { min: minDate} }}
                            id="date"
                            label="Appointment Date"
                            type="datetime-local"
                            defaultValue={appointmentDate}
                            style={{width:"100%"}}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={(e)=>{
                                //console.log(e.target.value);
                                setappointmentDate(e.target.value);
                            }}
                        />
                            
                        <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <p>TOTAL</p>
                            <Box>
                                <span>{"£"+' '+totalCost} </span>
                            </Box>
                        </Box>


                    </Box>
                    <Grid container>
                         <Grid item xs={6} style={{backgroundColor:"#ccc",padding:10,fontSize:12,cursor:"pointer"}} onClick={()=>{setshowModal2(false)}}>
                            <span>CANCEL</span>
                         </Grid>
                         <Grid item xs={6} style={{backgroundColor:"#000",color:"white",padding:10,fontSize:12,cursor:"pointer"}} onClick={()=>{
                             if(totalCost > 0){
                                //setShowPaymentModal(true);
                                createPaymentIntent();
                             }else{
                                seterror(true);
                                seterrorMessage('Oops! please select a hair style');
                             }
                         }}>
                             {place_booking ? "plase wait...." : <span>PROCEED</span>}
                         </Grid>
                     </Grid>
                </Box> }
               </Box>
         </Box> : null}

         {showPaymentModal ? <PackageSummaryModal modal={showPaymentModal} data={{"addOnBenefits": addOnBenefits,"addonOtherServices" : addOnServices, "packageBenefits":[],"totalCost":totalCost,'currency':"£"}}  makePayment={()=>{}} stripeapikey={Config.stripeapikey} clientSecret={clientSecret} close={()=>{setShowPaymentModal(false)}}  register = {false} handleChange={()=>{
             setShowPaymentModal(false);
             placeBooking();
         }}/> : null}


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
    )
}

export default App;