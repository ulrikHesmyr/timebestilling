const express = require("express");
const router = express.Router();
const Environment = require("../model/env");
const FriElementer = require("../model/fri");
const Timebestillinger = require("../model/bestilling");
const Brukere = require("../model/brukere");
const multer = require('multer');

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


//const storage = multer.diskStorage({
//    destination: function(req, file, cb){
//      cb(null, 'uploads');
//    },
//    filename: function(req, file, cb){
//      cb(null, file.originalname);//file.fieldname byttes med req.body.navn?
//    }
//});

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    dest: 'uploads/',
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });
  

router.post("/opprettFrisor", upload.single("uploaded_file"),authorization, async (req,res)=>{ 
   
    const {nyFrisorNavn, nyFrisorTjenester} = req.body;
    let nyFrisorTjenesterArray = nyFrisorTjenester.split(",");
    try {
        if(req.brukernavn === "admin"){
            const img = {
                data: new Buffer.from(req.file.buffer),
                contentType: req.file.mimetype
            };
            
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let tempFrisorer = env.frisorer;
                tempFrisorer.push({navn:nyFrisorNavn, produkter:nyFrisorTjenesterArray, img:img});

                //console.log(tempFrisorer, "tempfrisorer");
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:tempFrisorer});
                if(oppdatertEnv){
                    console.log(img, "image");
                    return res.send({message:"Frisør opprettet!"});
                } else {
                    return res.send({message:"Noe har skjedd gærent i /opprettFrisor!"});
                }
            }
        }
    } catch (error) {
        console.log(error, "error i opprettFrisor");
    }
})

router.post('/oppdaterEnv',authorization, async(req,res)=>{
    const {frisorer, tjenester, kategorier, sosialeMedier, kontakt_tlf, kontakt_epost, klokkeslett} = req.body;
    try {
        const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {tjenester:tjenester, kategorier:kategorier, sosialeMedier:sosialeMedier, kontakt_tlf:kontakt_tlf, kontakt_epost:kontakt_epost, klokkeslett:klokkeslett});
        
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
        const accessToken = jwt.sign({brukernavn:brukernavn, passord:admin_pass},ACCESS_TOKEN_KEY,{expiresIn:'480m'});
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
        })
    }
})

module.exports = router;