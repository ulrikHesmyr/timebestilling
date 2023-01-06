const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mailer = require("../configuration/mailer");
const {BEDRIFT, ACCESS_TOKEN_KEY} = process.env;
const Bestiltetimer = require("../model/bestilling");
const Environment = require("../model/env");

router.post('/auth', async (req,res)=>{
    try {
        const {brukernavn, passord} = req.body;
        const env = await Environment.findOne({bedrift:BEDRIFT});

        if(brukernavn === env.vakter_bruker && passord === env.vakter_pass || brukernavn === env.admin_bruker && passord === env.admin_pass){
        //console.log(jwt.verify(token, ACCESS_TOKEN_KEY));
        //console.log(req.cookies());
        const bestilteTimer = await Bestiltetimer.find();
        return res.json({valid:true, message:"Du er nå logget inn", brukertype: brukernavn, env:env});

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