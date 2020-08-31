import React,{useState,useEffect} from 'react';
import {makeStyles,Box,FormControlLabel,Checkbox,Radio,Button,Snackbar,Typography,ExpansionPanel,ExpansionPanelSummary,Grid,ExpansionPanelDetails,Icon,CircularProgress,InputBase,IconButton} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import Config from '../includes/config'
import '../App.css'
import Input from './textInput'
import axios from 'axios';
import config from '../includes/config';
import PackageSummaryModal from './packageSummaryModal'


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
   signupBox:{
       marginTop:80,
       paddingBottom:50,
       '& h3':{
           fontFamily:"Muli",
           fontSize:30,
           fontWeight:800
       }
   },
   formBox:{
       padding:10,
       marginTop:10
   },
   total:{
       display:"flex",
       justifyContent:"space-between",
       alignItems:"center"
   },
   loader:{
       color:'white',
       //backgroundColor:"white"
   },
    label:{
        fontFamily:"Google Sans",
        marginBottom:25,
        fontSize:13
    },
    select:{
        border:"2px solid #000",
        marginLeft:0,
        marginTop:5,
        padding:15,
        width:"100%",
        backgroundColor:"white",
        fontFamily:"Google Sans",
        '&:focus':{
            boder:"none",
            outline:"none"
        }
    }
}));

const form_fields = [
    {
        type:"drop",
        placeholder:"Duration",
        label:"Duration",
        show:"false",
        name:"duration",
        md:"12",
        error:false,
        data:['One Time','Weekly','Monthly','Quarterly (3 Months)','6 Months','1 Year'],
        errorText:"",
        value:""
    }
]

function App(props){
    const classes = useStyles();
    const [durationsOptions, setdurationsOptions] = useState(form_fields[0].data);
    const [baseHairStyles, setbaseHairStyles] = useState([]);
    const [otherServices, setotherServices] = useState([]);
    const [userCountry, setuserCountry] = useState('England');
    const [city, setcity] = useState("");
    const [specialPackages, setspecialPackages] = useState([]);
    const [specialPacakgesOptions, setspecialPacakgesOptions] = useState([]);
    const [selectedPackage, setselectedPackage] = useState("");
    const [packageCost, setpackageCost] = useState(0);
    const [noOfCuts, setnoOfCuts] = useState(0);
    const [offerType, setofferType] = useState("special");
    const [addOnBenefits, setaddOnBenefits] = useState([]);
    const [addonOtherServices, setaddonOtherServices] = useState([]);
    const [numOfCuts, setnumOfCuts] = useState([]);
    const [numOfCutsOptions, setnumOfCutsOptions] = useState([]);
    const [customNoOfCuts, setcustomNoOfCuts] = useState(1);
    const [discount, setdiscount] = useState(0);
    const [packages, setpackages] = useState([]);
    const [seletedDuration, setseletedDuration] = useState("One Time");
    const [totalCost, settotalCost] = useState(0);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(true);
    const [packageBenefits, setpackageBenefits] = useState([]);
    const [customDruation, setcustomDruation] = useState("One Time");
    const [forwho, setforwho] = useState("ME");
    const [beneficiary, setbeneficiary] = useState("");
    const [show, setshow] = useState(false);
    const [isaddon, setisaddon] = useState(false);
    const [fixedPackgeCost, setfixedPackgeCost] = useState(0);
    const [selectedFixedPackage, setselectedFixedPackage] = useState({});
    const [customLabel, setcustomLabel] = useState("Customize your package");
    const [errorMessage, seterrorMessage] = useState("Please select some hair styles");
    const [modal, setmodal] = useState(false);
    const [clientSecret, setclientSecret] = useState("");
    const [data, setdata] = useState([]);


    useEffect(() => {
        var subscription = ['Standard','Premium','Family','Custom','Dreads'];
        var index = subscription.indexOf(props.package);
        //console.log(index);
        if(index < 0){
            window.open("http://localhost:3000/#/sign_up/package/select","_self");
        }else{
            fetch("https://api.ipify.org/?format=json")
            .then(response => {
            return response.json();
            }, "jsonp")
            .then(res => {
            getUserLocation(res.ip);
            fetchNumOfCuts();
            fetchPackages();
            })
            .catch(err => {
                seterror(true);
                seterrorMessage('Oops! an error occured');
            })
        }

        var show = props.package.toUpperCase().trim() === "CUSTOM" || props.package.toUpperCase().trim() == "FAMILY" ? true : false;

        if(props.package.toUpperCase().trim() === 'CUSTOM'){
            var duration = ['One Time','Weekly','Monthly','Quarterly (3 Months)'];
            setdurationsOptions(duration);
        }

        setshow(show);
     }, []);

     function getUserLocation(ip){
        fetch("https://ipapi.co/"+ip+"/json/")
        .then(response => {
          return response.json();
         }, "jsonp")
        .then(res => {
          var country = res.country;
          var city = res.city;
          fetchSpecialPackages(city,country);
          setuserCountry(country);
          setcity(city);
        })
        .catch(err => {
                 seterror(true);
                seterrorMessage('Oops! an error occured');
        })
     }
    
     function fetchBaseHairStyles(city,country,fixedPacakgeHairStyles){
         setbaseHairStyles([]);
         city = 'Birmingham';
         country = 'United Kingdom';
        fetch(Config.apiBaseUrl+'/baseHairStyles/'+props.ethinicity+'/'+city+'/'+country+'/')
        .then((response)=>response.json())
        .then((json)=>{
            //console.log(json);

            fixedPacakgeHairStyles = JSON.parse(fixedPacakgeHairStyles);
          
            if(fixedPacakgeHairStyles.length > 0){
                setbaseHairStyles([])
                setaddOnBenefits([]);
                //calculateCutom(0,0)
                for (let index = 0; index < fixedPacakgeHairStyles.length; index++) {
                    for (let index2 = 0; index2 < json.length; index2++) {
                        if(fixedPacakgeHairStyles[index].hairstyleName.trim().toUpperCase() === json[index2].hairstyleName.trim().toUpperCase()){
                                json.splice(index2,1);
                        }
                    }
                }
            }

            setbaseHairStyles(json);
            setloading(false);
        })
        .catch((error)=>{
                seterror(true);
                seterrorMessage('Oops! an error occured');})
        .finally()
     }

     function fetchOtherServices(city,country,fixedPackgeOtherSerivices){
         //console.log('helo world');
        setotherServices([]);
        setaddonOtherServices([])
        city = 'Birmingham';
        country = 'United Kingdom';
       fetch(Config.apiBaseUrl+'/otherSerivices/'+props.ethinicity+'/'+city+'/'+country+'/')
       .then((response)=>response.json())
       .then((json)=>{

        fixedPackgeOtherSerivices = JSON.parse(fixedPackgeOtherSerivices);
          
            if(fixedPackgeOtherSerivices.length > 0){
                setaddonOtherServices([])
                //calculateCutom(0,0)
                for (let index = 0; index < fixedPackgeOtherSerivices.length; index++) {
                    for (let index2 = 0; index2 < json.length; index2++) {
                        if(fixedPackgeOtherSerivices[index].service.trim().toUpperCase() === json[index2].service.trim().toUpperCase()){
                                //console.log(json[index2].service);
                                json.splice(index2,1);
                        }
                    }
                }
            }
           // console.log('hello')

            setloading(false);
           setotherServices(json)})
       .catch((error)=>{seterror(true);
                seterrorMessage('Oops! an error occured');})
       .finally()
    }

    
     function fetchSpecialPackages(city,country){
        city = 'Birmingham';
        country = 'United Kingdom';

        
        axios.get(Config.apiBaseUrl+'/specialpackages/'+props.ethinicity+'/'+city+'/'+country+'/'+props.package+'/').then((json)=>{
            //console.log("hellsfkdjflksdjf")
            var json = json.data;
            setspecialPackages(json)
            var options = [];
            json.forEach((value) => {
                options.push(value.packageName);
            })
           if(json.length > 0){
            setspecialPacakgesOptions(options);
            setPackage(json[0]);
            setselectedFixedPackage(json[0]);
            setselectedPackage(json[0].packageName)

           
           }
           
           fetchOtherServices(city,country,'[]');
           fetchBaseHairStyles(city,country,'[]');
           if(props.package === 'Custom'){
            calculateCutom(customNoOfCuts,seletedDuration);
           }


         }).catch((error) => {
            // setloading(false);
            seterror(true);
            seterrorMessage('Oops! an error occured');
           //console.log("hellsfkdjflksdjf")
         })

     }

     function fetchNumOfCuts(){
        fetch(Config.apiBaseUrl+'/numberOfCuts/')
        .then((response)=>response.json())
        .then((json)=>{
            //console.log(json);
            //json = json;
            setnumOfCuts(json);
            //console.log(JSON.parse(json[0].cuts));
            setnumOfCutsOptions(JSON.parse(json[0].cuts));
         })
        .catch((error)=>{seterror(true);
                seterrorMessage('Oops! an error occured');})
        .finally()
     }

     function fetchPackages(){
        axios.get(Config.apiBaseUrl+'/fetchPackages/').then((response)=>{
            setpackages(response.data);
            //console.log(response)
            //window.open(response.data.data.link,'_self');
         }).catch((error) => {
            // setloading(false);
            seterror(true);
            seterrorMessage('Oops! an error occured');
         })
     }

     function setPackage(fixedPackage){
         //console.log(fixedPackage.packageName)
         setselectedFixedPackage(fixedPackage);
         setselectedPackage(fixedPackage.packageName);
         setpackageCost(fixedPackage.cost);
         settotalCost(fixedPackage.cost);
         setnoOfCuts(fixedPackage.noOfCuts);
         setdiscount(0);
         setfixedPackgeCost(fixedPackage);
         setseletedDuration(fixedPackage.duration);
         setdurationsOptions([fixedPackage.duration])
         setnumOfCutsOptions([fixedPackage.noOfCuts]);
         setfixedPackgeCost(fixedPackage.cost);
         var addon = fixedPackage.isaddon == 1 ? true : false;
         setisaddon(addon);
         if(props.package.toUpperCase().trim() !='FAMILY'){
            setshow(addon);
            setcustomLabel("Add extra services to this package (optional)");
         }else{
             setcustomLabel('Family Custom');
         }

         

         var fixedPackageHairstyles = JSON.parse(fixedPackage.hairStyles);
         var fixedPackageOtherServices = JSON.parse(fixedPackage.otherServices);
          
         if(props.package.toUpperCase().trim() != 'FAMILY'){
            setloading(true);
            fetchOtherServices(city,userCountry,fixedPackage.otherServices);
            fetchBaseHairStyles(city,userCountry,fixedPackage.hairStyles);
         }


         if(fixedPackage.benefits.length > 0){
             var packageB = fixedPackage.benefits.split(',');
             if(fixedPackageHairstyles.length  > 0){
                 fixedPackageHairstyles.forEach((hairStyle) => {
                     packageB.push(hairStyle.hairstyleName);
                 })
             }
             if(fixedPackageOtherServices.length  > 0){
                fixedPackageOtherServices.forEach((service) => {
                    packageB.push(service.service);
                })
            }
            setpackageBenefits(packageB);
         }else{
            setpackageBenefits([]);
         }
         
     }


     function addRemoveAddOn(style){
        var new_addOnBenefits = addOnBenefits;
        style.num_of_cuts = 1;

        if(new_addOnBenefits.length < 1){
            new_addOnBenefits.push(style);
        }else{
            var add = true;
            for (let index = 0; index < new_addOnBenefits.length; index++) {
                if(new_addOnBenefits[index].hairstyleName == style.hairstyleName){
                    new_addOnBenefits.splice(index,1);
                    var add = false;
                    break;
                }
            }
            if(add){
                new_addOnBenefits.push(style);
            }
        }
        setaddOnBenefits(new_addOnBenefits);
        calculateCutom(customNoOfCuts,customDruation);
     }

     
     function addRemoveAddOnServices(style){
        var new_otherServices = addonOtherServices;
        style.num_of_cuts = 1;

        if(new_otherServices.length < 1){
            new_otherServices.push(style);
        }else{
            var add = true;
            for (let index = 0; index < new_otherServices.length; index++) {
                if(new_otherServices[index].service == style.service){
                    new_otherServices.splice(index,1);
                    var add = false;
                    break;
                }
            }
            if(add){
                new_otherServices.push(style);
            }
        }
        setaddonOtherServices(new_otherServices);
        calculateCutom(customNoOfCuts,customDruation);
     }

     function calculateCutom(cuts,duration){
        var new_addOnBenefits = addOnBenefits;
        var new_otherServices = addonOtherServices;
        
        //console.log(new_addOnBenefits);
        var cost = isaddon ? fixedPackgeCost : 0;
        //var addonsCost = 0;
        new_addOnBenefits.forEach((benefit) => {
            cost += benefit.cost * benefit.num_of_cuts;
            //addonsCost +=benefit.cost;
        })

        // var otherServicesCost = 0;
        new_otherServices.forEach((benefit) => {
            cost += benefit.cost * benefit.num_of_cuts;
        })

        //get discount and based on user's selections
        var discount = 0;
        if(props.package.toUpperCase() === "FAMILY"){
            discount = 2/100 * cost;
        }

     
       //setpackageBenefits(benefits);
       
       //calculate the discount of the package if it's custom
       if(props.package.toUpperCase().trim() == 'CUSTOM'){
          if(cost > 100){
            discount = 5/100 * cost;
          }
          //cost = cost - discount;
       }

       setdiscount(discount);
       setpackageCost(cost);
       settotalCost(cost - discount);
       if(offerType != 'custom' && !isaddon){
           //console.log(customNoOfCuts);
           //setdurationsOptions(form_fields[0].data);
           numOfCuts.forEach((cuts) => {
               //console.log(customDruation);
               if(cuts.duration.toUpperCase().trim() == customDruation.toUpperCase().trim()){
                   setnumOfCutsOptions(JSON.parse(cuts.cuts));
                   //console.log(cuts.cuts);
               }
           })
       }
      //console.log('custom');

     }



     

     async function makePayment(){
         //console.log(seletedDuration);

        
         if(props.package.trim().toUpperCase() == 'CUSTOM' && addOnBenefits.length < 1){
            seterror(true);
            return;
         }else  if(props.package.trim().toUpperCase() == 'FAMILY' && addOnBenefits.length < 1){
            seterror(true);
            return;
         }



        
         var cuts = selectedPackage === "" ?  customNoOfCuts : noOfCuts;
         var url = Config.apiBaseUrl+'/getPaymentUrl/';

         var saddOnBenefits = addOnBenefits;
         var saddonOtherServices = addonOtherServices;

         

         var selectedFixedPackageBenefits =  selectedFixedPackage.hairStyles ? JSON.parse(selectedFixedPackage.hairStyles) : [];
         var selectedFixedOtherservices = selectedFixedPackage.otherServices ? JSON.parse(selectedFixedPackage.otherServices) : [];

         //add fixed property the fixed packages

         
         if(selectedFixedOtherservices.length > 0){
            selectedFixedOtherservices.forEach((spackage) => {
                spackage['fixed']=true;
                spackage['num_of_cuts'] = selectedFixedPackage.noOfCuts;
             })
         }

         if(selectedFixedPackageBenefits.length > 0){
            selectedFixedPackageBenefits.forEach((spackage) => {
                spackage['fixed']=true;
                spackage['num_of_cuts'] = selectedFixedPackage.noOfCuts;
             })
         }

        
        

         
        saddOnBenefits = (saddOnBenefits.concat(selectedFixedPackageBenefits));
        saddonOtherServices = (saddonOtherServices.concat(selectedFixedOtherservices));
        
        
         

         var body = {
            'selectedPackage': selectedPackage == "" ? props.package+" Custom" : selectedPackage,
            'addOnBenefits' : saddOnBenefits,
            'selectedDuration' : seletedDuration,
            'cuts' : selectedPackage == "" ? 0 : cuts,
            'addonOtherServices': saddonOtherServices,
            'totalCost': totalCost,
            'userData': props.userData,
            'country': baseHairStyles[0].country,
            'beneficiary': forwho === 'ME' ? forwho : beneficiary,
            'initialCost': selectedPackage == "" ? 0 : selectedFixedPackage.cost,
            'sideBenefits': selectedPackage == "" ? 0 : selectedFixedPackage.benefits,
         }


               

          // Create PaymentIntent as soon as the page loads
          setloading(true);

          const response = await axios.post(
            config.apiBaseUrl+"/create-payment-intent",
            { body }
          );

        
        setloading(false);

        if(response.status === 201){
            seterror(true);
            seterrorMessage('User already exist');
            return;
        }
        if (response.status === 200) {
            setloading(false);
            //console.log(body);
            setclientSecret(response.data.clientSecret);
            setdata(body);
            setmodal(true);
        } else {
            seterror(true);
            seterrorMessage('Opps! an error occured');
        }

     }

     function increaseAddonBenefitCuts(style,e){
        if(e.target.value < 1){
            return;
        }

        var new_addOnBenefits = addOnBenefits;
        for(var benefit of new_addOnBenefits){
            if(benefit.hairstyleName == style.hairstyleName){
                benefit.num_of_cuts = e.target.value;
                break;
            }
        }
        
        setaddOnBenefits(new_addOnBenefits);
        calculateCutom(customNoOfCuts,customDruation);
     }


     function increaseAddonServicesCuts(style,e){
        if(e.target.value < 1){
            return;
        }

        var new_addonOtherServices = addonOtherServices;
        for(var service of new_addonOtherServices){
            if(service.service == style.service){
                service.num_of_cuts = e.target.value;
                break;
            }
        }
        
        setaddonOtherServices(new_addonOtherServices);
        calculateCutom(customNoOfCuts,customDruation);
     }

   
    return(
        <Grid container>

            {props.package.toUpperCase().trim() != "CUSTOM" ?
            <Grid item xs={12} md={12} className={classes.formBox}>

            <FormControlLabel  onChange={(e)=>{
                setofferType("special");
                setPackage(selectedFixedPackage);
                //console.log(selectedPackage +'hello world');
            }} checked={offerType === "special" ? true : false}  control={<Radio />} label={props.package + ' Packages'} />

            <Input
                type="drop"
                label=""
                disabled={offerType ==="special"  ? false : true}
                data={specialPacakgesOptions}
                value={selectedPackage.toUpperCase().trim()}
                onTextChange={(e)=>{
                   
                    
                   for(var i =0; i<specialPackages.length; i++){
                       if(specialPackages[i].packageName.toUpperCase().trim() === e.value.toUpperCase().trim()){
                        setPackage(specialPackages[i]);
                        break;
                       }
                   }
                }}
                />
            </Grid> : null}

            {show
            ?<Grid item xs={12}> <Grid item xs={12} md={12} className={classes.formBox}>
            <FormControlLabel onChange={(e)=>{
                //setPackage("",0,0,'One Time',"");
                var cuts = selectedPackage == "" ? customNoOfCuts : selectedFixedPackage.noOfCuts;
                calculateCutom(cuts,customDruation);
                setofferType("custom");

            }} checked={offerType === "custom"  ? true : false}  control={<Radio />} label={customLabel} />
    
            
            <Grid item xs={12} md={12} className={classes.formBox} style={{padding:0}}>
                <label className={classes.label}>Select your prefered hair style</label><br/>
                <select className={classes.select} 
                   onChange={(e)=>{
                       if(e.target.value == ""){
                           return;
                       }
                        addRemoveAddOn(JSON.parse(e.target.value));
                        setofferType("custom");
                    }}>
                    <option value="">--SELECT---</option>
                   {baseHairStyles.map((style,index)=>
                    <option value={JSON.stringify(style)} key={index}>{style.hairstyleName}</option>
                   )}
                </select>

                
                {addOnBenefits.length > 0 ? <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <p><strong>Hair style</strong></p>
                        <p><strong>No. of cuts</strong></p>
                </Box> : null}

                {addOnBenefits.map((style,index)=>
                    <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <p>{style.hairstyleName}</p>
                        <Box>
                             <span>{style.base+' '+style.cost} x </span>
                             <InputBase disabled={selectedPackage == "" ? false : true} style={{width:50,borderBottom:"2px solid rgba(0,0,0,0.3)"}} min={1} type={"number"} defaultValue={style.num_of_cuts} onChange={(e)=>{
                                 increaseAddonBenefitCuts(style,e);
                             }}/>
                             <IconButton onClick={()=>{
                                  addRemoveAddOn(style);
                             }}><Icon style={{color:"red"}}>delete</Icon></IconButton>
                        </Box>
                    </Box>
                )}
            
            </Grid>
        </Grid> 



        <Grid item xs={12} md={12} className={classes.formBox}>
                <label className={classes.label}>Select your services (optional)</label><br/>
                <select className={classes.select} 
                   onChange={(e)=>{
                       if(e.target.value == ""){
                           return;
                       }
                        addRemoveAddOnServices(JSON.parse(e.target.value));
                        setofferType("custom");
                    }}>
                    <option value="">--SELECT---</option>
                   {otherServices.map((style,index)=>
                    <option value={JSON.stringify(style)} key={index}>{style.service}</option>
                   )}
                </select>

                
                {addonOtherServices.length > 0 ? <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <p><strong>Service</strong></p>
                        <p><strong>No. of Times</strong></p>
                </Box> : null}

                {addonOtherServices.map((style,index)=>
                    <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <p>{style.service}</p>
                        <Box>
                             <span>{style.base+' '+style.cost} x </span>
                             <InputBase disabled={selectedPackage == "" ? false : true} style={{width:50,borderBottom:"2px solid rgba(0,0,0,0.3)"}} min={1} type={"number"} defaultValue={style.num_of_cuts} onChange={(e)=>{
                                 increaseAddonServicesCuts(style,e);
                             }}/>
                             <IconButton onClick={()=>{
                                  addRemoveAddOnServices(style);
                             }}><Icon style={{color:"red"}}>delete</Icon></IconButton>
                        </Box>
                    </Box>
                )}
            
            </Grid>
 </Grid>: null}

            {form_fields.map((field,index)=>
                        <Grid item xs={12} md={field.md} className={classes.formBox}>
                        <Input disabled={offerType ==="custom" ? false : true} errorText={field.errorText} data={durationsOptions}  error={field.error} showPass={field.show} value={offerType == "custom" ? customDruation : ""} type={field.type} onTextChange={(e)=>{
                            for (let index = 0; index < numOfCuts.length; index++) {
                                if(numOfCuts[index].duration.toUpperCase().trim() === e.value.toUpperCase().trim()){
                                    //console.log(e.value);
                                    setseletedDuration(e.value);
                                    setcustomDruation(e.value);
                                    calculateCutom(JSON.parse(numOfCuts[index].cuts)[0],e.value)
                                    setcustomNoOfCuts(JSON.parse(numOfCuts[index].cuts)[0])
                                    setnumOfCutsOptions(JSON.parse(numOfCuts[index].cuts));
                                    
                                    break;
                                }
                                
                            }
                        }} placeholder={field.placeholder} label={field.label}/>
                        </Grid>)}

                        {/* <Grid item xs={12} md={12} className={classes.formBox}>
                        {offerType == "custom" ? null : <Input value={offerType == "custom" ? customNoOfCuts : ""} disabled={offerType ==="custom" ? false : true} errorText={""} data={numOfCutsOptions}  error={false} showPass={"false"} type={"drop"} onTextChange={(e)=>{
                            setcustomNoOfCuts(e.value);
                            calculateCutom(e.value,customDruation);
                        }} placeholder={"Number of cuts"} label={"Number of cuts"}/>
                        }
                        </Grid> */}

            {packageBenefits.length > 0 ?
                <Grid item xs={12} md={12} className={classes.formBox}>
                    <h5>Package Additional Benefits</h5>
                    <hr/><br/>
                    {packageBenefits.map((benefit)=>
                     <div>
                         <Icon style={{fontSize:12,color:'green',marginRight:5}}>add</Icon>
                        <span>{benefit}</span>
                     </div>
                    )}
                </Grid>
            : null}

            
            <Grid item xs={12} md={12} className={classes.formBox}>

                <Input value="ME" disabled={props.forwho === "ME" ? true : false} errorText={""} data={['Me','Some one']}  error={false} showPass={"false"} type={"drop"} onTextChange={(e)=>{
                    console.log(forwho);
                setforwho(e.value);
                }} placeholder={"Whos is the package for?"} label={"Whos is the package for?"}/>

              
            </Grid>

            {forwho !== "ME" ? 
            <Grid item xs={12} md={12} className={classes.formBox}>
            <Input  errorText={"Enter Account ID of Beneficiary "} data={[]}  error={false} showPass={"false"} type={"text"} onTextChange={(e)=>{
                 setbeneficiary(e.value);
                }} placeholder={"Beneficiary Account ID"} label={"Beneficiary Account ID (optional)"}/>
                </Grid> : null}
              

            <Grid item xs={12} md={12} className={classes.formBox}>
                    <hr/>
                    {props.package.toUpperCase().trim() == 'FAMILY' || props.package.toUpperCase().trim() == 'CUSTOM' ?
                     <div>
                        <div className={classes.total}>
                            <p>Sub Total</p>
                            {baseHairStyles.length > 0 ? <div><span style={{color:"rgba(0,0,0,0.6)"}}>{baseHairStyles[0].base}</span> <span style={{fontSize:30,fontWeight:"bold"}}>{packageCost.toFixed(2)}</span></div> : null}
                        </div>
                        <div className={classes.total}>
                            <p>Discount</p>
                            {baseHairStyles.length > 0 ? <div><span style={{color:"rgba(0,0,0,0.6)"}}> - {baseHairStyles[0].base}</span> <span style={{fontSize:30,fontWeight:"bold"}}>{discount.toFixed(2)}</span></div> : null}
                        </div>
                     </div> :null }
                    <div className={classes.total}>
                        <p>Total</p>
                        {baseHairStyles.length > 0 ? <div><span style={{color:"rgba(0,0,0,0.6)"}}>{baseHairStyles[0].base}</span> <span style={{fontSize:30,fontWeight:"bold"}}>{(totalCost).toFixed(2)}</span></div> : null}
                    </div>
                   
            </Grid>
            <Box  style={{display:"flex",justifyContent:"space-between",width:"100%",padding:10}}><p></p>
                        <Button disabled={loading ? true : false} onClick={()=>{
                            makePayment();
                        }} style={{backgroundColor:"black",color:"white",borderRadius:0,paddingLeft:20,paddingRight:20}}>{loading ? <span> <CircularProgress className={classes.loader} size={20} /> PLEASE WAIT...</span> : <span>PROCEED TO PAYMENT</span>} </Button>

                        
                      
                   </Box>

            <Snackbar open={error} autoHideDuration={6000} onClose={()=>{
                seterror(false);
            }}>
            <Alert variant="filled" severity="error" onClose={()=>{
                seterror(false);
            }}>
                {errorMessage}
            </Alert>
            </Snackbar>


            {/* The package summary modal box */}

            {modal ? 
            <PackageSummaryModal body={data} data={
                {
                    'selectedPackage': selectedPackage == "" ? props.package+" Custom" : selectedPackage,
                    'addOnBenefits' : addOnBenefits,
                    'selectedDuration' : seletedDuration,
                    'cuts' : customNoOfCuts,
                    'addonOtherServices': addonOtherServices,
                    'totalCost': totalCost.toFixed(2),
                    'packageBenefits':packageBenefits,
                    'currency':'£'
                }
            }  makePayment={makePayment} register = {true} handleChange={()=>{}} stripeapikey={Config.stripeapikey} clientSecret={clientSecret} close={()=>{setmodal(false)}}/>
            : null }
        </Grid>
    )
}
export default App;
