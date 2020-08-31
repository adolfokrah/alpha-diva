import React,{useState,useEffect,useCallback} from 'react';
import {DialogActions,makeStyles,Dialog,DialogContent,DialogTitle,DialogContentText,Button} from '@material-ui/core'


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
      height:125,
      width:125,
      border:"2px solid #000",
      borderRadius:0,
      borderStyle:"dashed"
    },
    pic:{
      height:125,
      width:125,
      borderRadius:0,
      backgroundColor:"rgb(222,226,230,0.5)",
      backgroundSize:"cover",
      backgroundRepeat:"no-repeat",
      boxShadow:"none",
      color:"white",
      padding:0
    },
    overlay:{
      height:125,
      width:125,
      lineHeight:8,
      backgroundColor:"rgba(0,0,0,0.3)"
    },
    edit:{
        backgroundColor:"red",
        color:"white"
    },
    image:{
        backgroundSize:"cover",
        backgroundRepeat:"no-repeat",
        cursor:"pointer",
        margin:'2px'
    },
    overlay:{
        opacity:0,
        backgroundColor:"rgba(0,0,0,0)",
        transition:"0.6s",
        display:'grid',
        placeItems:"center",
        '&:hover':{
            opacity:1,
            backgroundColor:"rgba(0,0,0,0.5)",
        }
    },
    btn:{
        color:"white",
        
    }
}));




function DialogBox(props){
    const classes = useStyles();
  
    

    return(
        
        <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.message}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={props.handleClose} color="primary">
                {props.noText}
            </Button>
            <Button onClick={props.handleOkay} color="primary" autoFocus>
               {props.okayText}
            </Button>
            </DialogActions>
        </Dialog>
    )
};

export default DialogBox;