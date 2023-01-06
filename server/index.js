const express = require('express');
const app = express();
const cors = require("cors");
const schedule = require("node-schedule");
const mailer = require("./configuration/mailer");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./configuration/database").connect();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const Bestiltetimer = require("./model/bestilling");

schedule.scheduleJob('0 22 * * *', async ()=>{
  try {
    const idag = hentDatoIDag();
    //const gamleTimebestillinger = await Bestiltetimer.deleteMany({dato: idag});
    //console.log(gamleTimebestillinger);
    const gamleTimebestillinger = await Bestiltetimer.deleteMany({dato: idag}).exec();
    console.log(gamleTimebestillinger);
    
  } catch (error) {
    console.log(error);
    mailer.sendMail(`Problemer med node-schedule for: ${process.env.BEDRIFT}`,"Problemer med scheduleJob slette gamle timebestillinger");
  }
})
app.get("/serviceWorker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "serviceWorker.js"));
});

app.use('/timebestilling', require('./routes/timebestilling'));
app.use('/login', require('./routes/login'));
app.use('/env', require('./routes/env'));

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
