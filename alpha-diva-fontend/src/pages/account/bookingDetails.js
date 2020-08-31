import React,{useState,useEffect} from 'react';
import {Chip,Grid,Icon,makeStyles,Box,IconButton,Snackbar,Avatar,InputBase,Button} from '@material-ui/core'
import { Base64 } from 'js-base64';
import axios from 'axios';
import Config from '../../includes/config'
import {useHistory} from "react-router-dom";
import Dialog from '../../components/dailgos';
import { Alert } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
    boxHeader:{
        backgroundColor:"#101928",
        padding:20
    },
    bookingHeaderText:{
        fontFamily:"Muli",
        fontSize:20,
        fontWeight:100,
        color:"white",
        margin:0,
        marginBottom:10

    },
    chip:{
        backgroundColor:"#037AFF",
        fontFamily:"Muli",
        fontWeight:"bold",
        fontSize:12,
        height:25
    },
    bookingContent:{
        backgroundColor:"#F2F2F7",
        padding:20
    },
    button:{
        backgroundColor:"#404753",borderRadius:10,
        '&:hover':{
            backgroundColor:"black"
        }
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

  function App(props) {
      const history = useHistory();
      const [user, setUser] = useState([]);
      const [bookingId, setBookingId] = useState(Base64.decode(props.booking_id));
      const [bookingDetails, setBookingDetails] = useState([]);
      const [appointmentDateTime, setappointmentDateTime] = useState("");
      const [_delete, setDelete] = useState(false);
      const [loading, setloading] = useState(false);
      const [error, seterror] = useState(false);
      const [errorMessage, seterrorMessage] = useState("");
      const [payout, setPayout] = useState(0);
      const [bookingCode, setBookingCode] = useState("");
      const [predefinedReviews, setPredefinedReviews] = useState([]);
      const [selectedReview, setselectedReview] = useState();

    useEffect(()=>{
        var user = JSON.parse(localStorage.getItem("user"));
        setUser(user);
        
        setTimeout(()=>{fetchBookingDetails();},200)
   },[])

   async function fetchBookingDetails(){
        try {
            var url  = Config.apiBaseUrl+'/auth/fetchBooking/'+bookingId;
            const request = await axios.get(url,{withCredentials: true});

            if(request.status == 200){
                if(request.data.length < 1){
                    //history.push('/404')
                    return;
                }

                var bookingDetails = request.data[0];
                bookingDetails.add_on_services = JSON.parse(bookingDetails.add_on_services);
                bookingDetails.add_on_benefits = JSON.parse(bookingDetails.add_on_benefits);
                var date = new Date(bookingDetails.appointment_date).toDateString();
                var time = bookingDetails.appointment_date;
                time = time.substring(time.indexOf("T")+1,time.indexOf(':00.'));
                time = tConvert(time);
                setappointmentDateTime(date+' at '+time);
                setBookingDetails(bookingDetails);
                setBookingId(bookingDetails.ap_id);
                var payout = 80/100 * Number(bookingDetails.appointment_cost);
                setPayout(payout.toFixed(2));

                if(bookingDetails.appointment_status == 'past'){
                    fetchReviewMessages(bookingDetails.ap_id);
                }
            }else{
                //history.push('/404')
            }
        
        } catch (error) {
            //history.push('/404')
        }
   }

   async function fetchReviewMessages(id){
       var url = Config.apiBaseUrl+'/auth/fetchPredefinedReviews/'+id;
       const request = await axios.get(url,{withCredentials:true});
       setPredefinedReviews(request.data);

   }

   function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  
  async function cancelBooking(){
      setDelete(false);
    try {
        var url  = Config.apiBaseUrl+'/auth/cancelBooking/';
        const request = await axios.post(url,{id:bookingId},{withCredentials:true});

        if(request.status == 200){
            fetchBookingDetails();
        }else{
            seterror(true);
            seterrorMessage("Oops! couldn't cancel booking");
        }
    } catch (error) {
        seterror(true);
        seterrorMessage("Oops! couldn't cancel booking");
    }
  }

  async function requestpayout(){

    if(bookingCode.trim().length < 1){
        seterror(true);
        seterrorMessage("Oops! Please enter the appointment code");
        return;
    }
    setloading(true);
  try {
      var url  = Config.apiBaseUrl+'/auth/requestPayout/';
      const request = await axios.post(url,{bookingCode:bookingCode,id:bookingId},{withCredentials:true});
      setloading(false);
      if(request.status == 200){
          fetchBookingDetails();
      }else{
        seterror(true);
          seterrorMessage("Oops! incorrect appointment code");
      }
  } catch (error) {
      setloading(false);
      seterror(true);
      seterrorMessage("Oops! failed");
  }
}


async function submitReview(){
    if(selectedReview){
        try {
            setloading(true);
            var url  = Config.apiBaseUrl+'/auth/submitReview/';
            var data = {
                'accountId': bookingDetails.partner_id,
                'message': selectedReview.message,
                'rate': selectedReview.stars,
                'ap_id':bookingDetails.ap_id
            };
            console.log(data);

            const request = await axios.post(url,{data},{withCredentials:true});
            setloading(false);
            seterror(true);
            seterrorMessage("Review sent");
            fetchBookingDetails();
        } catch (error) {
            seterror(true);
            seterrorMessage("Oops! failed");
            setloading(false);
        }

    }
}




   const classes = useStyles();
  
   if(user.type == 'partner'){
       return (
        <Box>
        <Box className={classes.boxHeader}>
            <h3  className={classes.bookingHeaderText}>{appointmentDateTime}</h3>
<Chip icon={<Icon style={{fontSize:18,color:"white"}}> {bookingDetails.appointment_status == 'cancelled' ? "error_outline": "check_circle_outline"}</Icon>} label={bookingDetails.appointment_status == 'pending' ? 'Confirmed': bookingDetails.appointment_status} className={classes.chip} style={{color:"white",backgroundColor:bookingDetails.appointment_status == 'cancelled' ? "red" : "#037AFF"}} />
            <Grid container style={{marginTop:20,color:"white"}}>
                <Grid item xs={1} md={1}>
                 {/* {bookingDetails.length == 0 ? null : <img style={{borderRadius:0,border:"3px solid #000",borderRadius:5}} width="100%" src={`${Config.apiEndPoint+''+bookingDetails.storeLogo.replace('public/','')}`}/>} */}
                 {bookingDetails.length == 0 ? null : <Avatar style={{letterSpacing:-2}}>{bookingDetails.first_name[0].toUpperCase()} {bookingDetails.last_name[0].toUpperCase()}</Avatar>}
                </Grid>
                <Grid item xs={8} md={8} style={{paddingLeft:10,fontFamily:"Muli"}}>
       <strong>{bookingDetails.first_name} {bookingDetails.last_name}</strong>
                    <div style={{display:"flex",alignItems:"center",fontFamily:"Muli",color:"rgba(255,255,255,0.5)",fontSize:12}}>
                        
                        <p style={{margin:0}}>{bookingDetails.phone}</p>
                    </div>
                    <p style={{margin:0,fontFamily:"Muli",color:"rgba(255,255,255,0.5)",fontSize:12}}>Service Type: <strong style={{color:"rgba(255,255,255,1)"}}>{bookingDetails.service_type}</strong></p>

                    {/* <p style={{margin:0,fontFamily:"Muli",color:"rgba(255,255,255,0.5)",fontSize:12}}>Phone: <strong style={{color:"rgba(255,255,255,1)"}}>{bookingDetails.phone}</strong></p> */}
                </Grid>
                <Grid item xs={3} md={3} style={{display:"flex",alignItems:"center",justifyContent:"space-arround"}}>
                    <Box style={{textAlign:"center",padding:10}}>
                        <IconButton className={classes.button}><Icon style={{color:"white",fontSize:12}}onClick={()=>{
                            window.open(`tel:${bookingDetails.phone}`,'_blank');
                        }}>phone</Icon></IconButton>
                        <span style={{fontSize:12}}>CALL</span>
                    </Box>

                    {bookingDetails.appointment_status == "pending"  ? <Box style={{textAlign:"center",padding:10}} onClick={()=>{setDelete(true)}}>
                        <IconButton className={classes.button}><Icon style={{color:"white",fontSize:12}}>close</Icon></IconButton>
                        <span style={{fontSize:12}}>Cancel</span>
                    </Box> : null}

                </Grid>
            </Grid>
        </Box>
        <Box className={classes.bookingContent}>
            {bookingDetails.length == 0 ? null:
               <Box>
                    <Box>
                    {bookingDetails.add_on_benefits.map((benefit,index)=>
                        <Box>
                            <Box key={index} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <span style={{fontFamily:"Muli",fontSize:14}}>{benefit.hairstyleName}</span>
                    {/* <span>{benefit.base} {Number(benefit.cost).toFixed(2)}</span> */}
                        </Box>
                        <Box style={{height:1,backgroundColor:"rgba(0,0,0,0.1)",marginTop:15,marginBottom:15}}/>
                        </Box>
                    )}
                </Box>

                <Box>
                    {bookingDetails.add_on_services.map((service,index)=>
                        <Box>
                            <Box key={index} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <span style={{fontFamily:"Muli",fontSize:14}}>{service.service}</span>
                    {/* <span>{service.base} {Number(service.cost).toFixed(2)}</span> */}
                        </Box>
                           <Box style={{height:1,backgroundColor:"rgba(0,0,0,0.1)",marginTop:15,marginBottom:15}}/>
                        </Box>
                    )}
                </Box>
                
               
                {/* <Box style={{height:1,backgroundColor:"rgba(0,0,0,0.1)",marginTop:15,marginBottom:15}}/> */}
                <Box style={{display:"flex",alignItems:"center",fontWeight:"bold",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"Muli",fontSize:14}}>YOUR PAYOUT</span>
                    <span>£ {payout}</span>
                </Box>

               </Box>
            }
        </Box>

        {bookingDetails.appointment_status == 'cancelled' || bookingDetails.appointment_status == 'past' ? null :
        <Box className={classes.bookingContent} style={{marginTop:20,display:"flex"}}>
            <InputBase style={{backgroundColor:"white",padding:5,fontSize:13,paddingLeft:10,flexGrow:1}} placeholder={"Enter Booking Code"}onChange={(e)=>{
                setBookingCode(e.target.value);
            }} />
            <Button disabled={loading} style={{backgroundColor:"#101928",color:"white",borderRadius:0,maringLeft:10,fontWeight:"bold"}} onClick={requestpayout}>{loading ? "Please wait..." : "Request payout"}</Button>
        </Box>}

        <Dialog open={_delete} message={'Are you sure you wan to cancel this booking?'} title={"Cancel Booking"} noText={"No"} okayText={"Yes, Delete"} handleClose={()=>{setDelete(false)}} handleOkay={()=>{
            cancelBooking();
        }}/>

     <Snackbar style={{zIndex:5000}} open={error} autoHideDuration={6000} onClose={()=>{
            seterror(false);
        }}>
        <Alert variant="filled" severity={errorMessage.includes("Oops")  ? "error" : "success"} onClose={()=>{
            seterror(false);
        }}>
            {errorMessage}
        </Alert>
        </Snackbar>
        
    </Box>
       )
   }
    return (
        <Box>
            <Box className={classes.boxHeader}>
                <h3  className={classes.bookingHeaderText}>{appointmentDateTime}</h3>
    <Chip icon={<Icon style={{fontSize:18,color:"white"}}> {bookingDetails.appointment_status == 'cancelled' ? "error_outline": "check_circle_outline"}</Icon>} label={bookingDetails.appointment_status == 'pending' ? 'Confirmed': bookingDetails.appointment_status} className={classes.chip} style={{color:"white",backgroundColor:bookingDetails.appointment_status == 'cancelled' ? "red" : "#037AFF"}} />
                <Grid container style={{marginTop:20,color:"white"}}>
                    <Grid item xs={2} md={1}>
                     {bookingDetails.length == 0 ? null : <img style={{borderRadius:0,border:"3px solid #000",borderRadius:5}} width="100%" src={`${Config.apiEndPoint+''+bookingDetails.storeLogo.replace('public/','')}`}/>}
                    </Grid>
                    <Grid item xs={10} md={8} style={{paddingLeft:10,fontFamily:"Muli"}}>
                        <strong>{bookingDetails.business_name}</strong>
                        <div style={{display:"flex",alignItems:"center",fontFamily:"Muli",color:"rgba(255,255,255,0.5)",fontSize:12}}>
                            
                            <p style={{margin:0}}>{bookingDetails.businessLocation}</p>
                            <Icon style={{fontSize:12}}>near_me</Icon>
                        </div>
                        <p style={{margin:0,fontFamily:"Muli",color:"rgba(255,255,255,0.5)",fontSize:12}}>Booking Code: <strong style={{color:"rgba(255,255,255,1)"}}>{bookingDetails.appointment_pass}</strong></p>

                        <p style={{margin:0,fontFamily:"Muli",color:"rgba(255,255,255,0.5)",fontSize:12}}>Service Type: <strong style={{color:"rgba(255,255,255,1)"}}>{bookingDetails.service_type}</strong></p>

                    </Grid>
                    <Grid item xs={12} md={3} style={{display:"flex",alignItems:"center",justifyContent:"space-arround"}}>
                        <Box style={{textAlign:"center",padding:10}}>
                            <IconButton className={classes.button}><Icon style={{color:"white",fontSize:12}}onClick={()=>{
                                window.open(`https://maps.google.com/?q=${bookingDetails.storelat},${bookingDetails.storelng}`,'_blank');
                            }}>location_on</Icon></IconButton>
                            <span style={{fontSize:12}}>Directions</span>
                        </Box>

                        {bookingDetails.appointment_status == "pending" ? <Box style={{textAlign:"center",padding:10}} onClick={()=>{setDelete(true)}}>
                            <IconButton className={classes.button}><Icon style={{color:"white",fontSize:12}}>close</Icon></IconButton>
                            <span style={{fontSize:12}}>Cancel</span>
                        </Box> : null}

                    </Grid>
                </Grid>
            </Box>
            <Box className={classes.bookingContent}>
                {bookingDetails.length == 0 ? null:
                   <Box>
                        <Box>
                        {bookingDetails.add_on_benefits.map((benefit,index)=>
                            <Box>
                                <Box key={index} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                <span style={{fontFamily:"Muli",fontSize:14}}>{benefit.hairstyleName}</span>
                        {/* <span>{benefit.base} {Number(benefit.cost).toFixed(2)}</span> */}
                            </Box>
                            <Box style={{height:1,backgroundColor:"rgba(0,0,0,0.1)",marginTop:15,marginBottom:15}}/>
                            </Box>
                        )}
                    </Box>

                    <Box>
                        {bookingDetails.add_on_services.map((service,index)=>
                            <Box>
                                <Box key={index} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                <span style={{fontFamily:"Muli",fontSize:14}}>{service.service}</span>
                        {/* <span>{service.base} {Number(service.cost).toFixed(2)}</span> */}
                            </Box>
                               <Box style={{height:1,backgroundColor:"rgba(0,0,0,0.1)",marginTop:15,marginBottom:15}}/>
                            </Box>
                        )}
                    </Box>

                    {/* <Box style={{display:"flex",alignItems:"center",fontWeight:"bold",justifyContent:"space-between"}}>
                        <span style={{fontFamily:"Muli",fontSize:14}}>INITAL PACAGE COST</span>
                        <span>£ {Number(bookingDetails.initial_cost).toFixed(2)}</span>
                    </Box>
                    <Box style={{height:1,backgroundColor:"rgba(0,0,0,0.1)",marginTop:15,marginBottom:15}}/>
                    
                    <Box style={{display:"flex",alignItems:"center",fontWeight:"bold",justifyContent:"space-between"}}>
                        <span style={{fontFamily:"Muli",fontSize:14}}>TOTAL</span>
                        <span>£ {Number(bookingDetails.appointment_cost).toFixed(2)}</span>
                    </Box> */}

                   </Box>
                }
            </Box>

            {bookingDetails.appointment_status == 'past' && predefinedReviews.length > 0 ? 
            <Box className={classes.bookingContent} style={{marginTop:10}}>
            <span style={{fontFamily:"Muli",fontSize:14}}>How will you describe your service with <strong>{bookingDetails.business_name}</strong></span>
            <hr/>
            <select className={classes.select} 
            onChange={(e)=>{
                
                if(e.target.value == ""){
                    return;
                }
               setselectedReview(JSON.parse(e.target.value));
                
            }}>
                <option value="">--SELECT---</option>
                {predefinedReviews.map((review,index)=>
                    <option value={JSON.stringify(review)} key={index}>{review.message}</option>
                )}
                </select>
                <br/>
                <Button disabled={loading} style={{marginTop:10,backgroundColor:"#101928",color:"white",borderRadius:0,maringLeft:10,fontWeight:"bold"}} onClick={submitReview}>{loading ? "Please wait..." : "submit review"}</Button>
            </Box> : null}

            <Dialog open={_delete} message={'Are you sure you wan to cancel this booking?'} title={"Cancel Booking"} noText={"No"} okayText={"Yes, Delete"} handleClose={()=>{setDelete(false)}} handleOkay={()=>{
                cancelBooking();
            }}/>

         <Snackbar style={{zIndex:5000}} open={error} autoHideDuration={6000} onClose={()=>{
                seterror(false);
            }}>
            <Alert variant="filled" severity={errorMessage.includes("Oops")  ? "error" : "success"} onClose={()=>{
                seterror(false);
            }}>
                {errorMessage}
            </Alert>
            </Snackbar>
            
        </Box>
    )
  }

  export default App;