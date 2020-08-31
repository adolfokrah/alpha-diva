import React,{useState,useEffect} from 'react';
import {makeStyles,Icon} from '@material-ui/core'
import Slider from "react-slick";
import Config from '../includes/config'
// import "~slick-carousel/slick/slick.css"; 
// import "~slick-carousel/slick/slick-theme.css";


import '../App.css'





const useStyles = makeStyles((theme) => ({
  slides:{
      '& .slide':{
          padding:10,
          boxSizing:"border-box",
          ['@media (max-width:928px)']: {
            padding:5,
          }
      },
      '& .slideBox':{
          backgroundColor:"#fdf0f0",
          borderRadius:10,
          padding:20,
          boxSizing:"border-box",
          
      },
      '& .star':{
          color:"#f7b709"
      },
      '& h4':{
          marginBottom:0,
          fontFamily:"Muli",
          fontWeight:800
      },
      '& p':{
          marginTop:8,
          fontFamily:"Muli",
          color:"rgba(0,0,0,0.8)",
          fontSize:14,
          fontWeight:200,
          lineHeight:1.4
      },
      '& img':{
        width:30,
        borderRadius:100,
        marginRight:10
      },
      '& .avatar-bar':{
          display:"flex",
          alignItems:"center",
          marginTop:40,
          '& span':{
            fontFamily:"Muli",
            fontWeight:100
        }
      },
      '& button':{
        zIndex:200,
          '&:before':{
            boxShadow:"0px 0px 2px 1px rgba(0,0,0,0.2)",
            background:"white",
            color:"black !important",
            padding:20,
            borderRadius:100
          }
      },
      arrows:{
          backgroundColor:"red"
      }
      
  }
}));

function App(props) {
  const classes = useStyles();
   const [testimonials, settestimonials] = useState([]);
  useEffect(()=>{
    //fetch the available hairstyles
    fetch(Config.apiBaseUrl+'/testimonials/')
    .then((response)=>response.json())
    .then((json)=>settestimonials(json))
    .catch((error)=>console.error(error))
    .finally()

    //fetch testimonials
 },[])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows:true,
    nextArrow: <div><Icon style={{color:"black"}}>keyboard_arrow_right</Icon></div>,
    prevArrow: <div><Icon style={{color:"black"}}>keyboard_arrow_left</Icon></div>,
    responsive: [
        {
            breakpoint: 1323,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: false
            }
        },
        {
            breakpoint: 1021,
            settings: {
             arrows:false,
             slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: false
            }
        },
        {
            breakpoint: 928,
            settings: {
             arrows:false,
             slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              centerMode:true,
              centerPadding:"20px",
              infinite:false
            }
        }
    ]
 
  };
  
  return (
      
      <div className={classes.slides}>
        <Slider {...settings}>
           {testimonials.map((slide)=>
            <div className="slide">
            <div className="slideBox">
                <div>
                    <Icon className="star">star</Icon>
                    <Icon className="star">star</Icon>
                    <Icon className="star">star</Icon>
                    <Icon className="star">star</Icon>
                    <Icon className="star">star</Icon>
                </div>
           <h4>{slide.heading}</h4>
           <p>{slide.body}</p>
                <div className="avatar-bar">
                    <img alt="man" src={slide.clientImage}/>
           <span>{slide.clientName}</span>
                </div>
            </div>
        </div>
           )}

        </Slider>
      </div>
  );
  }
 

export default App;

