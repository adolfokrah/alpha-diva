var Config = require('./config');
var axios = require('axios')


export const  getUserDetails = async (url)=>{
   
    //fetch user details
    const response = await axios.get(Config.apiBaseUrl+'/auth/checkAuth/',{withCredentials: true});
    
    if(!response.data.user_account_id){
        return;
    }

    var userId = response.data.user_account_id;
         
    var userType = response.data.user_type;
 
    const request = await  axios.get(Config.apiBaseUrl+'/auth/getUserDetails/'+userId+'/'+userType+'/',{withCredentials: true});
 
    
     //console.log(response);
     if(request.data[0].business_name){
       var init = request.data[0].business_name[0]+''+request.data[0].business_name[1];
 
       var user = request.data[0];
       user.initials = init.toUpperCase();
       user.userName = request.data[0].business_name;
       user.type = 'partner';
       localStorage.setItem("user",JSON.stringify(user));
       
   }else{
       var init = request.data[0].first_name[0]+''+request.data[0].last_name[0];
 
       var user = request.data[0];
       user.initials = init.toUpperCase();
       user.type = 'customer';
       user.userName = request.data[0].first_name +' '+request.data[0].last_name;
       localStorage.setItem("user",JSON.stringify(user));
   }
   
    //console.log(url);
    if(url != '' && user.type == 'customer'){
        window.open(Config.host+"#/"+url,"_self");
        return;
    }
   window.open(Config.host+"#/account/settings","_self");
 };
