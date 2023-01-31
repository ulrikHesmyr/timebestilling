const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mailer = require("../configuration/mailer");
const Bestiltetimer = require("../model/bestilling");
const Environment = require("../model/env");
const authorization = require("../middleware/authorization");
const {BEDRIFT, ACCESS_TOKEN_KEY} = process.env;

router.get("/loggetinn", authorization, async (req,res)=>{
    const brukernavn = req.brukernavn;
    const passord = req.passord;
    try {
        const env = await Environment.findOne({bedrift:BEDRIFT});
        const {kontakt_epost, kontakt_tlf, sosialeMedier, admin_bruker, admin_pass, vakter_bruker, vakter_pass, bedrift, kategorier, tjenester, frisorer, klokkeslett} = env;
        if((brukernavn === vakter_bruker && passord === vakter_pass) || (brukernavn === admin_bruker && passord === admin_pass)){
            let bestilteTimer = await Bestiltetimer.find();
            bestilteTimer = bestilteTimer.sort((a,b)=>{
                let datoA = new Date(a.dato + " " + a.tidspunkt);
                let datoB = new Date(b.dato + " " + b.tidspunkt);
                return datoA - datoB;
                })
            return res.json({valid:true, message:"Du er nå logget inn", brukertype: brukernavn, env:{kontakt_epost:kontakt_epost, kontakt_tlf:kontakt_tlf, sosialeMedier:sosialeMedier, bedrift:bedrift, kategorier:kategorier, tjenester:tjenester, frisorer:frisorer, klokkeslett:klokkeslett}, bestilteTimer:bestilteTimer});
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/auth', async (req,res)=>{
    try {
        const {brukernavn, passord} = req.body;
        const env = await Environment.findOne({bedrift:BEDRIFT});
        const {kontakt_epost, kontakt_tlf, sosialeMedier, admin_bruker, admin_pass, vakter_bruker, vakter_pass, bedrift, kategorier, tjenester, frisorer, klokkeslett} = env;
        if((brukernavn === vakter_bruker && passord === vakter_pass) || (brukernavn === admin_bruker && passord === admin_pass)){
            const accessToken = jwt.sign({brukernavn:brukernavn, passord:passord},ACCESS_TOKEN_KEY,{expiresIn:'480m'});
            let bestilteTimer = await Bestiltetimer.find();
            bestilteTimer = bestilteTimer.sort((a,b)=>{
                let datoA = new Date(a.dato + " " + a.tidspunkt);
                let datoB = new Date(b.dato + " " + b.tidspunkt);
                return datoA - datoB;
                })
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
            })

            return res.json({valid:true, message:"Du er nå logget inn", brukertype: brukernavn, env:{kontakt_epost:kontakt_epost, kontakt_tlf:kontakt_tlf, sosialeMedier:sosialeMedier, bedrift:bedrift, kategorier:kategorier, tjenester:tjenester, frisorer:frisorer, klokkeslett:klokkeslett}, bestilteTimer:bestilteTimer});

        } else {
        return res.json({valid:false, message:"Feil passord eller brukernavn"});
        }
    } catch (error) {
        console.log(error);
        mailer.sendMail(`Problem med database for: ${BEDRIFT}`, "Får ikke hentet bestiltetimer og environment på login route");
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("access_token");
    return res.json({ message: "Du er nå logget ut" });
});



module.exports = router;