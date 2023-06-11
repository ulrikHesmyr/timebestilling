require("dotenv").config();
require("./configuration/database").connect();
const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const mailer = require("./configuration/mailer");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const Client = require("target365-sdk");
//heihei

const Bestiltetimer = require("./model/bestilling");
const Environment = require("./model/env");
const FriElementer = require("./model/fri");
const Brukere = require("./model/brukere");
const {BEDRIFT, NODE_ENV, CUSTOMER_KEY, ACCESS_TOKEN_KEY} = process.env;

app.use(cors());
app.use(express.json({limit:'12mb'}));
app.use(express.urlencoded({limit:'12mb'}));
app.use(cookieParser());
app.use(helmet());
app.use(express.static('build'));

//Limiting the total amount of requests per minute (From any IP address)
let requestCounterLimit = 0;
let maksRequestsPerMinutt = 1000;
let harSendtMail = false;
if(NODE_ENV === "development"){
  maksRequestsPerMinutt = 100;
} 

setInterval(() => {
  requestCounterLimit = 0;
  harSendtMail = false;
}, 60000); //1 minutt

//Middleware som gjelder totale antall requests per minutt
const requestCounterMiddleware = (req, res, next) => {
  if(requestCounterLimit > maksRequestsPerMinutt){
    if(!harSendtMail){
      mailer.sendMail(`For mye trafikk for ${BEDRIFT}`, `${maksRequestsPerMinutt} requests per minutt. Evaluer om det er nødvendig å øke antall requests per minutt eller vurder om det er ddos angrep`);
      harSendtMail = true;
    }
    return res.status(429).json({m: "Administrator er på saken. Serveren har for mye trafikk pr minutt. Vennligst prøv igjen om 1 minutt!"});
  } else {
    requestCounterLimit++;
    next(); 
  }

}


const hovedLimiter = rateLimiter({
  windowMs: 30 * 60 * 1000,
  max: 120, //Ikke endre fra 800. Dette er limit pr IP adresse. Kan maks ha 800 requests pr 30 minutt pr IP adresse
  message: {m:"For mye trafikk. Vennligst prøv igjen om 30 min"},
});

function ansattSjekker(req,res,next){
  const ansattBestilling = req.cookies.access_token; 
  const ansattBestilling2 = req.cookies.two_FA_valid; 
  let ansatt = false;
  if(ansattBestilling){
      ansatt = jwt.verify(ansattBestilling, ACCESS_TOKEN_KEY);
  } else if (ansattBestilling2){
      ansatt = jwt.verify(ansattBestilling2, ACCESS_TOKEN_KEY);
  }

  if(NODE_ENV === "development"){
      next()
  } else {
      
      if(!ansatt){
          hovedLimiter(req,res,next);
      } else {
          next();
      }
  }  
  
}



app.use(requestCounterMiddleware);

app.use(ansattSjekker);


//Sender SMS om feedback fra alle kunder som har hatt behandling i dag. Merk at dette skjer kl 1930
//FØR timebestillingen slettes fra databasen
//Dette avhenger av om salongen har aktivert feedback SMS-er i admin panelet
//19:30
schedule.scheduleJob('30 19 * * *', async ()=>{
  try {
    const env = await Environment.findOne({bedrift: BEDRIFT});
    if(env && env.aktivertFeedbackSMS){
        
      const idag = hentDatoIDag();
      const tilbakemeldingBestillinger = await Bestiltetimer.find({dato: idag});
      
      //Sender SMS med google review link, 18 timer etter at timebestillingen ble gjort
      tilbakemeldingBestillinger.forEach(async timebestilling => {
        let SMS_ENABLED = true;
        if(SMS_ENABLED){
            let baseUrl = "https://shared.target365.io/";
            let keyName = process.env.KEYNAME_SMS;
            let privateKey = process.env.PRIVATE_KEY;
            let serviceClient = new Client(privateKey, { baseUrl, keyName });
            let outMessage = {
                transactionId: uuidv4(),
                sender:'Target365',
                recipient:`+47${jwt.verify(timebestilling.telefonnummer, CUSTOMER_KEY).telefonnummer}`,
                content:`Hei ${jwt.verify(timebestilling.kunde, CUSTOMER_KEY).kunde}! Vi håper du er fornøyd med ditt besøk hos oss.\n\nDersom det er ønskelig, så legg gjerne igjen en tilbakemelding på besøket. Du kan gi oss en tilbakemelding ved å trykke på linken under. \n\n${process.env.GOOGLE_REVIEW_LINK} \n\nMed vennlig hilsen \n${BEDRIFT}`
            }
            await serviceClient.postOutMessage(outMessage);
        } 
      });
    }
  } catch (error) {
    console.log(error);
  }
})

//Sender ut påminnelse 1 dag i forveien (kl 13:30) om at kunden har timebestilling
schedule.scheduleJob('30 13 * * *', async ()=>{
  try {
    const imorgen = nesteDag();
    const env = await Environment.findOne({bedrift: BEDRIFT});
    const timebestillinger = await Bestiltetimer.find({dato: imorgen});
    if(env && timebestillinger){
      timebestillinger.forEach(async timebestilling => {
        let SMS_ENABLED = true;
        if(SMS_ENABLED){
            let baseUrl = "https://shared.target365.io/";
            let keyName = process.env.KEYNAME_SMS;
            let privateKey = process.env.PRIVATE_KEY;
            let serviceClient = new Client(privateKey, { baseUrl, keyName });
            let outMessage = {
                transactionId: uuidv4(),
                sender:'Target365',
                recipient:`+47${jwt.verify(timebestilling.telefonnummer, CUSTOMER_KEY).telefonnummer}`,
                content:`Hei ${jwt.verify(timebestilling.kunde, CUSTOMER_KEY).kunde}! \n\nMinner om bestilt time hos oss imorgen kl.: ${timebestilling.tidspunkt} i ${env.adresse.gatenavn} ${env.adresse.husnummer}, vi sees! \n\nDersom det har oppstått noe uforutsett, vennligst ta kontakt med oss via telefon på ${env.kontakt_tlf}! \n\nMed vennlig hilsen \n${BEDRIFT}`
            }
            await serviceClient.postOutMessage(outMessage);
        } else {
            console.log("SENDTE IKKE MELDING");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
})

//Sletter gamle timebestillinger
schedule.scheduleJob('32 23 * * *', async ()=>{
  try {
    let idag = hentDatoIDag();
    const gamleTimebestillinger = await Bestiltetimer.deleteMany({dato: idag}).exec();
    const gamle = gamleTimebestillinger;
    const oppdatert = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$inc:{antallBestillinger:gamle.deletedCount}});
    if(!oppdatert || !gamleTimebestillinger){
      mailer.sendMail(`Problem database for ${BEDRIFT}`, "Problemer med å oppdatere data for antall bestillinger i databasen");
    }
    
  } catch (error) {
    console.log(error);
    mailer.sendMail(`Problemer med node-schedule for: ${process.env.BEDRIFT}`,"Problemer med scheduleJob slette gamle timebestillinger");
  }
})
//Sletter gamle friElementer
schedule.scheduleJob('09 23 * * *', async ()=>{
  try {
    const idag = hentDatoIDag();
    const frielementene = await FriElementer.find();
    for(let i = 0; i < frielementene.length; i++){
      if(frielementene[i].lengreTid){
        if(frielementene[i].tilDato === idag){
          const slettet = await FriElementer.deleteOne({_id: frielementene[i]._id});
          if(!slettet){
            mailer.sendMail(`Problem database for ${BEDRIFT}`, "Problemer med å slette gammel friElement");
          }
        }
      } else {
        if(frielementene[i].friDag === idag){
          const slettet = await FriElementer.deleteOne({_id: frielementene[i]._id});
          if(!slettet){
            mailer.sendMail(`Problem database for ${BEDRIFT}`, "Problemer med å slette gammel friElement");
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//Sletter frisører som er sagt opp, både frisøren og brukeren til frisøren
schedule.scheduleJob('39 23 * * *', async ()=>{
  try {
    const e = await Environment.findOne({bedrift:BEDRIFT});
   if(e){
      const frisorer = e.frisorer;
      let gjenverendeFrisorer = frisorer.filter(frisor => frisor.oppsigelse !== hentDatoIDag());
      let slettedeFrisorer = frisorer.filter(frisor => frisor.oppsigelse === hentDatoIDag());
      const oppdatert = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:gjenverendeFrisorer});
      slettedeFrisorer.forEach(async frisor => {
        if(fs.existsSync(`./uploads/${frisor.brukernavn.toLowerCase()}.jpg`)){
          fs.unlinkSync(`./uploads/${frisor.brukernavn.toLowerCase()}.jpg`);
        }
        const slettet = await Brukere.deleteOne({brukernavn: frisor.navn.toLowerCase()});
        if(!slettet){
          mailer.sendMail(`Problem database for ${BEDRIFT}`, "Problemer med å slette frisør");
        }
      });
      if(!oppdatert){
        mailer.sendMail(`Problem database for ${BEDRIFT}`, "Problemer med å oppdatere data for frisører");
      }
   }
  } catch (error) {
    console.log(error);
  }
});

app.use('/timebestilling', require('./routes/timebestilling'));
app.use('/login', require('./routes/login'));
app.use('/env', require('./routes/env'));

//app.use((req, res, next) => {
//  res.status(404).send('<h1>Denne siden eksisterer ikke. Skrevet riktig?</h1>');
//});

app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type', 'application/xml');
  res.sendFile('./sitemap.xml', { root: __dirname });
});

app.get('/uploads/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
});

app.get('*', (req, res)=>{
  //res.setHeader('Cache-Control', 'no-store');
  res.setHeader(
    'Content-Security-Policy',
    "img-src 'self' data: blob:;"
  );
  res.sendFile(path.join(__dirname, 'build/index.html'));     
  
})


app.listen(process.env.SERVERPORT, () => {
  console.log(`Server listening on port ${process.env.SERVERPORT}`);
});

function hentDatoIDag(){ 
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}


function nesteDag(d = new Date()){
  let currentTime = d.getTime();

  // add 1 day worth of milliseconds (1000ms * 60s * 60m * 24h)
  let oneDay = 1000 * 60 * 60 * 24;
  let newTime = currentTime + oneDay;

  // create a new Date object using the new date in milliseconds
  let newDate = new Date(newTime);
  return hentDato(newDate);
}

function hentDato(d = new Date()){ //Hvilket format true=yyyy-mm-dd, false=["dd","mm","yyyy"]
    
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return (`${year}-${month}-${day}`);
  
}
//FOR prod

//const createEnvironment = require("./configuration/createEnvironment");
//createEnvironment.opprettEnvironment();
