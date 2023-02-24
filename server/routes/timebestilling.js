const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Client = require("target365-sdk");
const rateLimiter = require("express-rate-limit");

const mailer = require("../configuration/mailer");
const authorization = require("../middleware/authorization");

const Bestilttime = require("../model/bestilling");
const Env = require("../model/env");
const FriTimene = require("../model/fri");

const {NODE_ENV} = process.env;

let intervall = 60 * 60 * 1000; // 1 time
if(NODE_ENV === "development") intervall = 2* 60 * 1000; // 2 minutter

const bestillingLimiter = rateLimiter({
    windowMs: intervall,
    max: 5,
    message: {m:"Du har bestilt for mange ganger"}
});

const hentBestillingerLimiter = rateLimiter({
    windowMs:60*60*1000,
    max:60,
    message:"BAD REQUEST"
})
  

router.post('/bestilltime', bestillingLimiter, async (req,res)=>{
    try {
        const env = await Env.findOne();
        const {dato, behandlinger, kunde, medarbeider, telefonnummer, tidspunkt} = req.body; //frisor
        const t = await Bestilttime.findOne({dato: dato, medarbeider: medarbeider, tidspunkt:tidspunkt});
        
        let finnesIkkeKollisjon = true; 
        let totalTid = env.tjenester.filter(tjeneste=> behandlinger.includes(tjeneste.navn)).reduce((total, tjeneste)=>total + tjeneste.tid, 0);

        for(let i = minutterFraKlokkeslett(tidspunkt); i < (minutterFraKlokkeslett(tidspunkt) + totalTid);i+=15){
            let f = await Bestilttime.findOne({dato: dato, medarbeider: medarbeider, tidspunkt:klokkeslettFraMinutter(i)});
            if(f) finnesIkkeKollisjon = false;
        }
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
                            if(i === minutterFraKlokkeslett(tidspunkt)){
                                finnesIkkeKollisjon = false;
                            }
                        }
                    }
                }
            });
        }
        
        if(!t && finnesIkkeKollisjon){
            const bestillNyTime = await Bestilttime.create({
                dato: dato,
                tidspunkt: tidspunkt,
                //frisor: frisor,
                behandlinger: behandlinger,
                medarbeider: medarbeider,
                kunde: kunde,
                telefonnummer: telefonnummer
            })

            //Sender SMS med bekreftelse
            let SMS_ENABLED = true;
            if(SMS_ENABLED){
                
                let baseUrl = "https://shared.target365.io/";
                let keyName = process.env.KEYNAME_SMS;
                let privateKey = process.env.PRIVATE_KEY;
                let serviceClient = new Client(privateKey, { baseUrl, keyName });


                let outMessage = {
                    transactionId: uuidv4(),
                    sender:'Target365',
                    recipient:`+47${telefonnummer}`,
                    content:`Takk for din timebestilling hos ${process.env.BEDRIFT}!\n\nDette er en bekreftelse på din reservasjon for "${behandlinger.join(", ")}" hos vår medarbeider ${medarbeider}\n${parseInt(dato.substring(8,10))}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}, kl.:${tidspunkt}\n\nTimen er registrert på: ${kunde}\n\nTa kontakt på: ${env.kontakt_tlf} dersom det skulle oppstå noe uforutsett!💇 Avbestilling må skje senest 1 døgn før avtalt time. \n\n${env.adresse}, velkommen!`
                }
                await serviceClient.postOutMessage(outMessage);

            } else {
                console.log("SENDTE IKKE MELDING");
            }
            
            if(bestillNyTime){
                return res.send({message: "Time er bestilt", bestiltTime: bestillNyTime})
            } else {
                return res.send({message: "Noe har skjedd galt, prøv igjen"})
            }
        } else {
            return res.send({bestillingAlreadyExcist: true});
        }
    } catch (error) {
        console.log(error);
    }
})

//Sletter én enkelt timebestilling
router.post('/oppdaterTimebestillinger', authorization, async (req,res)=>{
    try {
        if(req.brukernavn === "admin"){
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