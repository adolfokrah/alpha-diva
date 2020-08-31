import React,{useState,useEffect} from 'react';
import {Box} from '@material-ui/core'
import CustomerAccountSettings from './customerAccountSettings'
import PartnerAccountSettings from './partnerAccountSettings';

function App(){

    const [userDetails, setuserDetails] = useState([]);

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem("user"));
        setuserDetails(user);
        console.log(user);
        if(user == null){
            window.location.reload(false);
        }
    }, []);
    
    return(
        <Box>
            {userDetails.type ? 
            <Box>
                {userDetails.type === "customer" ? <CustomerAccountSettings user={userDetails}/> : null}
                {userDetails.type === "partner" ? <PartnerAccountSettings user={userDetails}/> : null}
            </Box> : null}
        </Box>
    )
};

export default App;