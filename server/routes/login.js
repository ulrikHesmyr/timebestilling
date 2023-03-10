const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const rateLimiter = require("express-rate-limit");
const { v4: uuidv4 } = require('uuid');
const Client = require("target365-sdk");

const mailer = require("../configuration/mailer");
const Bestiltetimer = require("../model/bestilling");
const Environment = require("../model/env");
const Brukere = require("../model/brukere");
const authorization = require("../middleware/authorization");
const {BEDRIFT, ACCESS_TOKEN_KEY, NODE_ENV, TWOFA_SECRET, KEYNAME_SMS, PRIVATE_KEY} = process.env;


let loginIntervall = 15 * 60 * 1000;  
if(NODE_ENV === "development") loginIntervall = 60 * 1000;

const loginLimiter = rateLimiter({
    windowMs: loginIntervall,
    max: 5,
    message: {m:"Du har brukt opp alle forsøkene dine på å logge inn. Vennligst vent 15 minutter før du prøver igjen"},
    requestPropertyName:"antForsok"
});
  

//ANSATTE ENDRE TELEFONNUMMER OG PASSORD

    //Oppdatere passord til de ansatte

router.post("/oppdaterPassord", authorization, async(req,res)=>{
    const {passord} = req.body;
    let bruker;
    if(NODE_ENV === "production"){
        bruker = req.brukernavn;
    } else {
        bruker = "ludvik";
    }
    const oppdatertPassord = await Brukere.findOneAndUpdate({brukernavn:bruker}, {passord:passord});
    if(oppdatertPassord){
        return res.send({message:"Oppdatert passord"});
    } else {
        return res.status(404);
    }

})

router.post("/resetPassord", authorization, async(req,res)=>{
    //Resetter passordet til en ansatt
    const {navn} = req.body;
    if(req.admin){
        const bruker = await Brukere.findOneAndUpdate({brukernavn:navn}, {passord:navn});

        if(bruker){
            return res.json({message:"Reset passord", valid:true});
        } else {
            return res.status(404);
        }
    }
})

router.post("/oppdaterTelefonnummer", authorization, async (req,res)=>{ //Legg til authorization når nettsiden skal lanseres
    const {telefonnummer} = req.body;
    let bruker;
    if(NODE_ENV === "production"){
        bruker = req.brukernavn;
    } else {
        bruker = "ulrik";
    }
    const oppdatertBruker = await Brukere.findOneAndUpdate({brukernavn: bruker}, {telefonnummer:telefonnummer});
    if(oppdatertBruker){
        return res.send({message:"Oppdatert bruker"});
    } else {
        return res.status(404);
    }
})


//BRUKERE

router.post("/opprettBruker", authorization, async (req,res)=>{
    const {nyBrukernavn, nyTelefonnummer, adminTilgang} = req.body;
    if(req.admin){
        const nyBruker = await Brukere.create({
            brukernavn: nyBrukernavn,
            passord:nyBrukernavn,
            telefonnummer: nyTelefonnummer,
            admin: adminTilgang
        });

        if(nyBruker){
            return res.send({message:"Ny bruker opprettet"});
        } else {
            return res.status(404);
        }
    }
})


router.post("/slettBruker", authorization, async (req,res)=>{
    //Sletter bruker fra databasen
    const {slettBrukernavn} = req.body;
    if(req.admin){
        const slettetBruker = await Brukere.findOneAndDelete({brukernavn:slettBrukernavn});
        if(slettetBruker){
            return res.send({message:"Slettet brukeren"});
        } else {
            return res.status(404);
        }
    }
})

//LOGG INN, LOGG UT og ALLEREDE LOGGET INN


router.get("/loggetinn", authorization, async (req,res)=>{
    try {
        const brukernavn = req.brukernavn;
        //Find the user in the database     //NB DENNE ER IKKE I BRUK
        
        const finnBruker = await Brukere.findOne({brukernavn: brukernavn});
        const env = await Environment.findOne({bedrift:BEDRIFT});
        const {kontakt_epost, kontakt_tlf, sosialeMedier, bedrift, kategorier, tjenester, frisorer, klokkeslett, adresse, omOssArtikkel, googleReviewLink} = env;
        
        let bestilteTimer = await Bestiltetimer.find();
        bestilteTimer = bestilteTimer.sort((a,b)=>{
            let datoA = new Date(a.dato + " " + a.tidspunkt);
            let datoB = new Date(b.dato + " " + b.tidspunkt);
            return datoA - datoB;
        })
            
        return res.json({valid:true,bruker:{navn:finnBruker.brukernavn, telefonnummer:finnBruker.telefonnummer}, message:"Du er nå logget inn", brukertype: (req.brukertype==="admin"?"admin":"vakter"), env:{kontakt_epost:kontakt_epost, kontakt_tlf:kontakt_tlf, sosialeMedier:sosialeMedier, bedrift:bedrift, kategorier:kategorier, tjenester:tjenester, frisorer:frisorer, klokkeslett:klokkeslett, adresse: adresse, omOssArtikkel: omOssArtikkel, googleReviewLink: googleReviewLink}, bestilteTimer:bestilteTimer});
        
    } catch (error) {
        console.log(error);
    }
})

const twofaLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {m:"Du har brukt opp alle forsøkene dine på å logge inn. Vennligst vent 15 minutter før du prøver igjen"},
    requestPropertyName:"antForsok"
});


router.post("/TWOFA", twofaLimiter, async (req,res)=>{
    //Tar høyde for at brukeren allerede har fått SMS med PIN og har dermed også cookie med kryptert PIN
    const {pin, brukertype} = req.body;
    const two_FA = jwt.verify(req.cookies.two_FA, TWOFA_SECRET);
    if(two_FA.pin === parseInt(pin)){
        //Setter cookie slik at brukeren ikke trenger å autorisere med 2FA neste gang
        const newToken = jwt.sign({brukernavn:two_FA.brukernavn, gyldig:true},ACCESS_TOKEN_KEY);
        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 * 26); //26 uker
        
        res.cookie("two_FA_valid", newToken, {
            httpOnly: true,
            secure: process.env.HTTPS_ENABLED == "secure",
            expires: expirationDate
        })
        
        const finnBruker = await Brukere.findOne({brukernavn: two_FA.brukernavn});
        const env = await Environment.findOne({bedrift:BEDRIFT});
        const {kontakt_epost, kontakt_tlf, sosialeMedier, bedrift, kategorier, tjenester, frisorer, klokkeslett, adresse, omOssArtikkel, googleReviewLink} = env;
        
        let bestilteTimer = await Bestiltetimer.find();
        bestilteTimer = bestilteTimer.sort((a,b)=>{
            let datoA = new Date(a.dato + " " + a.tidspunkt);
            let datoB = new Date(b.dato + " " + b.tidspunkt);
            return datoA - datoB;
        })
        const accessToken = jwt.sign({brukernavn:two_FA.brukernavn, passord:finnBruker.passord, brukertype:brukertype}, ACCESS_TOKEN_KEY, {expiresIn:'480m'});

        //Setter cookie for å holde brukeren logget inn
        
        const expirationDateAccess = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 døgn
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.HTTPS_ENABLED == "secure",
            expires: expirationDateAccess
        })
        res.clearCookie("two_FA");
            
        return res.json({valid:true,bruker:{navn:finnBruker.brukernavn, telefonnummer:finnBruker.telefonnummer}, message:"Du er nå logget inn", brukertype: (brukertype==="admin"?"admin":"vakter"), env:{kontakt_epost:kontakt_epost, kontakt_tlf:kontakt_tlf, sosialeMedier:sosialeMedier, bedrift:bedrift, kategorier:kategorier, tjenester:tjenester, frisorer:frisorer, klokkeslett:klokkeslett, adresse: adresse, omOssArtikkel: omOssArtikkel, googleReviewLink: googleReviewLink}, bestilteTimer:bestilteTimer});
        

    } else {
        return res.status(401).json({message:"Feil PIN"});
    }
})

router.post('/auth',loginLimiter, async (req,res)=>{

    try {
        const {brukernavn, passord, valgtBrukertype, brukertype}= req.body;
        const finnBruker = await Brukere.findOne({brukernavn: brukernavn});
        

        if(finnBruker && finnBruker.passord === passord){

            if(finnBruker.admin){

                if(!valgtBrukertype){
                    return res.json({velgBrukertype:true});
                }
                
                const allerede2FA = req.cookies.two_FA_valid;
                if(allerede2FA || NODE_ENV === "development"){
                    if(NODE_ENV === "production"){
                        const two_FA_valid = jwt.verify(allerede2FA, ACCESS_TOKEN_KEY);
                        if(!two_FA_valid.gyldig){
                            res.clearCookie("two_FA_valid");
                            return res.status(401).json({message:"Du har ikke gyldig 2FA token"});
                        }
                    }
                } else {
                    
                    //Dersom brukeren ikke har autorisert med 2FA i denne nettleseren enda
                    const randomGeneratedPIN = randomNumber(2000, 9999);
                    const newToken = jwt.sign({brukernavn: finnBruker.brukernavn, pin: randomGeneratedPIN},TWOFA_SECRET,{expiresIn:'20m'});
                    res.cookie("two_FA", newToken, {
                        httpOnly: true,
                        secure: process.env.HTTPS_ENABLED == "secure",
                    })
                    //Send SMS med pin
                    let baseUrl = "https://shared.target365.io/";
                    let keyName = KEYNAME_SMS;
                    let privateKey = PRIVATE_KEY;
                    let serviceClient = new Client(privateKey, { baseUrl, keyName });
                    let outMessage = {
                        transactionId: uuidv4(),
                        sender:'Target365',
                        recipient:`+47${finnBruker.telefonnummer}`,
                        content:`Din PIN er ${randomGeneratedPIN}`
                    }
                    await serviceClient.postOutMessage(outMessage);
                    return res.send({message:"Du må logge inn med 2FA", valid:false, two_FA:true});
                }
            }
                
                const env = await Environment.findOne({bedrift:BEDRIFT});
                const {kontakt_epost, kontakt_tlf, sosialeMedier, bedrift, kategorier, tjenester, frisorer, klokkeslett, adresse, omOssArtikkel, googleReviewLink} = env;
                let bestilteTimer = await Bestiltetimer.find();
                bestilteTimer = bestilteTimer.sort((a,b)=>{
                    let datoA = new Date(a.dato + " " + a.tidspunkt);
                    let datoB = new Date(b.dato + " " + b.tidspunkt);
                    return datoA - datoB;
                })

                //Setter access token i cookies
                const accessToken = jwt.sign({brukernavn:brukernavn, passord:passord, brukertype: brukertype},ACCESS_TOKEN_KEY,{expiresIn:'480m'});
                res.cookie("access_token", accessToken, {
                    httpOnly: true,
                    secure: process.env.HTTPS_ENABLED == "secure",
                })
                return res.json({valid:true,bruker:{navn:finnBruker.brukernavn, telefonnummer:finnBruker.telefonnummer}, message:"Du er nå logget inn", brukertype: (brukertype==="admin"?"admin":"vakter"), env:{kontakt_epost:kontakt_epost, kontakt_tlf:kontakt_tlf, sosialeMedier:sosialeMedier, bedrift:bedrift, kategorier:kategorier, tjenester:tjenester, frisorer:frisorer, klokkeslett:klokkeslett, adresse: adresse, omOssArtikkel: omOssArtikkel, googleReviewLink: googleReviewLink}, bestilteTimer:bestilteTimer});
            
        } else {

            return res.json({valid:false, message:`Feil passord, du har ${req.antForsok.remaining} forsøk igjen!`});

        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("access_token");
    return res.json({ message: "Du er nå logget ut" });
});


function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}


module.exports = router;