import React,{useState,useEffect} from 'react';
import Header from './header'

import {makeStyles,FormControlLabel,Checkbox,Radio,Typography,ExpansionPanel,ExpansionPanelSummary,Grid,ExpansionPanelDetails,Icon} from '@material-ui/core'
import clsx from 'clsx';
import Footer from './footer'
import Config from '../includes/config'
import '../App.css'
import Input from './textInput'

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
   }
}));


const data = ['Strand One','STRAND 2 - ASSORTED ','Premium','Family - Monthly Standard', 'Family - Quarterly Standard','Family - 6 months Standard','Family - 1 year Standard','Dreads','Custom'];

const available_packages = [
    {
        subscription :"strand one",
        packages:['Standard Regular (On Demand)','Standard week','Standard month','Standard quarterly (3 Months)','Standard (6 Months)','Standard (1 year)']
    },{
        subscription: 'STRAND 2 - ASSORTED',
        packages:['Standard Regular (On Demand)','Standard week','Standard month','Standard quarterly (3 Months)','Standard (6 Months)','Standard (1 year)']
    },{
        subscription: 'Family - Monthly Standard',
        packages:['Family of 2 ','Family of 4 ','Family of 6 ','Family of 8','Family of 10']
    },{
        subscription: 'Family - Quarterly Standard',
        packages:['Family of 2 ','Family of 4 ','Family of 6 ','Family of 8','Family of 10']
    },{
        subscription: 'Family -6 months Standard',
        packages:['Family of 2 ','Family of 4 ','Family of 6 ','Family of 8','Family of 10']
    },{
        subscription: 'Family -1 year Standard',
        packages:['Family of 2 ','Family of 4 ','Family of 6 ','Family of 8','Family of 10']
    },{
        subscription: 'Premium',
        packages:['Premium One Time','Premium Monthly(5x/Month)','Premium Monthly (4x/Month)','Premium Quarterly (15x Per Quarter)','Premium Quarterly(12x Per Quarter)','Premium 6 months (30x in 6 months)','Premium 6 months (24x in 6 months)','Premium 12 months (60x in 12 months)','Premium 12 months (48x in 12months)']
    },{
        subscription: 'Dreads',
        packages:['Full dreads','Treatments']
    }
]

const standardOneHairStyles = ['Hair Cut & Trim']

const standardTwoHairStyles = ['Hair Cut & Trim','Dye']
const standardTwoPackages = [
    {
        name:"Standard Regular (On Demand)",
        benefits:[
            {
                name:"Normal Hair cut & Facial Triming + Hair Wash",
                items:["Hair cut & Trim","Hair Wash"]
            },{
                name:"Normal Hair cut + Dye",
                items:["Hair cut & Trim","Dye"]
            },{
                name:"Normal Hair cut + Sporting Waves",
                items:["Hair cut & Trim","Sporting Waves"]
            }
        ],
        cuts: 1,
        duration: 'One time'
    },
    {
        name:"Standard week",
        benefits:[
            {
                name:"Normal Hair cut & Facial Triming + Hair Wash + Sporting Waves",
                items:["Hair cut & Trim","Hair Wash","Sporting Waves"]
            },{
                name:"Normal Hair cut + Dye + Hair Wash",
                items:["Hair cut & Trim","Dye","Hair Wash"]
            },{
                name:"Normal Hair cut + Sporting Waves + Dye",
                items:["Hair cut & Trim","Sporting Waves","Dye"]
            }
        ],
        cuts: 2,
        duration: '1 Week'
    },
    {
        name:"Standard month",
        benefits:[
            {
                name:"Normal Hair cut & Facial Triming + Hair Wash + Sporting Waves + Dye",
                items:["Hair cut & Trim","Hair Wash","Sporting Waves","Dye"]
            }
        ],
        cuts: 5,
        duration: '1 Month'
    },{
        name:"Standard quarterly (3 Months)",
        benefits:[
            {
                name:"Normal Hair cut & Facial Triming + Hair Wash + Sporting Waves + Dye",
                items:["Hair cut & Trim","Hair Wash","Sporting Waves","Dye"]
            }
        ],
        cuts: 15,
        duration: '3 Months'
    },
    {
        name:"Standard (6 Months)",
        benefits:[
            {
                name:"Normal Hair cut & Facial Triming + Hair Wash + Sporting Waves + Dye",
                items:["Hair cut & Trim","Hair Wash","Sporting Waves","Dye"]
            }
        ],
        cuts: 30,
        duration: '6 Months'
    },
    {
        name:"Standard (1 year)",
        benefits:[
            {
                name:"Normal Hair cut & Facial Triming + Hair Wash + Sporting Waves + Dye",
                items:["Hair cut & Trim","Hair Wash","Sporting Waves","Dye"]
            }
        ],cuts: 65,
        duration: '1 year'
    }
]


function App(props) {
  const classes = useStyles();
  const [packages, setpackages] = useState(available_packages[0].packages);
  const [baseHairStyles, setbaseHairStyles] = useState([]);
  const [noOfCuts, setnoOfCuts] = useState(1);
  const [duration, setduration] = useState('One Time');
  const [packageCost, setpackageCost] = useState(0);
  const [noOfPersons, setnoOfPersons] = useState(0);
  const [packageBaseStyles, setpackageBaseStyles] = useState(standardOneHairStyles);
  const [selectedPackage, setselectedPackage] = useState(available_packages[0].packages[0]);
  const [selectedsubscription, setselectedsubscription] = useState(data[0]);
  const [userCountry, setuserCountry] = useState('England');
  const [currencyRate, setcurrencyRate] = useState({rate:"1",base:"GBP"});
  const [addOnBenefits, setaddOnBenefits] = useState([]);
  const [city, setcity] = useState("");
  const [_standardTwoPackages, set_standardTwoPackages] = useState(standardTwoPackages);
  const [standardTwoSelectedBenefits, setstandardTwoSelectedBenefits] = useState(0);

 useEffect(() => {
    fetch("https://api.ipify.org/?format=json")
    .then(response => {
      return response.json();
     }, "jsonp")
    .then(res => {
      getUserLocation(res.ip);
    })
    .catch(err => console.log(err))

 }, []);

 useEffect(() => {
     calculatePackages(selectedsubscription,selectedPackage)
 }, [baseHairStyles]);

 function getUserLocation(ip){
    fetch("http://www.geoplugin.net/json.gp?ip="+ip)
    .then(response => {
      return response.json();
     }, "jsonp")
    .then(res => {
      fetchBaseHairStyles(res.geoplugin_city,res.geoplugin_countryName);
      setuserCountry(res.geoplugin_countryName);
      setcity(res.geoplugin_city);
    })
    .catch(err => console.log(err))
 }

 function fetchBaseHairStyles(city,country){
     console.log(props.ethinicity);
     setbaseHairStyles([]);
     city = 'Birmingham';
     country = 'United Kingdom';
    fetch(Config.apiBaseUrl+'/baseHairStyles/WHITE/'+city+'/'+country)
    .then((response)=>response.json())
    .then((json)=>{
        setbaseHairStyles(json)})
    .catch((error)=>console.error(error))
    .finally()
 }

 function calculatePackages(subscription,selectedpackage){
     if(subscription.toUpperCase().trim() == "Strand One".toUpperCase().trim() || subscription.toUpperCase().trim() == "STRAND 2 - ASSORTED".toUpperCase().trim()){
        var cost = standardCalculations(subscription,selectedpackage);
        return (cost);
     }else if(subscription.toUpperCase().trim() == 'PREMIUM'){
         var cost = calculatePremiumCost(subscription,selectedPackage);
         return cost;
     }
 }
 function standardCalculations(subscription,selectedpackage){
    //get number of cuts for the standard packages
    var strandPackagesAndCuts = [
        {
            name: 'Standard Regular (On Demand)',
            cuts: 1,
            duration: 'One time'
        },{
            name: 'Standard week',
            cuts: 2,
            duration: '1 Week'
        },{
            name: 'Standard month',
            cuts: 5,
            duration: '1 Month'
        },{
            name: 'Standard quarterly (3 Months)',
            cuts: 15,
            duration: '3 Months'
        },{
            name: 'Standard (6 Months)',
            cuts: 30,
            duration: '6 Months'
        },{
            name: 'Standard (1 year)',
            cuts: 65,
            duration: '1 year'
        }
    ]

    if(subscription.toUpperCase().trim() == "Strand One".toUpperCase()){
    for(var i = 0; i<strandPackagesAndCuts.length; i++){
        
        if(strandPackagesAndCuts[i].name.trim().toUpperCase() == selectedpackage.trim().toUpperCase()){
            setnoOfCuts(strandPackagesAndCuts[i].cuts);
            setduration(strandPackagesAndCuts[i].duration);
            setnoOfPersons(1);
            var standardSTyles = [];
            
                standardSTyles = standardOneHairStyles;
                setpackageBaseStyles(standardOneHairStyles);

                var cost = 0;
                baseHairStyles.forEach((style) => {
                    standardSTyles.forEach((sstyle) => {
                        if(style.hairstyleName.trim().toUpperCase() == sstyle.toUpperCase().trim()){
                            cost += style.cost;
                        }
                    })
                })
                cost = strandPackagesAndCuts[i].cuts * cost;
                var discount = 2/100 * cost;

                setpackageCost(cost-discount);

                return cost;      
            //setpackageCost(convert(cost).amount);
           // console.log(selectedpackage)
            
            break;
        }
    }
    }else{
        var packageHairStyles = [];
        for(var i =0; i<standardTwoPackages.length; i++){
            if(selectedpackage.toUpperCase().trim() == standardTwoPackages[i].name.trim().toUpperCase()){
                setnoOfCuts(standardTwoPackages[i].cuts);
                setduration(standardTwoPackages[i].duration);
                setnoOfPersons(1);
                //packageHairStyles.push(standardTwoPackages[i].benefits.name);
                standardTwoPackages[i].benefits.forEach((benefit) => {
                    packageHairStyles.push(benefit.name);
                })

                calculateStandardTwoCost(standardTwoPackages[i].benefits[0].name);
                setstandardTwoSelectedBenefits(0);
                break;
            }
        }

        var cost = setpackageBaseStyles(packageHairStyles);
        return cost;
        //console.log(packageBaseStyles)
    }
    
 }


 function getCurrencyRate(){
    if(userCountry != 'England' && userCountry !='United Kingdom'){
        var convertTo = 'GBP_USD';
        var currency = 'USD';
        if(userCountry == 'Ghana'){
            convertTo = 'GBP_GHS';
            currency = 'GHS';
        }
        fetch("https://free.currencyconverterapi.com/api/v6/convert?q="+convertTo+"&compact=ultra&apiKey=1066ae634e3a07b9c161")
        .then(response => {
          return response.json();
         }, "jsonp")
        .then(res => {
           setcurrencyRate({rate:res[convertTo],base:currency})
        })
        .catch(err => console.log(err))
    }
 }


 function addRemoveAddOn(style){
    var new_addOnBenefits = addOnBenefits;

    if(new_addOnBenefits.length < 1){
        new_addOnBenefits.push(style);
    }else{
        if(new_addOnBenefits.indexOf(style) > -1){
            new_addOnBenefits.splice(new_addOnBenefits.indexOf(style),1);
        }else{
            new_addOnBenefits.push(style);
        }
    }

    setaddOnBenefits(new_addOnBenefits);
    console.log(new_addOnBenefits);
    var cost = calculatePackages(selectedsubscription,selectedPackage);
    new_addOnBenefits.forEach((benefit) => {
        cost +=benefit.cost;
    })

    setpackageCost(cost);
 }

 function calculateStandardTwoCost(benefit){

    for(var i=0; i<standardTwoPackages.length; i++){
        if(standardTwoPackages[i].name.toUpperCase().trim() == selectedPackage.trim().toUpperCase()){
            console.log(standardTwoPackages[i].benefits.length)
            for(var x=0; x<standardTwoPackages[i].benefits.length; x++){
                if(standardTwoPackages[i].benefits[x].name == benefit){
                    var items = (standardTwoPackages[i].benefits[x].items);

                    var cost = 0;
                    baseHairStyles.forEach((style) => {
                        items.forEach((sstyle) => {
                            if(style.hairstyleName.trim().toUpperCase() == sstyle.toUpperCase().trim()){
                                cost += style.cost;
                            }
                        })
                    })
                    var cost = cost * standardTwoPackages[i].cuts;
                    var discount = 2/100 * cost;

                    setpackageCost(cost-discount);
                    return cost;
                    break;
                }
            }
            break;
        }
    }

    return;
     
 }

 function calculatePremiumCost(subscription,selectedpackage){
     setpackageBaseStyles(standardOneHairStyles);

     var normalHaircutCost = 0;
     for(var i=0; i<baseHairStyles.length; i++){
         if(standardOneHairStyles[0].toUpperCase()==baseHairStyles[i].hairstyleName.toUpperCase()){
            normalHaircutCost = baseHairStyles[i].cost;
            break;
         }
     }

     

     var premiumPackages = [
         {
             name: 'Premium One Time',
             cuts: 1,
             discountP: 0,
             depend:10,
             duration:"One Time"
         },{
            name: 'Premium Monthly(5x/Month)',
            cuts: 5,
            discountP: 10,
            depend:0,
            duration:"1 Month"
        },{
            name: 'Premium Monthly (4x/Month)',
            cuts: 4,
            discountP: 10,
            depend:0,
            duration:"1 Month"
        },{
            name: 'Premium Quarterly (15x Per Quarter)',
            cuts: 15,
            discountP: 2,
            depend:1,
            duration:"3 Months"
        },{
            name: 'Premium Quarterly(12x Per Quarter)',
            cuts: 12,
            discountP: 2,
            depend:1,
            duration:"3 Months"
        },{
            name: 'Premium 6 months (30x in 6 months)',
            cuts: 30,
            discountP: 2,
            depend:3,
            duration:"6 Months"
        },{
            name: 'Premium 6 months (24x in 6 months)',
            cuts: 24,
            discountP: 2,
            depend:3,
            duration:"6 Months"
        },{
            name: 'Premium 12 months (60x in 12 months)',
            cuts: 60,
            discountP: 2,
            depend:5,
            duration:"12 Months"
        },{
            name: 'Premium 12 months (48x in 12months)',
            cuts: 46,
            discountP: 2,
            depend:5,
            duration:"12 Months"
        }
    ]

    
    for(var i=0; i < premiumPackages.length; i++){
        if(selectedpackage.toUpperCase().trim() == premiumPackages[i].name.toUpperCase().trim()){
            
            setduration(premiumPackages[i].duration);
            setnoOfCuts(premiumPackages[i].cuts);
            setnoOfPersons(1);

            var baseCost = normalHaircutCost * 2;

            if(selectedpackage.toUpperCase().trim().indexOf('ONE TIME')){
                setpackageCost(baseCost);
            }else{
                //baseCost = premiumPackages[depend] *  
            }
            break;
        }
    }


    
 }

  
  return (
       
       <Grid container>
            <Grid item xs={12} md={12} className={classes.formBox}>
                            <Input
                            type="drop"
                            label="Select subscription"
                            data={data}
                            onTextChange={(e)=>{
                               for(var i =0; i<available_packages.length; i++){
                                   if(e.value.trim() == available_packages[i].subscription.toUpperCase().trim()){
                                       var newPackages = available_packages[i].packages;
                                       setpackages(newPackages);
                                       setselectedPackage(newPackages[0]);
                                       //console.log('hello world',newPackages[0]);
                                       break;
                                   }
                               }
                               calculatePackages(e.value,selectedPackage);
                               setselectedsubscription(e.value);
                               setaddOnBenefits([]);
                               fetchBaseHairStyles(city,userCountry);
                            }}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} className={classes.formBox}>
                            <Input
                            type="drop"
                            label="Available packages"
                            data={packages}
                            onTextChange={(e)=>{
                                setselectedPackage(e.value);
                                setaddOnBenefits([]);
                                fetchBaseHairStyles(city,userCountry);
                                calculatePackages(selectedsubscription,e.value)
                            }}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} className={classes.formBox}>
                        <h4>Package Benefits</h4>
                        <hr/>

                        {selectedsubscription.trim().toUpperCase() == 'STRAND 2 - ASSORTED' ? 
                               
                               <div>
                                {packageBaseStyles.map((style,index)=>
                                  <div>
                                    <FormControlLabel onChange={(e)=>{
                                     setstandardTwoSelectedBenefits(e.target.value)
                                     calculateStandardTwoCost(style);
                                  }} checked={standardTwoSelectedBenefits == index ? true : false} value={index} control={<Radio />} label={style} /><br/>
                                  </div>
                                )}
                               
                                </div>
                                :
                                <div>
                                    {packageBaseStyles.map((style)=>
                                    <FormControlLabel
                                    control={
                                    <Checkbox
                                        checked={true}
                                        name="checkedB"
                                        color="secondary"
                                    />
                                    }
                                    label={style}
                                    />)}
                                </div>
                                }
                            



                        <ExpansionPanel style={{marginTop:20, display: selectedsubscription.toUpperCase().trim().indexOf("STRAND") > -1 ? "none" : "block"}}>
                            <ExpansionPanelSummary
                            expandIcon={<Icon>keyboard_arrow_down</Icon>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Typography style={{fontFamily:"Muli",fontWeight:800}}>Add more hair styles</Typography>
                            </ExpansionPanelSummary>
                           
                            {/* hair styles */}
                            {baseHairStyles.map((style)=>
                                 <div>
                                     {packageBaseStyles.indexOf(style.hairstyleName) < 0 ?
                                     
                                     <ExpansionPanelDetails style={{display:'flex',justifyContent:"space-between",paddingTop:0,marginTop:0}}>
                                     <FormControlLabel
                                          control={
                                          <Checkbox
                                              name="checkedB"
                                              color="secondary"
                                              onChange={(e)=>{
                                                addRemoveAddOn(style);
                                              }}
                                          />
                                          }
                                          label={style.hairstyleName}
                                      />
                                      <p>{style.base} {style.cost}</p>
                                   </ExpansionPanelDetails> : null}
                                 </div>
                            )}
                            {/* hair styles */}
                            
                        </ExpansionPanel>
                        </Grid>
                        
                        
                            <Grid item xs={12} md={12} className={classes.formBox}>
                            <Input type="text" disabled={duration=="" ? false : true} label="Duration" placeholder="Duration" value={duration.toUpperCase()}/>
                            </Grid>

                            <Grid item xs={12} md={12} className={classes.formBox}>
                            <Input type="text" disabled={noOfCuts=="" ? false : true} label="Number of cuts" placeholder="cuts" value={noOfCuts}/>
                            </Grid>

                            <Grid item xs={12} md={12} className={classes.formBox}>
                            <Input type="text" disabled={noOfPersons=="" ? false : true} label="Number of persons" placeholder="persons" value={noOfPersons}/>
                            </Grid>

                            <Grid item xs={12} md={12} className={classes.formBox}>
                                 <hr/>
                                 <div className={classes.total}>
                                     <p>Total</p>
                                     {baseHairStyles.length > 0 ? <div><span style={{color:"rgba(0,0,0,0.6)"}}>{baseHairStyles[0].base}</span> <span style={{fontSize:30,fontWeight:"bold"}}>{packageCost.toFixed(2)}</span></div> : null}
                                 </div>
                            </Grid>

                    </Grid>
  );
  }
 

export default App;
