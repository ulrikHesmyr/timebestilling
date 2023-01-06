const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const mailer = require("../configuration/mailer");
const {VAKTER_BRUKER, ADMIN_BRUKER, ADMIN_PASS, VAKTER_PASS, ACCESS_TOKEN_KEY} = process.env;

router.post('/auth', async (req,res)=>{
    const {brukernavn, passord} = req.body;
    if(brukernavn === VAKTER_BRUKER && passord === VAKTER_PASS || brukernavn === ADMIN_BRUKER && passord === ADMIN_PASS){
        const accessToken = jwt.sign({brukernavn: brukernavn, passord: passord}, ACCESS_TOKEN_KEY);
        //console.log(jwt.verify(token, ACCESS_TOKEN_KEY));
        //console.log(req.cookies());
        
        return res.json({valid:true, message:"Du er nå logget inn", brukertype: brukernavn, cookie: {accessToken:accessToken, name:"access_token"} });
    } else {
        return res.json({valid:false, message:"Feil passord eller brukernavn"});
    }
        
    

})

router.get("/logout", (req, res) => {
    res.clearCookie("access_token");
    return res.json({ message: "Du er nå logget ut" });
  });


module.exports = router;