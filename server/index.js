require("dotenv").config();
require("./configuration/database").connect();
const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors");
const schedule = require("node-schedule");
const mailer = require("./configuration/mailer");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { v4: uuidv4 } = require('uuid');
const Client = require("target365-sdk");
//heihei

const Bestiltetimer = require("./model/bestilling");
const Environment = require("./model/env");
const FriElementer = require("./model/fri");
const Brukere = require("./model/brukere");
const {BEDRIFT} = process.env;

app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(express.static('build'));

schedule.scheduleJob('30 19 * * *', async ()=>{
  try {
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
              recipient:`+47${timebestilling.telefonnummer}`,
              content:`Hei ${timebestilling.kunde}! Vi håper du er fornøyd med ditt besøk hos oss.\n\n Dersom det er ønskelig, så legg gjerne igjen en tilbakemelding på besøket. Du kan gi oss en tilbakemelding ved å trykke på linken under. \n\n ${process.env.GOOGLE_REVIEW_LINK} \n\n Med vennlig hilsen \n ${BEDRIFT}`
          }
          await serviceClient.postOutMessage(outMessage);
      } else {
          console.log("SENDTE IKKE MELDING");
      }
    });
  } catch (error) {
    console.log(error);
  }
})
//Sletter gamle timebestillinger
schedule.scheduleJob('30 23 * * *', async ()=>{
  try {
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
schedule.scheduleJob('05 23 * * *', async ()=>{
  try {
    const e = await Environment.findOne({bedrift:BEDRIFT});
   if(e){
      const frisorer = e.frisorer;
      let gjenverendeFrisorer = frisorer.filter(frisor => frisor.oppsigelse !== hentDatoIDag());
      let slettedeFrisorer = frisorer.filter(frisor => frisor.oppsigelse === hentDatoIDag());
      const oppdatert = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:gjenverendeFrisorer});
      slettedeFrisorer.forEach(async frisor => {
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

app.use((req, res, next) => {
  res.status(404).send('<h1>Denne siden eksisterer ikke. Skrevet riktig?</h1>');
});

app.get('*', (req, res)=>{
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
//FOR prod

//const createEnvironment = require("./configuration/createEnvironment");
//createEnvironment.opprettEnvironment();
