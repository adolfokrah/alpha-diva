import React,{useState,useEffect} from 'react';
import '../App.css'
import Config from '../includes/config'
import axios from 'axios'

function App() {

  useEffect(() => {


    axios.get(Config.apiBaseUrl+'/auth/logout/',{withCredentials: true}).then((response)=>{
       
        //callback(false);
        localStorage.clear();
        window.open(Config.host+'#/sign_in/','_self');
     }).catch((error) => {
       
     })

     
  }, []);
 
  return (
    <div>
     
    </div>
  );
  }
 

export default App;

