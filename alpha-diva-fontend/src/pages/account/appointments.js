import React,{useState,useEffect} from 'react';
import {Chip,Button,Icon,makeStyles,Box,Paper} from '@material-ui/core'
import { Base64 } from 'js-base64';
import axios from 'axios';
import Config from '../../includes/config'
import {useHistory,Link} from "react-router-dom";
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
    }
  
  }));

  function App(props) {
      const history = useHistory();
      const [user, setUser] = useState([]);
      const [loading, setloading] = useState(false);
      const [error, seterror] = useState(false);
      const [errorMessage, seterrorMessage] = useState("");
      const [upcommingAppointments, setUpcommingAppointments] = useState([]);
      const [pastAppointments, setPastAppointments] = useState([]);
      const [total_upcomming_appointments, settotal_upcomming_appointments] = useState([]);
      const [total_past_appointments, setTotal_past_appointments] = useState([]);
      const [start_up, setStart_up] = useState(0);
      const [endStart_up, setEndStart_up] = useState(5);
      const [start_p, setStart_p] = useState(0);
      const [endStart_p, setEndStart_p] = useState(5);

    useEffect(()=>{
        var user = JSON.parse(localStorage.getItem("user"));
        setUser(user);
        
       fetchAppointments(user);
   },[])

   async function fetchAppointments(user){
     try {
        var url  = Config.apiBaseUrl+'/auth/fetchAppointments/';
        const request = await axios.get(url,{withCredentials:true});
        var upcommingAppointments = [];
        var pastAppointments = [];

        if(request.status == 200){
            request.data.forEach((appointment) => {
                var services = [];
                appointment.add_on_benefits = JSON.parse(appointment.add_on_benefits);
                appointment.add_on_benefits.forEach((benefit) => {
                    services.push(benefit.hairstyleName);
                })

                appointment.add_on_services = JSON.parse(appointment.add_on_services);
                appointment.add_on_services.forEach((service) => {
                    services.push(service.service);
                })
                
                if(appointment.appointment_status == 'pending'){
                    var data = {
                        'id':Base64.encode(appointment.ap_id).replace(/=/g,''),
                        'status':"CONFIRMED",
                        'title': services.toString(),
                        'with': user.type == "partner" ? appointment.first_name +' '+appointment.last_name : appointment.business_name,
                        'subTitle': user.type == 'partner' ? appointment.phone : appointment.businessLocation,
                        'month': new Date(appointment.appointment_date).toString().split(' ')[1],
                        'day': new Date(appointment.appointment_date).getDay(),
                        'year': new Date(appointment.appointment_date).getFullYear(),
                        'time':  formatAMPM(new Date(appointment.appointment_date))
                    }
                    upcommingAppointments.push(data);
                }else{
                    var data = {
                        'id':Base64.encode(appointment.ap_id).replace(/=/g,''),
                        'status':appointment.appointment_status.toUpperCase(),
                        'title': services.toString(),
                        'with': user.type == "partner" ? appointment.first_name +' '+appointment.last_name : appointment.business_name,
                        'subTitle': user.type == 'partner' ? appointment.phone : appointment.businessLocation,
                        'month': new Date(appointment.appointment_date).toString().split(' ')[1],
                        'day': new Date(appointment.appointment_date).getDay(),
                        'year': new Date(appointment.appointment_date).getFullYear(),
                        'time':  formatAMPM(new Date(appointment.appointment_date))
                    }
                    pastAppointments.push(data);
                }
            })

            settotal_upcomming_appointments(upcommingAppointments);
            setTotal_past_appointments(pastAppointments);
            loadUpcommingAppointments(upcommingAppointments);
            loadPastAppointments(pastAppointments);
        }
     } catch (error) {
         
     }

   }

   function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  function loadUpcommingAppointments(appointments){
        if(appointments.lenth < 1){
            return;
        }
        var d = upcommingAppointments;
        var mappointments = d;
        var end  =  appointments.length  > endStart_up ? endStart_up : appointments.length;
        for (let index = start_up; index < end; index++) {
            mappointments.push(appointments[index]);
        }
        var end = endStart_up+5 > appointments.length ? appointments.length : endStart_up+5;
        
        setStart_up(endStart_up);
        setEndStart_up(end);
        setUpcommingAppointments(mappointments);

        //console.log(mappointments);

    }

    function loadPastAppointments(appointments){
        if(appointments.lenth < 1){
            return;
        }
        var d = pastAppointments;
        var mappointments = d;
        var end  =  appointments.length  > endStart_p ? endStart_p : appointments.length;
        for (let index = start_p; index < end; index++) {
            mappointments.push(appointments[index]);
        }
        var end = endStart_p+5 > appointments.length ? appointments.length : endStart_p+5;
        
        setStart_p(endStart_p);
        setEndStart_p(end);
        setPastAppointments(mappointments);

        //console.log(mappointments);

    }


   const classes = useStyles();
 
    return (
        <Box>
            <h3 style={{marginTop:30,fontWeight:"bold"}}>Upcomming appointments</h3>

            {upcommingAppointments.length < 1 ?
                <Box style={{textAlign:"center"}}>
                    <Icon style={{fontSize:150,color:"#ccc"}}>date_range</Icon>
                    <p style={{color:"rgba(0,0,0,0.5)",fontSize:15}}>You have no upcomming appointment</p>
                    {user.type == "partner" ? 
                        <Box>
                            <div style={{width:"60%",minWidth:250,fontSize:13,color:"rgba(0,0,0,0.5)",margin:"auto"}}>
                                All your appointments will show up here.
                            </div>
                        </Box>
                        :
                        <Box>
                            <div style={{width:"60%",minWidth:250,fontSize:13,color:"rgba(0,0,0,0.5)",margin:"auto"}}>
                                Your scheduled appointments will show up here. Discover and book beauty &amp; wellness professionals near you
                            </div>
                             <center>
                                 <Link style={{textDecoration:"none"}} to="/search/near_me/0/0/0">
                                    <Button style={{padding:10,marginTop:10,backgroundColor:"red",color:"white",fontSize:12,width:200,fontWeight:"bold"}}>BOOK APPOINTMENTS</Button>
                                 </Link>
                             </center>
                        </Box>
                    }
                   
                   

                </Box>
                : null
            }
            {upcommingAppointments.map((appointment,index)=>
                <Link style={{textDecoration:"none",cursor:"pointer"}} to={`/account/booking/${appointment.id}`} key={index}>
                    <Paper elevation={1} style={{marginBottom:20,display:"flex",justifyContent:"space-between"}}>
                        <Box style={{padding:15,flexGrow:3}}>
                            <Chip label={appointment.status} style={{backgroundColor:"#037AFF",color:"white",height:20,fontFamily:"Muli",fontWeight:"bold",fontSize:10}}/>
                            <h3 style={{fontSize:13,fontFamily:"Muli",marginBottom:10}}>{appointment.title}</h3>
                            <p style={{fontSize:12,fontWeight:"bold",padding:0}}>{appointment.with}</p>
                            <p style={{fontSize:12,color:"rgba(0,0,0,0.6)",marginTop:-10}}>{appointment.subTitle}</p>
                        </Box>
                        <Box style={{padding:30,width:"20%",borderLeft:"thin solid #ccc",textAlign:"center"}}>
                            <p style={{fontSize:11,color:"rgba(0,0,0,0.5)"}}>{appointment.month}</p>
                            <p style={{marginTop:-10,fontSize:30,color:"rgba(0,0,0,1)"}}>{appointment.day}</p>
                            <p style={{marginTop:-30,fontSize:12,color:"rgba(0,0,0,0.5)"}}>{appointment.year}</p>
                            <p style={{marginTop:0,fontSize:12,color:"rgba(0,0,0,0.5)"}}>{appointment.time.toUpperCase()}</p>
                        </Box>

                    </Paper>
                </Link>
            )}
                <div>
                    <center>{total_upcomming_appointments.length > upcommingAppointments.length ? <Button onClick={()=>{loadUpcommingAppointments(total_upcomming_appointments)}}>SEE MORE</Button>: null}</center>
                </div>

                {pastAppointments.length> 0 ? <h3 style={{marginTop:30,fontWeight:"bold"}}>Past appointments</h3> : null}
                {pastAppointments.map((appointment,index)=>
                    <Link style={{textDecoration:"none",cursor:"pointer"}} to={`/account/booking/${appointment.id}`} key={index}>
                        <Paper elevation={1} style={{marginBottom:20,display:"flex",justifyContent:"space-between"}}>
                            <Box style={{padding:15,flexGrow:3}}>
                                <Chip label={appointment.status} style={{backgroundColor:appointment.status == "cancelled" ? "red" :"#CCC",color:"white",height:20,fontFamily:"Muli",fontWeight:"bold",fontSize:10}}/>
                                <h3 style={{fontSize:13,fontFamily:"Muli",marginBottom:10}}>{appointment.title}</h3>
                                <p style={{fontSize:12,fontWeight:"bold",padding:0}}>{appointment.with}</p>
                                <p style={{fontSize:12,color:"rgba(0,0,0,0.6)",marginTop:-10}}>{appointment.subTitle}</p>
                            </Box>
                            <Box style={{padding:30,width:"20%",borderLeft:"thin solid #ccc",textAlign:"center"}}>
                                <p style={{fontSize:11,color:"rgba(0,0,0,0.5)"}}>{appointment.month}</p>
                                <p style={{marginTop:-10,fontSize:30,color:"rgba(0,0,0,1)"}}>{appointment.day}</p>
                                <p style={{marginTop:-30,fontSize:12,color:"rgba(0,0,0,0.5)"}}>{appointment.year}</p>
                                <p style={{marginTop:0,fontSize:12,color:"rgba(0,0,0,0.5)"}}>{appointment.time.toUpperCase()}</p>
                            </Box>

                        </Paper>
                    </Link>
                )}
                <div>
                    <center>{total_past_appointments.length > pastAppointments.length ? <Button onClick={()=>{loadPastAppointments(total_past_appointments)}}>SEE MORE</Button>: null}</center>
                </div>

        </Box>
    )
  }

  export default App;