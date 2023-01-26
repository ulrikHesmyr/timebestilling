const express = require("express");
const router = express.Router();
const Environment = require("../model/env");
const mailer = require("../configuration/mailer");
const {BEDRIFT} = process.env;



router.get('/env', async(req,res)=>{
    try {
        await Environment.findOne({bedrift: BEDRIFT}).select('-admin_bruker -admin_pass -antallBestillinger -vakter_bruker -vakter_pass -_id -__v').exec((err, doc)=>{
            if(err){
                console.log(err);
            } else {
                return res.send(doc);
            }
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/oppdaterEnv', async(req,res)=>{
    const {admin_pass, vakter_pass, frisorer, tjenester, kategorier, sosialeMedier, kontakt_tlf, kontakt_epost, klokkeslett} = req.body;
    try {
        const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {admin_pass:admin_pass, vakter_pass:vakter_pass, frisorer:frisorer, tjenester:tjenester, kategorier:kategorier, sosialeMedier:sosialeMedier, kontakt_tlf:kontakt_tlf, kontakt_epost:kontakt_epost, klokkeslett:klokkeslett});
        if(oppdatertEnv){
            return res.send({message:"Environment ble oppdatert!", env:oppdatertEnv});
        } else {
            return res.send({message:"Noe har skjedd gærent i /oppdaterEnv!"});
        }
    } catch (error) {
        
    }
})

module.exports = router;