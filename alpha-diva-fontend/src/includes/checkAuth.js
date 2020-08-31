const axios = require('axios')
const Config = require('./config')


module.exports.checkAuth = function(page){
   
    axios.get(Config.apiBaseUrl+'/auth/checkAuth/',{withCredentials: true}).then((response)=>{
        if(response.status == 200){
          
           if(page === 'home'){
             window.open(Config.host+"#/account/settings","_self");
           }
        }else{
            if(page === 'account'){
                window.open(Config.host+"#/sign_in","_self");
            }
        }
        //callback(false);
     }).catch((error) => {
        if(page === 'account'){
            window.open(Config.host+"#/sign_in","_self");
        }
     })
}

