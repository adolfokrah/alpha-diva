import React,{useState,useEffect} from 'react';
import {Box,Snackbar,Switch,CircularProgress,TextField,makeStyles,Button,Table,TableContainer,TableHead,TableRow,TableBody,TableCell,TablePagination} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import Config from '../../includes/config';
import Input from '../../components/textInput';
import md5 from 'md5';
import {Link} from "react-router-dom";



const useStyles = makeStyles((theme) => ({
    info:{
        fontSize: 14,
        lineHeight:0.5,
    },
    link:{
     color: "red",
     textDecoration:"none"   
    },
    businessHours:{
      fontSize: 14,
      lineHeight:0.5,
    },
    setHours:{
      backgroundColor:"rgb(243,240,226,0.8)",
      textAlign:"center",
      marginTop:20,
      padding:15
    },
    setHoursBtn:{
      backgroundColor:"white",
      border:"2px solid black",
      fontWeight:"bold",
      borderRadius:0,
      fontSize:12,
      width:150,
      '&:hover':{
        backgroundColor:"rgb(236,0,0,0.1)"
      }
    },
    addPicBtn:{
      padding:45,
      border:"2px solid #000",
      borderRadius:0,
      borderStyle:"dashed"
    },
    pic:{
      padding:44,
      backgroundColor:"rgb(222,226,230,0.5)",
      border:"2px solid rgb(222,226,230,0.2)",
    },
    edit:{
        height:40,
        backgroundColor:"red",
        color:"white",
        '&:hover':{
            backgroundColor:"red"
        }
    },
    loader:{
        color:"white"
    }
}));


const businessHours = [
    {
      day:"Sunday",
      from:"07:30",
      to:"18:00",
      closed:"false"
    },
    {
      day:"Monday",
      from:"07:30",
      to:"18:00",
      closed:"false"
    },
    {
      day:"Tuesday",
      from:"07:30",
      to:"18:00",
      closed:"false"
    },
    {
      day:"Wednesday",
      from:"07:30",
      to:"18:00",
      closed:"false"
    },
    {
      day:"Thursday",
      from:"07:30",
      to:"18:00",
      closed:"false"
    },
    {
      day:"Friday",
      from:"07:30",
      to:"18:00",
      closed:"false"
    },
    {
      day:"Saturday",
      from:"07:30",
      to:"18:00",
      closed:"false"
    }
  ]


function App(){
    
    const [userDetails, setuserDetails] = useState([]);
    const classes = useStyles();
    const [_businessHours, set_businessHours] = React.useState([]);
    const [sunday, setsunday] = useState(false);
    const [monday, setmonday] = useState(false);
    const [tuesday, settuesday] = useState(false);
    const [wednesday, setwednesday] = useState(false);
    const [thursday, setthursday] = useState(false);
    const [friday, setfriday] = useState(false);
    const [Saturday, setSaturday] = useState(false);
    const [edit, setedit] = useState(true);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
  

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem("user"));
        setuserDetails(user);
        var New_businessHours = JSON.parse(localStorage.getItem("businessWorkingHours"));
        if(New_businessHours.length > 0){
            set_businessHours(New_businessHours);
            New_businessHours.forEach((hour) => {
                
                var value = hour.closed === "true" || hour.closed === true ? true :false;
                switch (hour.day) {
                    case "Sunday":
                        setsunday(value);
                        return;
                    case "Monday":
                        setmonday(value);
                        return;
                    case "Tuesday":
                        settuesday(value);
                        return;
                    case "Wednesday":
                        setwednesday(value);
                        return;
                    case "Thursday":
                        setthursday(value);
                        return;
                    case "Friday":
                        setfriday(value);
                        return;
                    default:
                        setSaturday(value);
                        return;
                }
            })
        }else{
            set_businessHours(businessHours);
        }

        window.scrollTo(0,0);
    }, []);

   
    function setValues(value,day,type){
        const n_businessHours = _businessHours;
         for (let index = 0; index < n_businessHours.length; index++) {
             if(n_businessHours[index].day == day){
                 n_businessHours[index][type] = value;
                 break;
             }
         }
         setedit(false);
         
         if(type == "closed"){
            value = value === "true" || value == true ? true : false;
            switch (day) {
                case "Sunday":
                    setsunday(value);
                    return;
                case "Monday":
                    setmonday(value);
                    return;
                case "Tuesday":
                    settuesday(value);
                    return;
                case "Wednesday":
                    setwednesday(value);
                    return;
                case "Thursday":
                    setthursday(value);
                    return;
                case "Friday":
                    setfriday(value);
                    return;
                default:
                    setSaturday(value);
                    return;
            }
         }

         setsunday(true);  
         set_businessHours(n_businessHours);
    }

    function getState(day){
        switch (day) {
            case "Sunday":
                return sunday;
            case "Monday":
                return monday;
            case "Tuesday":
                return tuesday;
            case "Wednesday":
                return wednesday;
            case "Thursday":
                return thursday;
            case "Friday":
                return friday;
            default:
                return Saturday;
                
        }

    }

    async function saveBusinessHours(){
        var data = _businessHours;
        setloading(true);
        try {
            var request = await  axios.post(Config.apiBaseUrl+'/auth/updateWorkingHours/',{data},{withCredentials: true});
            setloading(false);


            if(request.status === 200){
                seterror(true);
                seterrorMessage("Business hours updated");
                localStorage.setItem("businessWorkingHours",JSON.stringify(_businessHours));
            }else{
                seterror(true);
                seterrorMessage("Oops!, an error occured, try again later")
            }
        } catch (e) {
            setloading(false);
            seterror(true);
            seterrorMessage("Oops!, an error occured, try again later")
        }


    }
    
    


    return(
        <Box>
            <Box style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between"}}>
            <h4 style={{marginTop:30,fontWeight:100}}>Customize your business hours</h4>
            <Button disabled={loading} className={classes.edit} onClick={saveBusinessHours}>{!loading? "SAVE CHANGES" : <CircularProgress className={classes.loader} size={20} /> }</Button>
            </Box>
            <hr/>
            <TableContainer>
                <Table className={classes.table} >
                    <TableHead>
                    <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell >From</TableCell>
                        <TableCell >To</TableCell>
                        <TableCell align="right">Closed?</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {_businessHours.map((row) => {
                        return (
                            <TableRow key={row.day}>
                            
                            <TableCell>{row.day}</TableCell>
                            <TableCell >

                            <TextField
                                disabled={row.closed === "true" || row.closed === true ? true : false}
                                id="time"
                                type="time"
                                defaultValue={row.from}
                                onChange={(e)=>{
                                   setValues(e.target.value,row.day,'from');
                                }}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                            />

                            </TableCell>
                            <TableCell >

                            <TextField
                                disabled={row.closed === "true" || row.closed === true ? true : false}
                                id="time"
                                type="time"
                                defaultValue={row.to}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                                onChange={(e)=>{
                                    setValues(e.target.value,row.day,'to');
                                 }}
                            />

                            </TableCell>
                            <TableCell align="right">
                                <Switch
                                    checked={getState(row.day)}
                                    onChange={(e)=>{
                                        //console.log(row.closed);
                                        setValues(e.target.checked,row.day,'closed');
                                     }}
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </TableCell>
                            </TableRow>
                        );
                        })}
                    </TableBody>
                </Table>
                </TableContainer>


                

            <Snackbar style={{zIndex:5000}} open={error} autoHideDuration={6000} onClose={()=>{
                seterror(false);
            }}>
            <Alert variant="filled" severity={errorMessage.includes("error")  ? "error" : "success"} onClose={()=>{
                seterror(false);
            }}>
                {errorMessage}
            </Alert>
            </Snackbar>
        </Box>
    )
};

export default App;