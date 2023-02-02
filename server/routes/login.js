const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mailer = require("../configuration/mailer");
const Bestiltetimer = require("../model/bestilling");
const Environment = require("../model/env");
const Brukere = require("../model/brukere");
const authorization = require("../middleware/authorization");
const {BEDRIFT, ACCESS_TOKEN_KEY, NODE_ENV} = process.env;

//ANSATTE ENDRE TELEFONNUMMER OG PASSORD

router.post("/oppdaterTelefonnummer", async (req,res)=>{ //Legg til authorization når nettsiden skal lanseres
    console.log(req.body);
    const {telefonnummer} = req.body;
    let bruker;
    if(NODE_ENV === "production"){
        bruker = req.brukernavn;
    } else {
        bruker = "elin";
    }
    console.log(bruker, "brukeren");
    const oppdatertBruker = await Brukere.findOneAndUpdate({brukernavn: bruker}, {telefonnummer:telefonnummer});
    if(oppdatertBruker){
        console.log("Oppdatert bruker");
        return res.send({message:"Oppdatert bruker"});
    } else {
        return res.status(404);
    }
})


//BRUKERE

router.post("/opprettBruker", authorization, async (req,res)=>{
    console.log(req.body);
    const {nyBrukernavn, nyTelefonnummer} = req.body;
    if(req.brukernavn === "admin"){
        const nyBruker = await Brukere.create({
            brukernavn: nyBrukernavn,
            passord:nyBrukernavn,
            telefonnummer: nyTelefonnummer
        });

        if(nyBruker){
            console.log("opprettet ny bruker");
            return res.send({message:"Ny bruker opprettet"});
        } else {
            return res.status(404);
        }
    }
})


router.post("/slettBruker", authorization, async (req,res)=>{
    console.log(req.body);
    //Sletter bruker fra databasen
    const {slettBrukernavn} = req.body;
    if(req.brukernavn === "admin"){
        const slettetBruker = await Brukere.findOneAndDelete({brukernavn:slettBrukernavn});
        if(slettetBruker){
            console.log("slettet brukeren");
            return res.send({message:"Slettet brukeren"});
        } else {
            return res.status(404);
        }
    }
})

//LOGG INN, LOGG UT og ALLEREDE LOGGET INN
router.get("/loggetinn",authorization, async (req,res)=>{
    console.log("brukernavn i /loggetinn", req.brukernavn);
    try {
        const brukernavn = req.brukernavn;
        //Find the user in the database
        const finnBruker = await Brukere.findOne({brukernavn: brukernavn});
        const env = await Environment.findOne({bedrift:BEDRIFT});
        const {kontakt_epost, kontakt_tlf, sosialeMedier, bedrift, kategorier, tjenester, frisorer, klokkeslett} = env;
        
        let bestilteTimer = await Bestiltetimer.find();
        bestilteTimer = bestilteTimer.sort((a,b)=>{
            let datoA = new Date(a.dato + " " + a.tidspunkt);
            let datoB = new Date(b.dato + " " + b.tidspunkt);
            return datoA - datoB;
        })
            
        return res.json({bruker:{navn:finnBruker.brukernavn, telefonnummer:finnBruker.telefonnummer}, valid:true, message:"Du er nå logget inn", brukertype: (brukernavn==="admin"?"admin":"vakter"), env:{kontakt_epost:kontakt_epost, kontakt_tlf:kontakt_tlf, sosialeMedier:sosialeMedier, bedrift:bedrift, kategorier:kategorier, tjenester:tjenester, frisorer:frisorer, klokkeslett:klokkeslett}, bestilteTimer:bestilteTimer});
        
    } catch (error) {
        console.log(error);
    }
})

router.post('/auth', async (req,res)=>{

    try {
        const {brukernavn, passord}= req.body;
        console.log(brukernavn, passord);
        const finnBruker = await Brukere.findOne({brukernavn: brukernavn});
        if(finnBruker && finnBruker.passord === passord){
            
            const env = await Environment.findOne({bedrift:BEDRIFT});
            const {kontakt_epost, kontakt_tlf, sosialeMedier, bedrift, kategorier, tjenester, frisorer, klokkeslett} = env;
            
            let bestilteTimer = await Bestiltetimer.find();
            bestilteTimer = bestilteTimer.sort((a,b)=>{
                let datoA = new Date(a.dato + " " + a.tidspunkt);
                let datoB = new Date(b.dato + " " + b.tidspunkt);
                return datoA - datoB;
            })

            //Setter access token i cookies
            const accessToken = jwt.sign({brukernavn:brukernavn, passord:passord},ACCESS_TOKEN_KEY,{expiresIn:'480m'});
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
            })

            return res.json({valid:true,bruker:{navn:finnBruker.brukernavn, telefonnummer:finnBruker.telefonnummer}, message:"Du er nå logget inn", brukertype: (brukernavn==="admin"?"admin":"vakter"), env:{kontakt_epost:kontakt_epost, kontakt_tlf:kontakt_tlf, sosialeMedier:sosialeMedier, bedrift:bedrift, kategorier:kategorier, tjenester:tjenester, frisorer:frisorer, klokkeslett:klokkeslett}, bestilteTimer:bestilteTimer});
            
        } else {
            return res.json({valid:false, message:"Feil passord eller brukernavn"});

        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("access_token");
    return res.json({ message: "Du er nå logget ut" });
});



module.exports = router;