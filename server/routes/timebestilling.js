const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Client = require("target365-sdk");
const rateLimiter = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const mailer = require("../configuration/mailer");
const authorization = require("../middleware/authorization");

const Bestilttime = require("../model/bestilling");
const Brukere = require("../model/brukere");
const Env = require("../model/env");
const FriTimene = require("../model/fri");

const {NODE_ENV, SMSPIN_SECRET, ACCESS_TOKEN_KEY, SMSPINVALID_SECRET, CUSTOMER_KEY} = process.env;

let intervall = 30 * 60 * 1000; // 30 min
if(NODE_ENV === "development") intervall = 2* 60 * 1000; // 2 minutter

let bestillingsLimit = 3;
if(NODE_ENV === "development") bestillingsLimit = 1;
const bestillingLimiter = rateLimiter({
    windowMs: intervall,
    max: bestillingsLimit,
    message: {m:"Du har bestilt for mange ganger, vent 30 min før du bestiller igjen! \n\nKontakt oss på telefon dersom du må bestille time med en gang."}
});

const hentBestillingerLimiter = rateLimiter({
    windowMs:60*60*1000,
    max:60,
    message:"BAD REQUEST"
})


//For å la ansatte bestille så mye de ønsker
function ansattSjekker(req,res,next){
    const ansattBestilling = req.cookies.access_token; 
    const ansattBestilling2 = req.cookies.two_FA_valid; 
    let ansatt = false;
    if(ansattBestilling){
        ansatt = jwt.verify(ansattBestilling, ACCESS_TOKEN_KEY);
    } 
    
    if (ansattBestilling2){
        ansatt = jwt.verify(ansattBestilling2, ACCESS_TOKEN_KEY);
    }

    if(NODE_ENV === "development"){
        next()
    } else {
        
        if(!ansatt){
            bestillingLimiter(req,res,next);
        } else {
            next();
        }
    }  
    
}

router.post('/bestilltime', ansattSjekker, async (req,res)=>{
    try {
        const env = await Env.findOne();
        const {dato, behandlinger, kunde, medarbeider, telefonnummer, tidspunkt, SMS_ENABLED} = req.body; 
        if(!(dato && behandlinger && kunde && medarbeider && telefonnummer && tidspunkt)){
            return res.status(400).json({m:"Mangler informasjon"});
        }
        if(telefonnummer.length !== 8){
            return res.status(400).json({m:"Telefonnummeret må være 8 siffer"});
        }
        if(behandlinger.length < 1){
            return res.status(400).json({m:"Du må velge minst en behandling"});
        }
        if(kunde.length < 1){
            return res.status(400).json({m:"Du må skrive inn navnet ditt"});
        }
        const t = await Bestilttime.findOne({dato: dato, medarbeider: medarbeider, tidspunkt:tidspunkt});
        
        let finnesIkkeKollisjon = true; 
        let totalTid = env.tjenester.filter(tjeneste=> behandlinger.includes(tjeneste.navn)).reduce((total, tjeneste)=>total + tjeneste.tid, 0);
        let tidspunktTid = minutterFraKlokkeslett(tidspunkt);

        for(let i = tidspunktTid; i < (tidspunktTid + totalTid);i+=15){
            let f = await Bestilttime.findOne({dato: dato, medarbeider: medarbeider, tidspunkt:klokkeslettFraMinutter(i)});
            if(f) finnesIkkeKollisjon = false;
        }

        //Sjekker om timen kræsjer med reserverte timer
        
        const bestilteTimer = await Bestilttime.find({medarbeider: medarbeider, dato: dato});
        
        bestilteTimer.forEach(bestilt => {
            let tidReservert = env.tjenester.filter(tjeneste=> bestilt.behandlinger.includes(tjeneste.navn)).reduce((total, tjeneste)=>total + tjeneste.tid, 0);
            

            if(tidspunktTid >= minutterFraKlokkeslett(bestilt.tidspunkt) && tidspunktTid < minutterFraKlokkeslett(bestilt.tidspunkt) + tidReservert){
                finnesIkkeKollisjon = false;
            }
        });
        const fritimene = await FriTimene.find({medarbeider: medarbeider});
        if(fritimene){
            fritimene.forEach(fri => {
                if(fri.lengreTid){
                    let fraDato = new Date(fri.fraDato);
                    let tilDato = new Date(fri.tilDato);
                    let bestillingDato = new Date(dato);    
                    if(bestillingDato >= fraDato && bestillingDato <= tilDato){
                        finnesIkkeKollisjon = false;
                    }
                } else {
                    let friDag = fri.friDag;
                    if(dato === friDag){
                        for(let i = minutterFraKlokkeslett(fri.fraKlokkeslett); i < minutterFraKlokkeslett(fri.tilKlokkeslett);i+=15){
                            if(i === tidspunktTid){
                                finnesIkkeKollisjon = false;
                            }
                        }
                    }
                }
            });
        }

        //Går igjennom sjekker om timereservasjonen er legitim
        let gyldigFormat = true;
        let naa = new Date(new Date().setHours(new Date().getHours() + 2));
        let bestillingsTid = new Date(new Date(dato + " " + tidspunkt + ":00").setHours(new Date(dato + " " + tidspunkt + ":00").getHours() + 2));
        
        //Sjekker om dato er i riktig format
        if(bestillingsTid.getFullYear() > (naa.getFullYear() + 2)){
            gyldigFormat = false;
        }
        //Sjekker om dato ikke er i fortiden
        if(bestillingsTid < naa){
            gyldigFormat = false;
        }

        //Sjekker om tidspunkt er innenfor åpningstidene til den ansatte og ikke kræsjer med pauser
        env.frisorer.forEach(frisor => {
            if(frisor.navn === medarbeider){
                
                //Sjekker med åpningstidene
                let open = frisor.paaJobb[new Date(dato).getDay()].open;
                let closed = frisor.paaJobb[new Date(dato).getDay()].closed;
                if(tidspunktTid < minutterFraKlokkeslett(open) || (tidspunktTid + totalTid) > minutterFraKlokkeslett(closed)){
                    gyldigFormat = false;
                }

                //Sjekker med pauser
                frisor.paaJobb[new Date(dato).getDay()].pauser.forEach(pause => {
                    if(tidspunktTid + totalTid > minutterFraKlokkeslett(pause) && tidspunktTid < minutterFraKlokkeslett(pause) + 15){
                        gyldigFormat = false;
                    }
                });
            }

        });

        //Sjekker om tidspunkt er innenfor frisørens åpningstid
        if(!t && finnesIkkeKollisjon && gyldigFormat){

            let kundensTelefonnummer = telefonnummer;
            if(NODE_ENV === "production"){
                
                const ansattBestilling = req.cookies.access_token; 
                const ansattBestilling2 = req.cookies.two_FA_valid; 
                let ansatt = false;
                if(ansattBestilling){
                    ansatt = jwt.verify(ansattBestilling, ACCESS_TOKEN_KEY);
                } else if (ansattBestilling2){
                    ansatt = jwt.verify(ansattBestilling2, ACCESS_TOKEN_KEY);
                }

                if(env.aktivertSMSpin && !ansatt){
                    const dataFromSMSCookie = jwt.verify(req.cookies.tlfvalid, SMSPINVALID_SECRET);
                    if(dataFromSMSCookie){
                        kundensTelefonnummer = parseInt(dataFromSMSCookie.tlf);
                    } else {
                        return res.status(401).json({m:"Du må validere telefonnummeret ditt før du bestiller time!"});
                    }
                }
            }

            let bestillNyTime = await Bestilttime.create({
                dato: dato,
                tidspunkt: tidspunkt,
                //frisor: frisor,
                behandlinger: behandlinger,
                medarbeider: medarbeider,
                kunde: jwt.sign({kunde}, CUSTOMER_KEY),
                telefonnummer: jwt.sign({telefonnummer: kundensTelefonnummer}, CUSTOMER_KEY)
            })

            let brukerTilAnsatt = await Brukere.findOne({brukernavn: medarbeider.toLowerCase()});
            if(brukerTilAnsatt){
                if(brukerTilAnsatt.aktivertEpost && brukerTilAnsatt.epost){
                    mailer.sendMail(`Du har fått en timereservasjon!`, `Reservasjon for "${behandlinger.join(", ")}" \n${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}, kl.:${tidspunkt}\n\nTimen er registrert på: ${kunde} ${kundensTelefonnummer}\n\n`, `${brukerTilAnsatt.epost}`);
                }
            }
            

            //Sender SMS med bekreftelse
            if(SMS_ENABLED){
                
                let baseUrl = "https://shared.target365.io/";
                let keyName = process.env.KEYNAME_SMS;
                let privateKey = process.env.PRIVATE_KEY;
                let serviceClient = new Client(privateKey, { baseUrl, keyName });


                let outMessage = {
                    transactionId: uuidv4(),
                    sender:'Target365',
                    recipient:`+47${kundensTelefonnummer}`,
                    content:`Takk for din timebestilling hos ${process.env.BEDRIFT}!\n\nDette er en bekreftelse på din reservasjon for "${behandlinger.join(", ")}" hos vår medarbeider ${medarbeider}\n${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}, kl.:${tidspunkt}\n\nTimen er registrert på: ${kunde}\n\nTa kontakt på: ${env.kontakt_tlf} dersom det skulle oppstå noe uforutsett!💇 Avbestilling må skje senest 1 døgn før avtalt time. \n\n${env.adresse.gatenavn} ${env.adresse.husnummer}${env.adresse.bokstav?env.adresse.bokstav:""}, ${env.adresse.postnummer} ${env.adresse.poststed}, velkommen!`
                }
                await serviceClient.postOutMessage(outMessage);

            }
            
            if(bestillNyTime){
                bestillNyTime.kunde = jwt.verify(bestillNyTime.kunde, CUSTOMER_KEY).kunde;
                bestillNyTime.telefonnummer = jwt.verify(bestillNyTime.telefonnummer, CUSTOMER_KEY).telefonnummer;
                return res.send({bestiltTime: bestillNyTime, valid:true})
            } else {
                return res.send({m: "Noe har skjedd galt, prøv igjen", valid:false})
            }
        } else {
            return res.send({bestillingAlreadyExcist: true});
        }
    } catch (error) {
        console.log(error);
        mailer.sendMail(`FEIL i bestilltime: ${process.env.BEDRIFT}`, "FÅR IKKE BESTILT TIME ELLER SMS SENDTE IKKE");
    }
})


const PINlimiter = rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Du har prøvd for mange ganger, prøv igjen om en time"
});

router.post("/tlfpin", PINlimiter, async (req,res)=>{
    const {pin} = req.body;
    if(NODE_ENV === "development"){
        return res.send({valid:true});
    }

    try {
        //Forutsetter at "req.cookies.tlfpin" finnes
        const data = jwt.verify(req.cookies.tlfpin, SMSPIN_SECRET);
        if(parseInt(data.pin) === parseInt(pin)){
            const token = jwt.sign({tlf: data.tlf}, SMSPINVALID_SECRET);
            const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 * 26); // 26 uker aka 6 måneder
            res.cookie("tlfvalid", token, {
                httpOnly: true,
                secure: process.env.HTTPS_ENABLED == "secure",
                expires: expirationDate
            });
            const samtykke = `samtykke: true, expirationDate: ${expirationDate.toLocaleDateString()}`
            
            res.cookie("samtykke_cookies", samtykke, {
                httpOnly: true,
                secure: process.env.HTTPS_ENABLED == "secure",
                expires: expirationDate
            });
            res.clearCookie("tlfpin");
            return res.send({valid:true});
        } else {
            return res.send({valid:false});
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/SMSpin", async (req,res)=>{
    const {tlf} = req.body;
    if(NODE_ENV === "development"){
        return res.send({valid:true});
    }

    
    try {

        //Sjekker om det er en ansatt som bestiller time for kunde som ringer inn
        const isToken = req.cookies.two_FA_valid;
        const isAnsatt = req.cookies.access_token;
        if(isToken){
            const ansatt = jwt.verify(req.cookies.two_FA_valid, ACCESS_TOKEN_KEY); 
            if(ansatt){
                return res.send({valid:true});
            } 
        } else if(isAnsatt){
            const ansattBestilling = req.cookies.access_token;
            if(ansattBestilling){
                const ansatt = jwt.verify(ansattBestilling, ACCESS_TOKEN_KEY);
                if(ansatt){
                    return res.send({valid:true});
                }
            }
        } else {
            //Sjekker om det er en gyldig cookie fra tidligere
            const isTlfValid = req.cookies.tlfvalid;
            if(isTlfValid){
                const tlfValid = jwt.verify(req.cookies.tlfvalid, SMSPINVALID_SECRET);
                if(tlfValid){
                    if(parseInt(tlfValid.tlf) === parseInt(tlf)){
                        return res.send({valid:true});
                    } else {
                        res.clearCookie("tlfvalid");
                        //Hvis ikke, generer ny pin og send den til brukeren
                        const pin = randomNumber(1200, 9999);
                        const data = {tlf, pin};
                        const token = jwt.sign(data, SMSPIN_SECRET, {expiresIn: "1h"});

                        res.cookie("tlfpin", token, {
                            httpOnly: true,
                            secure: process.env.HTTPS_ENABLED == "secure"
                        })
                        let baseUrl = "https://shared.target365.io/";
                        let keyName = process.env.KEYNAME_SMS;
                        let privateKey = process.env.PRIVATE_KEY;
                        let serviceClient = new Client(privateKey, { baseUrl, keyName });
                        let outMessage = {
                            transactionId: uuidv4(),
                            sender:'Target365',
                            recipient:`+47${tlf}`,
                            content:`Din PIN er: ${pin}`
                        }
                        await serviceClient.postOutMessage(outMessage);
                        return res.send({valid:false});
                    }
                } 
            } else {
                //Hvis ikke, generer ny pin og send den til brukeren
                const pin = randomNumber(1200, 9999);
                const data = {tlf, pin};
                const token = jwt.sign(data, SMSPIN_SECRET, {expiresIn: "1h"});

                res.cookie("tlfpin", token, {
                    httpOnly: true,
                    secure: process.env.HTTPS_ENABLED == "secure"
                })
                let baseUrl = "https://shared.target365.io/";
                let keyName = process.env.KEYNAME_SMS;
                let privateKey = process.env.PRIVATE_KEY;
                let serviceClient = new Client(privateKey, { baseUrl, keyName });
                let outMessage = {
                    transactionId: uuidv4(),
                    sender:'Target365',
                    recipient:`+47${tlf}`,
                    content:`Din PIN er: ${pin}`
                }
                await serviceClient.postOutMessage(outMessage);
                return res.send({valid:false});
            }
        }
    } catch(error){
        console.log(error);
    }
})

function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//Sletter én enkelt timebestilling
router.post('/oppdaterTimebestillinger', authorization, async (req,res)=>{
    try {
        if(req.admin){
            const slettTime = await Bestilttime.findOneAndDelete({_id: req.body._id});
            if(slettTime){
                return res.send({message: "Timebestilling slettet", valid: true})
            } else {
                return res.send({message: "Noe har skjedd galt, prøv igjen"})
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/hentBestiltetimer', hentBestillingerLimiter, async (req,res)=>{
    try {
        await Bestilttime.find({},'dato tidspunkt medarbeider behandlinger', function(err, docs){
                if(err){
                    mailer.sendMail(`Problem database: ${process.env.BEDRIFT}`, `Problemer med å returnere filtrerte documents fra mongodb for bestilte timer. Her er error melding: ${err}`);
                } else {
                    
                    return res.json(docs);
                }
            });
    } catch (error) {
        console.log(error);
    }
})


function minutterFraKlokkeslett(k){
    return ((parseInt(k.substring(0,2))*60) + parseInt(k.substring(3,5)));
}

function klokkeslettFraMinutter(n) {
    let number = n;
    let hours = (number / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return `${(rhours<10?`0${rhours}`:rhours)}:${(rminutes<10?`0${rminutes}`:rminutes)}`
    }

    
function hentMaaned(maanedInt){
    
    switch(maanedInt){
        case 0: return "Januar"
        case 1: return "Februar"
        case 2: return "Mars"
        case 3: return "April"
        case 4: return "Mai"
        case 5: return "Juni"
        case 6: return "Juli"
        case 7: return "August"
        case 8: return "September"
        case 9: return "Oktober"
        case 10: return "November"
        case 11: return "Desember"
        default: return ""
    }
}
  
module.exports = router;