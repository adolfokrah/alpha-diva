var express = require('express');
var router = express.Router();
var connect = require('../public/includes/connect');
const md5 = require('md5');
var multer  = require('multer')
const resizeImg = require('resize-img');
const fs = require('fs');
var sizeOf = require('image-size');
const mydate = require('date.js');
var Base64 = require('js-base64');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, req.session.path)
    },
    filename: function (req, file, cb) {
      var ext = file.originalname.split('.');
      var fileName = md5(req.session.account_id+"_"+ext[1]);
      ext = ext[ext.length-1];
      fileName = fileName + '-' + Date.now() +'.'+ext;
      cb(null, "IMG-"+fileName);

      //resize the image to thumbnail

    }
})
   
var upload = multer({ storage: storage }).array('file');


router.post('/register_partner', function(req, res, next) {
    req.body.password = md5(req.body.password);
    req.body.storeLogo = "";
    req.body.verified = 'NO';
    req.body.rating = 1;
    req.body.joined = new Date().toJSON().slice(0, 10);
    
    // fisrt check if business exist

    connect.queryBuilder.select('*').from('partners').where({email: req.body.email}).then(async(results)=>{
        if(results.length > 0){
            res.status(201).send("error");
            return;
        }

        const query = await connect.queryBuilder.select('*').from('customers').where({email: req.body.email});
        if(query.length > 0){
                res.status(201).send("error");
                return;
        }


        connect.queryBuilder.select('*').from('partners').then((results)=>{
            var accountId = 1;
            if(results.length > 0){
              accountId = results[results.length-1].cId + 1;
            }
    
            var pad = '0000';
            accountId = ""+accountId;
            var ans = pad.substring(0, pad.length - accountId.length) + accountId;
            ans = req.body.business_name.substring(0, 3)+ans;
            ans = 'P-'+ans.toUpperCase();
            req.body.accountId = ans;
            //res.send('hello');
            connect.queryBuilder.insert(req.body).into('partners').then(()=>{
                req.session.user_account_id=ans;
                req.session.user_type = 'partner';
                res.send(req.session);
                //res.redirect('http://localhost:3000/#/user/account')
            })
        });


    })
   
    
 });


router.get('/checkAuth',function(req,res,next){
    // req.session.user_account_id = 'ADO0001';
    // req.session.user_type = 'customer';
    // console.log(req.session);
    if(req.session.user_account_id && req.session.user_type){
        res.send(req.session);
    }else{
        res.status(201).send("error");
    }
})

router.get('/getUserDetails/:account_id/:user_type',function(req,res,next){
    
    if(req.params.user_type == 'partner'){
        connect.queryBuilder.select().from('partners').where({accountId: req.params.account_id}).then((results)=>{
            res.send(results);
        })
    }else{
        connect.queryBuilder.select().from('customers').where({accountId: req.params.account_id}).then((results)=>{
            res.send(results);
        })
    }
   
})

router.post('/login',function(req,res,next){
    
    connect.queryBuilder.select().from('partners').where({accountId: req.body.user,password: md5(req.body.password)}).orWhere({email: req.body.user,password: md5(req.body.password)}).then((results)=>{
       if(results.length < 1){
            
        connect.queryBuilder.select().from('customers').where({accountId: req.body.user,password: md5(req.body.password)}).orWhere({email: req.body.user,password: md5(req.body.password)}).then((results)=>{

           
            if(results.length < 1){
                res.status(201).send('error');
            }else{
                req.session.user_type = 'customer';
                req.session.user_account_id = results[0].accountID;
                
                res.send(req.session);
            }
        })

       }else{
        req.session.user_type = 'partner';
        req.session.user_account_id = results[0].accountId;
        res.send(req.session);
       }
    })
   
})

router.post('/updateCustomerAccount',async(req,res,next)=>{
    var userDetails = req.body.data;
    delete userDetails.initials;
    delete userDetails.type;
    delete userDetails.userName;
    
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    //check if user new email already exist
    const squery = await connect.queryBuilder.select('email').from("customers").where({email: userDetails.email}).andWhere('cId','!=',userDetails.cId);
   
    if(squery.length > 0){
        res.status(201).send('error');
        return;
    }

    
    const query = await connect.queryBuilder.update(userDetails).from("customers").where({accountId: req.session.user_account_id});


    res.status(200).send("done");
})

router.post('/updatePartnerAccount',async(req,res,next)=>{
    var userDetails = req.body.data;
    delete userDetails.initials;
    delete userDetails.type;
    delete userDetails.userName;
    
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    //check if user new email already exist
    const squery = await connect.queryBuilder.select('email').from("partners").where({email: userDetails.email}).andWhere('cId','!=',userDetails.cId);
   
    if(squery.length > 0){
        res.status(201).send('error');
        return;
    }

    console.log(req.session.user_account_id);
    const query = await connect.queryBuilder.update(userDetails).from("partners").where({accountId: req.session.user_account_id});

    res.status(200).send("done");
})

router.post('/updateWorkingHours',async(req,res,next)=>{

    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }
    var businessHours = req.body.data;
  
    businessHours.forEach((businessHour) => {
        businessHour['closed'] = businessHour['closed'] === true || businessHour['closed'] ==="true"  ? "true" :"false";
        businessHour['accountId'] = req.session.user_account_id;
    })
   

    
    const squery = await connect.queryBuilder.select('*').from("businessHours").where({accountId: req.session.user_account_id});
    if(squery.length > 0){

        for(item of businessHours){
            const query =  await connect.queryBuilder.update(item).from("businessHours").where({day:item.day});
        }

        res.status(200).send("done");
        return;
    }

    const query = await connect.queryBuilder.insert(businessHours).into('businessHours');
    res.status(200).send('ok');
})



router.get('/fetchCustomerBusinessHours/:accountId',async(req,res)=>{
    var accountID = req.params.accountId;
    
    const results = await connect.queryBuilder.select('*').from("businessHours").where({accountId: accountID});
    
    res.status(200).send(results);
})


router.put('/uploadImageToGallery',async(req,res)=>{
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    req.session.path = 'public/images/uploads/gallery/Lg/';

    var accountId = req.session.user_account_id;
    upload(req, res, function (err) {
        
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json(err)
        } else if (err) {
            console.log(err);
            return res.status(500).json(err)
        }
        

        var files = req.files;
        
        
        (async () => {
            var images = [];
            files.forEach((file) => {
                var path = 'public/images/uploads/gallery/Lg/'+file.filename;
                var to ='public/images/uploads/gallery/Sm/'+file.filename;
                
                var dimensions = sizeOf(path);
                //console.log(dimensions.width, dimensions.height);
                var height = dimensions.height;
                var width = dimensions.width;
                if(height > 150 && width > 150){
                    width = dimensions.width / 2 ;
                    height = dimensions.height / 2;
                }
            

                resizeImage(path,to,width,height);
                

                var data = {thumb:to,large:path,accountId:accountId,width:width,height:height};
                images.push(data);
            })
           // console.log(images);
            const query = await connect.queryBuilder.insert(images).into('gallery');
            return res.status(200).send(images);
        })();
    })

})

async function resizeImage(source,to,width,height){

    if(fs.existsSync(source)){
        //console.log(source);
    }
    const image = await resizeImg(fs.readFileSync(source), {
        width: width,
        height: height
    });
 
    fs.writeFileSync(to, image);

   
}

router.put('/uploadStoreLogo',async(req,res)=>{
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    req.session.path = 'public/images/uploads/storeLogos/';
    
    upload(req, res, async (err)=>{
        
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json(err)
        } else if (err) {
            console.log(err);
            return res.status(500).json(err)
        }

        var files = req.files;
        var source = req.session.path+""+files[0].filename;
        var oldImage = req.body.previousStoreLogo;
        if(fs.existsSync(oldImage)){
            console.log(oldImage);
            fs.unlink(oldImage,function(error){
                if(error){
                    console.log(error);
                }
            });
        }

        resizeImage(source,source,150,150);
        const query = await connect.queryBuilder.update({storeLogo: source}).from("partners").where({accountId: req.session.user_account_id});
        res.status(200).send(source);
    })
})

router.get('/fetchGallery/:accountId',async(req,res)=>{
    var accountID = req.params.accountId;
    
    const results = await connect.queryBuilder.select('*').from("gallery").where({accountId: accountID}).orderBy('gId','desc');
    
    res.status(200).send(results);
})

router.post('/deleteImageFromGallery',async(req,res)=>{

    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    try {
        var imageId = req.body.imageId;

        console.log(imageId);
        const results = await connect.queryBuilder.del().from("gallery").where({gId: imageId});
        
        res.status(200).send("okay");
    } catch (error) {
        
    }
})

router.get('/fetchUserSubscription',async(req,res)=>{

    
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

   const request = await connect.queryBuilder.select('*').from('subscription').where('customerId','=',req.session.user_account_id).andWhere('status','=','new').orderBy('subId','asc').limit(1);

   var query = request;
   //if package is expired, seach for anther package
   var today = new Date();
   
   if(query.length < 1){
    res.status(200).send('none');
    return;
   }

   



   
   var sub_id = query[0].subId;

   const newQuery = await connect.queryBuilder.select('*').from('appointments').where('sub_id','=',sub_id).andWhere('appointment_status','<>','cancelled');

    var results = newQuery;

    var addonBenefits = JSON.parse(query[0].addOnBenefits);
    var addonServices = JSON.parse(query[0].addonOtherServices);

   

    var ap_addOnServes = [];
    var ap_addOnBenefits =  [];

    results.forEach((appointment) => {
        ap_service = JSON.parse(appointment.add_on_services);
        ap_service.forEach((service) => {
            ap_addOnServes.push(service);
        })

        ap_benefits = JSON.parse(appointment.add_on_benefits);
        ap_benefits.forEach((benefit) => {
            ap_addOnBenefits.push(benefit);
        })
    })


    if(query[0].selectedPackage.indexOf("Custom") > -1){
        //check if the custom package has expired or all it's hair cuts have been used
        addonBenefits.forEach((benefit) => {
            for(appointment_benefit of ap_addOnBenefits){
                if(benefit.hairstyleName == appointment_benefit.hairstyleName){
                    console.log(benefit.hairstyleName);
                    benefit.num_of_cuts -= 1;
                    //break;
                }
            }
        })

        addonServices.forEach((service) => {
            for(appointment_service of ap_addOnServes){
                if(service.service == appointment_service.service){
                    service.num_of_cuts -= 1;
                    //break;
                }
            }
        })

        for(benefit of addonBenefits){
            if(benefit.num_of_cuts > 0){
                query[0].cuts = 1;
                break;
            }
        }

        for(service of addonServices){
            if(service.num_of_cuts > 0){
                query[0].cuts = 1;
                break;
            }
        }
    }else{
        addonServices.forEach((service) => {
            service['used'] = false;
            
           for(ap_service of ap_addOnServes){
               if(ap_service.service == service.service){
                   query[0].cuts -=1;
                   if(service.fixed){
                     break;
                   }else{
                        if(service.num_of_cuts > 0 && query[0].selectedPackage.indexOf("Custom") < 0){
                            service.num_of_cuts -= 1;
                        }
                   }
                   if(service.num_of_cuts < 1){
                     service['used'] = true
                   }
                   //break;
               }
           }  
        })
    }


    if(query[0].expires <= today || query[0].cuts < 1){
        //update the package to past it has expired
      const nrequest = await connect.queryBuilder('subscription').where('subId','=',query[0].subId).update({
         status: 'past'
       });
 
       //now select the next packge if any
       const request2 = await connect.queryBuilder.select('*').from('subscription').where('customerId','=',req.session.user_account_id).andWhere('status','=','new').orderBy('subId','asc').limit(1);
       query = request2;
       if(query.length < 1){
         res.status(200).send('expired');
         return;
       }
 
         var duration = query[0].selectedDuration;
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
 
       const nrequest2 = await connect.queryBuilder('subscription').where('subId','=',query[0].subId).update({
         expires: expires.toJSON().slice(0, 10)
       });
    }


    addonBenefits.forEach((benefit) => {
        benefit['used'] = false;
        for(ap_benefit of ap_addOnBenefits){
            if(ap_benefit.hairstyleName == benefit.hairstyleName){
                //console.log(ap_benefits);
                if(benefit.fixed){
                    break;
                }else{
                    if(benefit.num_of_cuts > 0 && query[0].selectedPackage.indexOf("Custome") < 0){
                        benefit.num_of_cuts -= 1;
                    }
                }
                if(benefit.num_of_cuts < 1){
                    benefit['used'] = true
                }
                //break;
            }
        }  
     })
    
    query[0].addonOtherServices = addonServices;
    query[0].addOnBenefits = addonBenefits;

   res.status(200).send(query[0]);

})

router.post('/createbooking',async(req,res)=>{

    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    var data = req.body.data;
    data.add_on_services = JSON.stringify(data.add_on_services);
    data.add_on_benefits = JSON.stringify(data.add_on_benefits);
    data.customer_id = req.session.user_account_id;
    //console.log(data);
    const request = await connect.queryBuilder.insert(data).into('appointments').returning('ap_id');
    var date = new Date().toJSON().slice(0,10);
    date = date.replace(/-/g,'');
    var appointment_pass = request+''+new Date().getSeconds()+''+date+''+new Date().getHours()+''+new Date().getMinutes();
    const nrequest = await connect.queryBuilder('appointments').where('ap_id','=',request).update({
        appointment_pass: appointment_pass
      });

    res.status(200).send(Base64.encode(request).replace(/=/g,''));
    
})

router.get('/fetchBooking/:id',async(req,res)=>{
    var id = req.params.id;
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    var query;

    if(req.session.user_type == 'partner'){
        query = await connect.queryBuilder.select('*').from('appointments').leftJoin('customers','customers.accountID','appointments.customer_id').where('appointments.ap_id','=',id).andWhere('partner_id','=',req.session.user_account_id);
        if(query.length > 0){
            query[0].appointment_pass = "";
        }
    }else{
        query = await connect.queryBuilder.select('*').from('appointments').leftJoin('partners','partners.accountId','appointments.partner_id').where('appointments.ap_id','=',id).andWhere('customer_id','=',req.session.user_account_id);
    }


    res.status(200).send(query);
});


router.post('/cancelBooking',async(req,res)=>{
    var id = req.body.id;
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    var date = new Date();
    var query;
    var pickap = await connect.queryBuilder.select('*').from('appointments').where('ap_id','=',id);
    var update = false;

    if(req.session.user_type == 'customer'){
         query = await connect.queryBuilder('appointments').where('ap_id','=',id).andWhere('appointment_date','>',date).update({
            appointment_status: 'cancelled'
          });

          if(query > 0){
              update = true;
          }
    }else{
         query = await connect.queryBuilder('appointments').where('ap_id','=',id).update({
            appointment_status: 'cancelled'
          });
          if(query > 0){
            update = true;
        }
    }

    if(update){
        query = await connect.queryBuilder('subscription').where('subId','=',pickap[0].sub_id).update({
            status: 'new'
          });
    }

    // const query = await connect.queryBuilder.delete().from('appointments').where('ap_id','=',id).andWhere('appointment_date','>',date);
    if(query > 0){
        res.status(200).send('Okay');
        return;
    }else{
        res.status(201).send('failed');
    }
})

router.post('/requestPayout',async(req,res)=>{
    var bookingCode = req.body.bookingCode;
    var id = req.body.id;
    // console.log(bookingCode);
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }
    const query = await connect.queryBuilder.select('*').from('appointments').leftJoin('partners','partners.accountId','appointments.partner_id').where('appointments.appointment_pass','=',bookingCode).andWhere("appointments.ap_id",id);
    
    if(query.length < 1){
        res.status(201).send('failed');
        return;
    }

    var ap_addOnServes = [];

    ap_service = JSON.parse(query[0].add_on_services);
    ap_service.forEach((service) => {
        ap_addOnServes.push(service.service);
    })

    ap_benefits = JSON.parse(query[0].add_on_benefits);
    ap_benefits.forEach((benefit) => {
        ap_addOnServes.push(benefit.hairstyleName);
    })

    var appointment_cost = Number(query[0].appointment_cost);
    //calculate partner payout
    var partner_payout = 80/100 * appointment_cost;
    //calculate alpha-diva commison
    var alpha_diva_commision = 10/100 * appointment_cost;
    //calculate pool fund
    var pool_fund = 10/100 * appointment_cost;

    //insert partner transactions
    var data = {
        'description': `(${ap_addOnServes.toString()})` +' Payout for Job Done',
        'amount': partner_payout.toFixed(2),
        'date': new Date(),
        'status': 'complete',
        'partner_id': query[0].accountId
    };
    const query_insert = await connect.queryBuilder.insert(data).into('transactions');

    //now insert alpha-diva commission
    var newdata = {
        'description': `(${ap_addOnServes.toString()})` +' Commission for Job Done',
        'amount': alpha_diva_commision.toFixed(2),
        'date': new Date(),
        'status': 'complete',
        'partner_id': query[0].accountId
    };

    const query_insert2 = await connect.queryBuilder.insert(newdata).into('alpha_diva_commission');

     //now insert alpha-diva commission
     var newdata2 = {
        'description': `(${ap_addOnServes.toString()})` +' Commission for Job Done',
        'amount': pool_fund.toFixed(2),
        'date': new Date(),
        'status': 'complete',
        'partner_id': query[0].accountId
    };

    const query_insert3 = await connect.queryBuilder.insert(newdata2).into('pool_fun');

    //select the subscription of this appointment
    if(query[0].service_type == '' || query[0].service_type == 'Normal'){
        const query_select = await connect.queryBuilder.select('*').from("subscription").where('subId','=',query[0].sub_id);


        if(query_select[0].selectedPackage.indexOf("Custom") < 0){
            query_select[0].cuts -= 1;
        }


        //now update the subscription
        const update  = await connect.queryBuilder('subscription').where('subId','=',query_select[0].subId).update(query_select[0]);

    }

    //now update the appointment to past
    const insert = await connect.queryBuilder('appointments').where('ap_id','=',query[0].ap_id).update({
        appointment_status: 'past'
    });

    res.status(200).send('Okay');

})

router.get('/fetchTransactions',async(req,res)=>{
   
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    const query = await connect.queryBuilder.select('*').from('transactions').where("partner_id",req.session.user_account_id).orderBy('t_id','desc');
    
    res.status(200).send(query);
})


router.get('/fetchAppointments',async(req,res)=>{
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    var query;
    if(req.session.user_type == 'customer'){
        query = await connect.queryBuilder.select('*').from('appointments').leftJoin('partners','partners.accountId','appointments.partner_id').where("appointments.customer_id",req.session.user_account_id).orderBy('ap_id','desc');
    }else{
        query = await connect.queryBuilder.select('*').from('appointments').leftJoin('customers','customers.accountID','appointments.customer_id').where("appointments.partner_id",req.session.user_account_id).orderBy('ap_id','desc');
    }

    res.status(200).send(query);
})

router.get('/fetchPredefinedReviews/:ap_id',async(req,res)=>{

 const select = await connect.queryBuilder.select('*').from('reviews').where('ap_id','=',req.params.ap_id);
 if(select.length < 1){
    const query = await connect.queryBuilder.raw('select DISTINCT message,stars from predefined_reviews order by rand() LIMIT 5');

    res.status(200).send(query[0]);
 }else{
     res.status(200).send([]);
 }
 
})

router.post('/submitReview',async(req,res)=>{
    if(!req.session.user_type){
        res.status(401).send('error');
        return;
    }

    var data = req.body.data;
    data['date_posted'] = new Date().toJSON().slice(0,10);
    data['client_id'] = req.session.user_account_id;
    
    const query = await connect.queryBuilder.insert(data).into('reviews');

    res.status(200).send("Done");
})

router.get('/logout',function(req,res,next){
    req.session.destroy(function(err){
        //req.session = null;
        console.log('sesion is',req.session)
        res.send('done');
    });
   
})


 module.exports = router;