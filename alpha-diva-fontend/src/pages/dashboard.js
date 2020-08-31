import React,{useEffect} from 'react';
import {Container,Grid,makeStyles,Hidden} from '@material-ui/core'
import {useParams} from "react-router-dom";
import Header from '../components/header'
import Footer from '../components/footer'
import CheckAuth from '../includes/checkAuth'
import RightSideBar from '../components/rightSideBar'
import MyStore from './account/myStore';
//account pages
import Account from './account/settings'
import EditStore from './account/storeEdit';
import SetBusinessHours from './account/setBusinessHours'
import Gallery from './account/gallery'
import BookingDetails from './account/bookingDetails'
import MyAppointments from './account/appointments'

const useStyles = makeStyles((theme) => ({
  content:{
      boxSizing:"border-box",
      padding:50,
      ['@media (max-width:516px)']: { // eslint-disable-line no-useless-computed-key
        padding:10
      }
  },

}));

function App() {

  useEffect(()=>{
    CheckAuth.checkAuth('account');
    //fetch testimonials
 },[])

 var params = useParams();
 const classes = useStyles();

  return (
    <div>
      <Header transparent={false} setLatLng={()=>{}}/>
      
        <Container maxWidth="md" style={{paddingTop:60}}>
          <Grid container>
             <Hidden smDown>
               <Grid item md={4}>
                 <RightSideBar/>
               </Grid>
             </Hidden>
             <Grid item xs={12} sm={12} md={8} lg={8} className={classes.content}>
               {params.type == "settings" ? <Account/> : null}

               {params.type == "go_to_store" ? <MyStore/> : null}

               {params.type == "store_edit" ? <EditStore/> : null}

               {params.type == "set_business_hours" ? <SetBusinessHours/> : null}

               {params.type == "booking" ? <BookingDetails booking_id={params.id}/> : null}

               {params.type == "gallery" ? <Gallery/> : null}

               {params.type == "my_appointments" ? <MyAppointments/> : null}

             </Grid>
          </Grid>
        </Container>
      <Footer/>
    </div>
  );
  }
 

export default App;

