const express = require("express");
const router = express.Router();
const Environment = require("../model/env");
const FriElementer = require("../model/fri");
const Brukere = require("../model/brukere");
const multer = require('multer');
const sharp = require("sharp");
const rateLimiter = require("express-rate-limit");

const authorization = require("../middleware/authorization");
const {BEDRIFT} = process.env;

const hentEnvLimiter = rateLimiter({
    max:45,
    windowMs:30*60*1000,
    message:"MAX 45 requests"
})

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

router.post('/slettFri', authorization, async(req,res)=>{
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
                return res.send({message:"Element fjernet", friElement:fjernetFriElement});
            } else {
                return res.status(404);
            }
        } catch (error) {

        }
    }
})
router.post('/oppdaterAdresse', authorization, async(req,res)=>{
    const {adresse} = req.body;
    if(req.brukernavn === "admin"){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {adresse:adresse});
            if(oppdatertEnv){
                return res.send({message:"Adresse oppdatert", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
});


router.post('/opprettFri', authorization,async(req,res)=>{
    const {lengreTid, fraDato, tilDato, fraKlokkeslett, tilKlokkeslett, friDag, frisor, medarbeider} = req.body;
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
                return res.send({message:"Fri er opprettet!", friElement:nyttFriElement});
            } else {
                return res.status(404);
            }
        } catch (error) {
        
    }
    }
})

router.get('/env', hentEnvLimiter, async(req,res)=>{

    try {
        await Environment.findOne({bedrift: BEDRIFT}).select('-antallBestillinger -_id -__v').exec((err, doc)=>{
            if(err){
                console.log(err);
            } else {
                return res.json(doc);
            }
        })
    } catch (error) {
        console.log(error);
    }
})

const storage = multer.memoryStorage();

//Multer instance for bilde når man oppretter ny frisør
const upload = multer({
    storage: storage,
    dest: 'uploads/',
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
});

//Multer instance for å oppdatere bilde av frisør
const oppdaterBildeFrisor = multer({
    storage: storage,
    dest: 'uploads/',
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
});

router.post("/oppdaterBildeFrisor", authorization, oppdaterBildeFrisor.single("uploaded_file"), async (req,res)=>{
    const {navn} = req.body;
    try {
        if(req.brukernavn === "admin"){
            //Konverterer bilde fra request til buffer, og reduserer størrelsen til 200x200px
            sharp(req.file.buffer).resize({height: 200, width: 200, fit:'inside'}).toBuffer().then(async (data)=>{
            const img = {
                data: new Buffer.from(data),
                contentType: req.file.mimetype
            };

            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let nyFrisorer = env.frisorer.map(frisor => {
                    if(frisor.navn === navn){
                        frisor.img = img;
                    }
                    return frisor;
                })
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:nyFrisorer});
                if(oppdatertEnv){
                    return res.send({valid:true});
                } else {
                    return res.send({valid:false});
                }
            }
        })
        }
    } catch (error) {
        console.log(error, "error i oppdaterBildeFrisor");
    }
});
  

router.post("/opprettFrisor", upload.single("uploaded_file"), authorization, async (req,res)=>{ 
   
    const {nyFrisorNavn, nyFrisorTjenester} = req.body;
    let nyFrisorTjenesterArray = nyFrisorTjenester.split(",");
    try {
        if(req.brukernavn === "admin"){
            sharp(req.file.buffer).resize({height: 200, width: 200, fit:'inside'}).toBuffer().then(async (data)=>{
            const img = {
                data: new Buffer.from(data),
                contentType: req.file.mimetype
            };
            
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let tempFrisorer = env.frisorer;
                tempFrisorer.push({navn:nyFrisorNavn, produkter:nyFrisorTjenesterArray, img:img});
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:tempFrisorer});
                if(oppdatertEnv){
                    return res.send({message:"Frisør opprettet!"});
                } else {
                    return res.send({message:"Noe har skjedd gærent i /opprettFrisor!"});
                }
            }
        })
        }
    } catch (error) {
        console.log(error, "error i opprettFrisor");
    }
})


router.post("/slettFrisor", authorization, async (req,res)=>{
    const {navn} = req.body;
    try {
        if(req.brukernavn === "admin"){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let tempFrisorer = env.frisorer;
                let nyFrisorer = tempFrisorer.filter(frisor => frisor.navn !== navn);
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:nyFrisorer});
                if(oppdatertEnv){
                    return res.send({message:"Frisør slettet!"});
                } else {
                    return res.send({message:"Noe har skjedd gærent i /slettFrisor!"});
                }
            }
        }
    } catch (error) {
        console.log(error, "error i slettFrisor");
    }
})

router.post('/oppdaterEnv',authorization, async(req,res)=>{
    const {frisorer, tjenester, kategorier, sosialeMedier, kontakt_tlf, kontakt_epost, klokkeslett} = req.body;
    try {
        if(req.brukernavn === "admin"){
            
        const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:frisorer, tjenester:tjenester, kategorier:kategorier, sosialeMedier:sosialeMedier, kontakt_tlf:kontakt_tlf, kontakt_epost:kontakt_epost, klokkeslett:klokkeslett});
        
            if(oppdatertEnv){
                return res.send({message:"Environment ble oppdatert!"});
            } else {
                return res.send({message:"Noe har skjedd gærent i /oppdaterEnv!"});
            }
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