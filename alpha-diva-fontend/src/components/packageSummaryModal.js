import React,{useState,useEffect} from 'react';
import StripeCheckout from 'react-stripe-checkout';

import {makeStyles,Box,Container,Icon,Grid,IconButton} from '@material-ui/core'
import '../App.css'

import Config from '../includes/config'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './checkoutForm'

const promise = loadStripe(Config.stripeapikey);

const useStyles = makeStyles((theme) => ({
    modal:{
        backgroundColor:"rgba(0,0,0,0.5)",
        position:"fixed",
        width:"100%",
        height:"100vh",
        zIndex:2000,
        left:0,
        top:0,
        display: "flex", // make us of Flexbox
        alignItems: "center", // does vertically center the desired content
        justifyContent: "center"
    },
    box:{
        backgroundColor:"white",
        borderRadius:10,
        padding:20,
    },
    close:{
        backgroundColor:"white",
        padding:5,
        marginLeft:10
    },
    modalHeader:{
        fontFamily:"Muli",
        fontSize:20,
        fontWeight:800
    },
    data:{
        paddingTop:10,
        maxHeight:300,
        overflow:"auto"
    },
    dataItem:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        fontFamily:"Muli",
        marginBottom:5
    },
    check:{
        fontSize:20,
        marginRight:5,
        color:"green"
    },
    modalFooter:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
    }
}));

function App(props){
    const classes = useStyles();
    

    return(
        <Box className={classes.modal}>
            <Container maxWidth={"sm"}>
                <Grid container>
                    <Grid xs={9} className={classes.box}>
                        <h2 className={classes.modalHeader}>Package Summary</h2>
                        <hr/>
                        <div className={classes.data}>
                             {props.data.cut ? 
                             <Box>

                            <span className={classes.dataItem}><Icon className={classes.check}>plus</Icon> <strong>{props.data.selectedPackage}</strong></span>
                             <span className={classes.dataItem}><Icon className={classes.check}>check</Icon> {props.data.selectedDuration} (duration)</span>
                             <span className={classes.dataItem}><Icon className={classes.check}>check</Icon> {props.data.cuts} Hair Cuts</span>

                             </Box> : null}

                             {props.data.addOnBenefits.map((haircut,index)=>
                                 <span key={index} className={classes.dataItem}><Icon className={classes.check}>check</Icon> {haircut.hairstyleName}</span>
                             )}

                            {props.data.addonOtherServices.map((services,index)=>
                                 <span key={index} className={classes.dataItem}><Icon className={classes.check}>check</Icon> {services.service}</span>
                             )}

                            {props.data.packageBenefits.map((benefit,index)=>
                                 <span key={index} className={classes.dataItem}><Icon className={classes.check}>check</Icon> {benefit}</span>
                             )}

                        </div>
                        <hr/>
                        
                        <div> 
                      

                        <Elements stripe={promise}>
                            <CheckoutForm register={props.register} handleChange={props.handleChange} body={props.body} clientSecret={props.clientSecret} totalCost={props.data.totalCost} amount={props.data.currency+props.data.totalCost} />
                        </Elements>
                        </div>
                    </Grid>
                    <Grid xs={1}>
                            <IconButton className={classes.close} onClick={()=>{props.close()}}><Icon>close</Icon></IconButton>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}


export default App;