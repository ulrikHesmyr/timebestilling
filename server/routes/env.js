const express = require("express");
const router = express.Router();
const Environment = require("../model/env");
const FriElementer = require("../model/fri");
const Timebestillinger = require("../model/bestilling");
const Brukere = require("../model/brukere");

const mailer = require("../configuration/mailer");
const authorization = require("../middleware/authorization");
const {BEDRIFT} = process.env;

router.get('/fri', async(req,res)=>{
    try {
        const alleFriElementer = await FriElementer.find();
        if(alleFriElementer){
            return res.json(alleFriElementer);
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/slettFri',authorization, async(req,res)=>{
    const {lengreTid, fraDato, tilDato, fraKlokkeslett, tilKlokkeslett, friDag, frisor, medarbeider} = req.body;
    if(req.brukernavn === "admin"){
        try {
            const fjernetFriElement = await FriElementer.findOneAndDelete({
                lengreTid:lengreTid,
                fraDato:fraDato,
                tilDato:tilDato,
                fraKlokkeslett:fraKlokkeslett,
                tilKlokkeslett:tilKlokkeslett,
                friDag:friDag,
                frisor:frisor,
                medarbeider:medarbeider
            })
            if(fjernetFriElement){
                console.log("Fri element er fjernet.");
                return res.send({message:"Element fjernet", friElement:fjernetFriElement});
            } else {
                return res.status(404);
            }
        } catch (error) {

        }
    }
})

router.post('/opprettFri', authorization,async(req,res)=>{
    const {lengreTid, fraDato, tilDato, fraKlokkeslett, tilKlokkeslett, friDag, frisor, medarbeider} = req.body;
    console.log(req.body);
    if(req.brukernavn === "admin"){    
        try {

            const nyttFriElement = await FriElementer.create({
                lengreTid:lengreTid,
                fraDato:fraDato,
                tilDato:tilDato,
                fraKlokkeslett:fraKlokkeslett,
                tilKlokkeslett:tilKlokkeslett,
                friDag:friDag,
                frisor:frisor,
                medarbeider:medarbeider
            })
            if(nyttFriElement){
                console.log("Fri er opprettet");
                return res.send({message:"Fri er opprettet!", friElement:nyttFriElement});
            } else {
                return res.status(404);
            }
        } catch (error) {
        
    }
    }
})

router.get('/env', async(req,res)=>{
    try {
        await Environment.findOne({bedrift: BEDRIFT}).select('-antallBestillinger -_id -__v').exec((err, doc)=>{
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

router.post('/oppdaterEnv',authorization, async(req,res)=>{
    const {frisorer, tjenester, kategorier, sosialeMedier, kontakt_tlf, kontakt_epost, klokkeslett} = req.body;
    try {
        const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:frisorer, tjenester:tjenester, kategorier:kategorier, sosialeMedier:sosialeMedier, kontakt_tlf:kontakt_tlf, kontakt_epost:kontakt_epost, klokkeslett:klokkeslett});
        
        if(oppdatertEnv){
            return res.send({message:"Environment ble oppdatert!"});
        } else {
            return res.send({message:"Noe har skjedd gærent i /oppdaterEnv!"});
        }
    } catch (error) {
        
    }
})

router.post("/oppdaterAdminPass", authorization, async (req,res)=>{
    const {admin_pass} = req.body;
    const brukernavn = req.brukernavn;
    if(brukernavn === "admin"){ 
        const AdminBrukeren = await Brukere.findOneAndUpdate({brukernavn: brukernavn}, {passord: admin_pass});
        if(AdminBrukeren){
            return res.send({message:"Passord oppdatert!"});
        }
    }
})

module.exports = router;