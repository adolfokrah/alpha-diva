import React,{useState,useEffect} from 'react'
import {makeStyles,IconButton,Icon} from '@material-ui/core'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {getLatLng,geocodeByPlaceId} from'react-google-places-autocomplete'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
     signupBox:{
         marginTop:80,
         paddingBottom:50,
         '& h3':{
             fontFamily:"Muli",
             fontSize:30,
             fontWeight:800
         }
     },
     formBox:{
         padding:10,
         marginTop:10
     },
     suggestionContainer:{
        zIndex:200,
         backgroundColor:"white",
         color:"black",
         position:"absolute",
         borderRadius:2,
         width:230,
         padding:10,
         boxShadow:"0px 0px 5px 1px rgba(0,0,0,0.2)"
     },
     suggestion:{
         padding:10,
         color:"black",
         fontFamily:"Google Sans",
         fontSize:14,
         paddingTop:4,
         paddingBotton:4,
         cursor:"pointer",
         textOverflow:"ellipsis",
         whiteSpace:"nowrap",
         overflow:"hidden",
         '&:hover':{
             backgroundColor:"rgb(236,0,0,0.3)"
         }
     },
     location:{
         fontSize:14,
         opacity:0.5,
         backgroundColor:"red",
         width:20,
         height:20,
         backgroundColor:"rgba(0,0,0,0.3)",
         marginRight:10
     }
}));


var style = {width:"100%",outline:"none",borderRadius:0,border:"2px solid black",padding:25,boxSizing:"border-box"};

function App(props){
    const classes = useStyles();
    const [address, setaddress] = useState("");

    


    function getLatLngAddress(suggestion,event){
        //console.log(suggestion)
        setaddress(suggestion.description);
        geocodeByPlaceId(suggestion.place_id)
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) =>
            //console.log(suggestion.description, { lat, lng })
            props.suggestion(suggestion.description,lat,lng)
        );
    }

    return(
        <div>
           {props.searchPage ? null :  <div style={{ fontFamily:"Google Sans",
                        marginBottom:10,
                        fontSize:13}}>Enter your location</div>}
                        <GooglePlacesAutocomplete
                        initialValue={address.trim().length < 1 ? props.initialaddress : address}
                        required
                        //onSelect={console.log}
                        placeholder={props.placeholder ? props.placeholder : "Enter your business location"}
                        inputStyle={props.style ? props.style : style}

                        renderSuggestions={(active, suggestions) => (
                            
                            <div className={suggestions.length > 0 ? classes.suggestionContainer : null}>
                              {
                                suggestions.map((suggestion,index) => (
                                  <div
                                    key={index}
                                    className={classes.suggestion}
                                    onClick={(event) => {getLatLngAddress(suggestion, event);}}
                                  >
                                    <IconButton className={classes.location}><Icon style={{fontSize:14}}>location_on</Icon></IconButton> {suggestion.description}
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        />
        </div>
    )
}

export default App;