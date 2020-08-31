var Base64 = require('js-base64');
var express = require('express');
var router = express.Router();
var connect = require('../public/includes/connect');
const md5 = require('md5');
var config = require('../public/includes/config');
const mydate = require('date.js');
var cc = require('currency-codes');
const axios = require('axios');

const stripe = require("stripe")(config.stripeapskey);
const uuid = require("uuid/v4");
/* GET home page. */
router.get('/hairStyles', function(req, res, next) {
   //get all the hair styles
   connect.queryBuilder.select().from('hairstyles').then((results)=>{
     res.status(200).send(results)
   })
});

router.get('/testimonials',function(req,res,next){
  //get all the testimonials
  connect.queryBuilder.select().from('testimonials').then((results)=>{
    res.status(200).send(results)
  })
})

router.get('/numberOfCuts',function(req,res,next){
  //get all the testimonials
  connect.queryBuilder.select().from('noofcuts').then((results)=>{
    res.status(200).send(results)
    
  })
})

router.get('/fetchPackages',function(req,res,next){
  //get all the testimonials
  connect.queryBuilder.select().from('packages').then((results)=>{
    res.status(200).send(results)
    
  })
})

router.post('/getPaymentUrl',function(req,res,next){
      // fisrt check if business exist

      connect.queryBuilder.select('*').from('customers').where({email: req.body.userData.email}).then((results)=>{
        if(results.length > 0){
            res.status(201).send("error");
            return;
        }

        if(req.body.userData != "none"){
          req.session.userData = req.body.userData;
          //req.session.adolf = 'halleo world';
       }
      
       //insert package and return it's a transaction id 
     
       //delete userData property from the request body
       delete req.body.userData;
       var txtRef = 'alpha-diva-txt-dev-';
       connect.queryBuilder.select('subid').from('subscription').then((results)=>{
         var id = 1;
         if(results.length > 0){
           id = results[results.length-1].subid + 1;
         }
     
         //console.log(id);
     
         var pad = '0000';
         id = ""+id;
         var ans = pad.substring(0, pad.length - id.length) + id;
         txtRef +=md5(ans);
         //console.log(txtRef);
         req.body['txtRef'] = txtRef;
         req.body['customerId'] = 0;
         req.body['txtStatus'] = 'pending';
         req.body['addOnBenefits'] = JSON.stringify(req.body.addOnBenefits);
         req.body['addonOtherServices'] = JSON.stringify(req.body.addonOtherServices);
         req.body['status'] = 'new';
         req.body['selectedPackage'] = req.body['selectedPackage'] == ''? 'Standard Package' : req.body['selectedPackage'];
         //set accurate dates from duration
         var duration = req.body.selectedDuration;
         //console.log(req.body);
         if(duration.toUpperCase().trim() == "WEEKLY"){
           duration = '1 week';
         }else if(duration.toUpperCase().trim() == 'MONTHLY'){
           duration = '1 Month';
         }else if(duration.toUpperCase().trim() == 'QUARTERLY (3 MONTHS)'){
           duration = '3 Months';
         }else if(duration.toUpperCase().trim() == 'YEARLY'){
           duration = '1 Year';
         }else if(duration.toUpperCase().trim() == 'ONE TIME'){
           duration = '1 Year';
         }
         var expires = mydate(duration+' from now');
         req.body['expires'] = expires.toJSON().slice(0, 10);
         
     
         //now insert the selected package details into the database
         //console.log(req.body);
         var country = req.body.country.toUpperCase().trim() == 'UNITED KINGDOM' ?'United Kingdom of Great Britain and Northern Ireland (The)' : req.body.country;
         var currency = cc.country(country);
         delete req.body.country;
         connect.queryBuilder.insert(req.body).returning("txtRef").into('subscription').then((id)=>{
           
           //now talk to flutter wave and retrive a payement link
           var flutterWaveRequestBody = {
             "tx_ref": txtRef,
              "amount": req.body.totalCost,
              "currency": 'GHS',
              "redirect_url": config.webhook,
              "payment_options":"card",
              "meta": {
                "consumer_id": id[0],
                "consumer_mac": "92a3-912ba-1192a"
              },
              "customer": {
               "email": req.session.userData.email,
                "phonenumber": req.session.userData.phone,
                "name":req.session.userData.first_name+' '+req.session.userData.last_name
              },
             "customizations": {
                "title": "Subscription package",
                "description": "Payment of selected subscription",
                "logo": ""
                  }
             };
             //console.log(req.session.userData);
     
             
     
             axios.post('https://api.flutterwave.com/v3/payments',JSON.stringify(flutterWaveRequestBody),{
                 headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+config.seckey,
                }
                
             }).then((response)=>{
               //console.log(response.data);
               res.send(response.data);
             }).catch((error) => {
               //console.log(error);
               res.send(error);
             })
             
         })
         //console.log(query);
         
     
       })
     
      });
 
 
 
})

router.get('/specialPackages/:ethnicity/:city/:country/:mainPackage',function(req,res,next){
  //get all the testimonials
  if(req.params.ethnicity.toUpperCase() !='BLACK'){
    req.params.ethnicity = 'WHITE';
  }
  connect.queryBuilder.select().from('specialpackages').where('cities','like','%'+req.params.city+'%').andWhere('ethnicity','=',req.params.ethnicity).andWhere("country","=",req.params.country).andWhere('mainPackage','=',req.params.mainPackage.toUpperCase().trim()).then((results)=>{
    if(results.length == 0){
      connect.queryBuilder.select().from('specialpackages').where('cities','=','others').andWhere("country","=",req.params.country).andWhere('ethnicity','=',req.params.ethnicity).andWhere('mainPackage','=',req.params.mainPackage.toUpperCase().trim()).then((new_results)=>{
        res.status(200).send(new_results)
        console.log(new_results)
        return;
      });
    }else{
      res.status(200).send(results)
    }
  })

})


router.get('/otherSerivices/:ethnicity/:city/:country',function(req,res,next){
  //get all the testimonials
  if(req.params.ethnicity.toUpperCase() !='BLACK'){
    req.params.ethnicity = 'WHITE';
  }
  connect.queryBuilder.select().from('otherservices').where('cities','like','%'+req.params.city+'%').andWhere('ethnicity','=',req.params.ethnicity).andWhere("country","=",req.params.country).then((results)=>{
    if(results.length == 0){
      connect.queryBuilder.select().from('otherservices').where('cities','=','others').andWhere("country","=",req.params.country).andWhere('ethnicity','=',req.params.ethnicity).then((new_results)=>{
        res.status(200).send(new_results)
        return;
      });
    }else{
      res.status(200).send(results)
    }
  })

})

router.get('/baseHairStyles/:ethnicity/:city/:country', function(req, res, next) {
  //get all the hair styles
 
  if(req.params.ethnicity.toUpperCase() !='BLACK'){
    req.params.ethnicity = 'WHITE';
  }
  connect.queryBuilder.select().from('basehairstyles').where('cities','like','%'+req.params.city+'%').andWhere('ethnicity','=',req.params.ethnicity).andWhere("country","=",req.params.country).then((results)=>{
    if(results.length == 0){
      connect.queryBuilder.select().from('basehairstyles').where('cities','=','others').andWhere("country","=",req.params.country).andWhere('ethnicity','=',req.params.ethnicity).then((new_results)=>{
        res.status(200).send(new_results)
        console.log(new_results)
        return;
      });
    }else{
      res.status(200).send(results)
    }
  })
});


//verify package payment
router.get('/vpayment',function(req,res,next){
  var transaction_id = req.query.transaction_id;
  var tx_Ref = req.query.tx_ref;

  var userData = {
    first_name: "adolf",
    last_name: "okrah",
    email: "bne@gmail.com",
    phone: "+3452342342342342",
    age: "34",
    ethnicity: "WHITE",
    residential_address: "accra",
    hairtype: "STRAIGHT HAIR",
    password: "11111",
    security_question: "WHAT IS THE NAME OF YOUR FAVORITE BREAKFAST?",
    answer: "jaon",
    };
    req.session.userData = userData;

  //check transaction status
  axios.get('https://api.flutterwave.com/v3/transactions/'+transaction_id+'/verify',{
            headers: {
               'Content-Type': 'application/json',
               'Authorization':'Bearer '+config.seckey,
           }
           
        }).then((response)=>{
          var txt_status = 'failed';
          if(response.data.data.status == 'successful' && response.data.status == 'success'){
            txt_status = 'successful';
          }

          //select the subscription from the database
          connect.queryBuilder.select().from('subscription').where({txtRef:tx_Ref}).then((results)=>{
            console.log(results[0].txtRef);

            var userAccountId = results[0].beneficiary;
            //check if package if for the current user or for some one
            if(results[0].beneficiary == 'ME'){
              // if package is for this user, register him if userData is null
              if(req.session.userData){

                //select the last id from the customers table
                connect.queryBuilder.select('*').from('customers').then((results)=>{
                    var accountId = 1;
                    if(results.length > 0){
                      accountId = results[results.length-1].cId + 1;
                    }

                    var pad = '0000';
                    accountId = ""+accountId;
                    var ans = pad.substring(0, pad.length - accountId.length) + accountId;
                    ans = req.session.userData.first_name.substring(0, 3)+ans;
                    ans = ans.toUpperCase();
                    req.session.userData['accountID'] = ans;
                    req.session.userData['joined'] = new Date().toJSON().slice(0, 10);
                    req.session.userData['password'] = md5(req.session.userData['password']);
                    connect.queryBuilder.insert(req.session.userData).into('customers').then(()=>{
                      userAccountId = ans;
                      req.session.user_account_id=ans;
                      req.session.user_type = 'customer';
                      updateSubscription(txt_status,userAccountId,function(){
                        console.log(userAccountId);
                        res.redirect('http://localhost:3000/#/user/account')
                      });
                    })
                })
               
              }else{
                //user is resubscribing to package so get the user account id from the session
                userAccountId = req.session.user_account_id;
                updateSubscription(txt_status,accountId,function(){});
              }
             
            }else{
              updateSubscription(txt_status,accountId,function(){});
            }
            
          })

          function updateSubscription(txt_status,accountID,callback){
            connect.queryBuilder('subscription').where('txtRef','=',tx_Ref).update({
              txtStatus: txt_status,
              customerId: accountID
            }).then(()=>{
              callback();
            })
          }
         
         
        }).catch((error) => {
          console.log(error);
          res.send(error);
        })
})


//stripe checkout
router.post("/stripe/checkout", async (req, res) => {

 
  let error;
  let status;
  try {
    const product = req.body;

    //console.log(product);

    var userData = product.otherData.userData;
   
    status = "success";


    if(product.otherData.beneficiary == 'ME'){
      // if package is for this user, register him if userData is null
      if(product.otherData.userData){


            

            //select the last id from the customers table
            const results = await connect.queryBuilder.select('*').from('customers');


            var accountId = 1;
            if(results.length > 0){
              accountId = results[results.length-1].cId + 1;
            }

            var pad = '0000';
            accountId = ""+accountId;
            var ans = pad.substring(0, pad.length - accountId.length) + accountId;
            ans = userData.first_name.substring(0, 3)+ans;
            ans = ans.toUpperCase();

            userData['accountID'] = ans;
            userData['joined'] = new Date().toJSON().slice(0, 10);
            userData['password'] = md5(userData['password']);

            //console.log(userData);

            const insertUser = await connect.queryBuilder.insert(userData).into('customers');
            userAccountId = ans;
            user_type = 'customer';
            product.otherData['customerId'] = userAccountId;
            req.session.user_account_id=userAccountId;
            req.session.user_type = 'customer';

       
      }else{
        //user is resubscribing to package so get the user account id from the session
        userAccountId = req.session.user_account_id;
        product.otherData['customerId'] = userAccountId;
      }
     
    }else{
      product.otherData['customerId'] = product.beneficiary;
      //user is subscribing for someone
    }

    delete product.otherData.userData;

    
    //insert user subscription


    const txt = await connect.queryBuilder.select('subid').from('subscription');
      var id = 1;
      if(txt.length > 0){
        id = txt[txt.length-1].subid + 1;
      }
  
      //console.log(id);
  
      var pad = '0000';
      id = ""+id;
      var ans = pad.substring(0, pad.length - id.length) + id;
     

  
    product.otherData['txtRef'] = Base64.encode(ans).replace(/=/g,'');
   
    product.otherData['txtStatus'] = 'completed';
    product.otherData['addOnBenefits'] = JSON.stringify(product.otherData.addOnBenefits);
    product.otherData['addonOtherServices'] = JSON.stringify(product.otherData.addonOtherServices);
    product.otherData['status'] = 'new';
    product.otherData['selectedPackage'] = product.otherData['selectedPackage'] == ''? 'Standard Package' : product.otherData['selectedPackage'];
    //set accurate dates from duration
    var duration = product.otherData.selectedDuration;
    //console.log(product.otherData);
    if(duration.toUpperCase().trim() == "WEEKLY"){
      duration = '1 week';
    }else if(duration.toUpperCase().trim() == 'MONTHLY'){
      duration = '1 Month';
    }else if(duration.toUpperCase().trim() == 'QUARTERLY (3 MONTHS)'){
      duration = '3 Months';
    }else if(duration.toUpperCase().trim() == 'YEARLY'){
      duration = '1 Year';
    }else if(duration.toUpperCase().trim() == 'ONE TIME'){
      duration = '1 Year';
    }
    var expires = mydate(duration+' from now');
    product.otherData['expires'] = expires.toJSON().slice(0, 10);

   

   delete product.otherData.country;
   connect.queryBuilder.insert(product.otherData).into('subscription').then(()=>{
     console.log('registration done',req.session);
   })
   
    //insert user
   
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});


//create stripe paymentintent
router.post("/create-payment-intent", async (req, res) => {
  const items  = req.body;
  
  
  if(items.body.userData.email){
    //if user is registring, then check if user already exist
    const selectCustomers = await connect.queryBuilder.select('*').from('customers').where({email: items.body.userData.email});

    if(selectCustomers.length > 0){
      res.status(201).send("error");
      return;
    }

    
     //check if customer already exist
     const query2 = await connect.queryBuilder.select('*').from('partners').where({email: items.body.userData.email});
     if(query2.length > 0){
        res.status(201).send("error");
        return;
     }
  }



  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: items.body.totalCost * 100,
    currency: "GBP"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


//search shops base on location (coordinates)
router.get('/fetchShops/:lat/:lng/:start/:type',async(req,res)=>{
  var type = req.params.type;
  var lat = Number(req.params.lat);
  var lng = Number(req.params.lng);
  var start = req.params.start;
  var radius = 10;
  var angle_radius = radius / (111 * Math.cos(lat));
  var min_lat  = lat - angle_radius;
  var max_lat = lat + angle_radius;
  var min_lng = lng - angle_radius;
  var max_lng = lng + angle_radius;

  var query;
  
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var currenctDay = days[new Date().getDay()];
    var d = new Date();
    var time = d.toTimeString().split(' ')[0];

  if(type == 'ALL'){
    query = await connect.queryBuilder.select('*').count('reviews.message',{as: 'reviews'}).from('partners').innerJoin('businesshours','partners.accountId','businesshours.accountId').leftJoin('reviews','partners.accountId','reviews.accountId').where('businesshours.day','=',currenctDay).andWhere('partners.verified','=','YES').andWhereBetween('partners.storelat',[min_lat,max_lat]).andWhereBetween('partners.storelng',[min_lng,max_lng]).limit(10).offset(start);
   
  }else if(type == 'AT BUSINESS'){
    query = await connect.queryBuilder.select('*').count('reviews.message',{as: 'reviews'}).from('partners').innerJoin('businesshours','partners.accountId','businesshours.accountId').leftJoin('reviews','partners.accountId','reviews.accountId').where('businesshours.day','=',currenctDay).andWhere('businesshours.closed','<>','true').andWhere('partners.verified','=','YES').whereBetween('partners.storelat',[min_lat,max_lat]).andWhereBetween('partners.storelng',[min_lng,max_lng]).limit(10).offset(start);
  }else{
    query = await connect.queryBuilder.select('*').count('reviews.message',{as: 'reviews'}).from('partners').innerJoin('businesshours','partners.accountId','businesshours.accountId').leftJoin('reviews','partners.accountId','reviews.accountId').where('businesshours.day','=',currenctDay).andWhere('partners.home_service','=','YES').andWhere('partners.verified','=','YES').whereBetween('partners.storelat',[min_lat,max_lat]).andWhereBetween('partners.storelng',[min_lng,max_lng]).limit(10).offset(start);
  }


  res.status(200).send(query);


  //const query = connect.queryBuilder.select('*').from()
})


//fetch Shop Details
router.get('/shopDetails/:id/:start',async(req,res)=>{

  var id = req.params.id;
  var start = req.params.start;

  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var currenctDay = days[new Date().getDay()];

  const selectStore = await connect.queryBuilder.select('*').from('partners').innerJoin('businesshours','partners.accountId','businesshours.accountId').where('partners.accountId','=',id).andWhere('businesshours.day','=',currenctDay);
  const gallery = await connect.queryBuilder.select('*').from('gallery').where('accountId','=',id);
  const query = await connect.queryBuilder.select('*').from('reviews').leftJoin('customers','reviews.client_id','customers.accountID').where('reviews.accountId','=',id);
  const businesshours = await connect.queryBuilder.select('*').from("businesshours").where('accountId','=',id);
  var ndata = {
    'storeInfo':selectStore,
    'gallery':gallery,
    'reviews':query,
    'businessHours': businesshours
  };
  res.status(200).send(ndata);

});
module.exports = router;