const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Environment = require("../model/env");
const FriElementer = require("../model/fri");
const Brukere = require("../model/brukere");
const multer = require('multer');
const sharp = require("sharp");
const rateLimiter = require("express-rate-limit");

const authorization = require("../middleware/authorization");
const {BEDRIFT, TLF_SECRET} = process.env;

const hentEnvLimiter = rateLimiter({
    max:100,
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
    if(req.admin){
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
    if(req.admin){
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

router.post('/opprettNyBehandling', authorization, async(req,res)=>{
    const {behandling} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$push:{tjenester:behandling}});
            if(oppdatertEnv){
                return res.send({message:"Behandling opprettet", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
)

router.post('/slettBehandling', authorization, async(req,res)=>{
    const {behandling} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$pull:{tjenester:{navn:behandling}}});
            if(oppdatertEnv){
                return res.send({message:"Behandling slettet", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

router.post("/oppdaterAapningstider", authorization, async(req,res)=>{
    const {dag, aapningstid, stengetid, stengt} = req.body;
    if(req.admin){
        try {
            const env = await Environment.findOne({bedrift:BEDRIFT});
            let nyeAapningstider = env.klokkeslett.map((a)=>{
                if(a.dag === dag.dag){
                  a.open = aapningstid; 
                  a.closed = stengetid;
                  a.stengt = stengt;
                } 
                return a;
              })
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {klokkeslett:nyeAapningstider});
            if(oppdatertEnv){
                return res.send({message:"Åpningstider oppdatert", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

router.post("/oppdaterBehandling", authorization, async(req,res)=>{
    const {tjeneste} = req.body;
    if(req.admin){
        try {
            const env = await Environment.findOne({bedrift:BEDRIFT});
            let nyeBehandlinger = env.tjenester.map((a)=>{
                if(a.navn === tjeneste.navn){
                  a = tjeneste;
                } 
                return a;
            })
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {tjenester:nyeBehandlinger});
            if(oppdatertEnv){
                return res.send({message:"Behandling oppdatert", valid:true});
            }

        } catch (error) {
            console.log(error);
        }
    }
})

router.post("/leggTilSosialtMedie", authorization, async(req,res)=>{
    const {medie} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$push:{sosialeMedier:medie}});
            if(oppdatertEnv){
                return res.send({message:"Sosialt medie opprettet", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

router.post('/slettSosialtMedie', authorization, async(req,res)=>{
    const {medie} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$pull:{sosialeMedier:medie}});
            if(oppdatertEnv){
                return res.send({message:"Sosialt medie slettet", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

router.post('/slettKategori', authorization, async(req,res)=>{
    const {kategori} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$pull:{kategorier:kategori}});
            if(oppdatertEnv){
                return res.send({message:"Kategori slettet", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

router.post('/nyKategori', authorization, async(req,res)=>{
    const {kategori} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$push:{kategorier:kategori}});
            if(oppdatertEnv){
                return res.send({message:"Kategori opprettet", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

router.post("/siOppFrisor", authorization, async(req,res)=>{
    const {navn, dato, ikkeSiOpp} = req.body;
    if(req.admin){
        try {
            const env = await Environment.findOne({bedrift:BEDRIFT});
            let tempFrisorer = env.frisorer;
            if(ikkeSiOpp){
                tempFrisorer.map((f)=>{
                    if(f.navn === navn){
                      f.oppsigelse = "Ikke oppsagt";
                    }
                    return f});
            } else {
                tempFrisorer.map((f)=>{
                    if(f.navn === navn){
                      f.oppsigelse = dato;
                    }
                    return f});
            }
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:tempFrisorer});
            if(oppdatertEnv){
                return res.send({message:"Medarbeider oppdatert", valid:true});
            }
        } catch (error) {
            console.log(error);
        }
    }

})

router.post('/oppdaterTelefonnummer', authorization, async(req,res)=>{
    const {telefonnummer} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {kontakt_tlf:telefonnummer});
            if(oppdatertEnv){
                return res.send({message:"Telefonnummer oppdatert", valid:true});
            } else {
                return res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    }
});

router.post('/oppdaterEpost', authorization, async(req,res)=>{
    const {epost} = req.body;
    if(req.admin){
        try {
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {kontakt_epost:epost});
            if(oppdatertEnv){
                return res.send({message:"Epost oppdatert", valid:true});
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
    if(req.admin){    
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const filNavn = req.params.navn.toLowerCase() + '.jpg';
        cb(null, filNavn);
    },
    limits: { fileSize: 6 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|HEIC|heic|heif|HEIF|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }


    
});


const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const filNavn = req.params.filnavn;
        cb(null, filNavn);
    },
    limits: { fileSize: 6 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|HEIC|heic|heif|HEIF|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }


    
});

//Multer instance for bilde når man oppretter ny frisør
const upload = multer({
    storage: storage
}).single("uploaded_file");

//Multer instance for å oppdatere bilde av frisør
const oppdaterBildeFrisor = multer({
    storage: storage
}).single("uploaded_file");

router.post("/oppdaterBildeFrisor/:navn", authorization, oppdaterBildeFrisor, async (req,res)=>{

    
    const {navn} = req.body;
    try {
        if(req.admin){
            //Konverterer bilde fra request til buffer, og reduserer størrelsen til 200x200px
            
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                const img = navn + ".jpg";
                let nyFrisorer = env.frisorer.map(frisor => {
                    if(frisor.navn.toLowerCase() === navn){
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
        }
    } catch (error) {
        console.log(error, "error i oppdaterBildeFrisor");
    }
});

const omOssBilde = multer({
    storage: storage2
}).single("uploaded_file");

router.post("/lastOppBilde/:filnavn", authorization, omOssBilde, async (req, res)=>{
    const {objektet} = req.body;
    try {
        if(req.admin){
            const oppdaterEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$push:{omOssFeed: JSON.parse(objektet)}});
            if(oppdaterEnv){
                return res.send({valid:true});
            }
        }
    } catch (error) {
        console.log(error);
    }
});

router.post("/slettInnhold", authorization, async (req, res)=>{
    const {content} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let nyOmOssFeed = env.omOssFeed.filter(element => element.content != content);
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {omOssFeed:nyOmOssFeed});
                if(oppdatertEnv){
                    return res.send({valid:true});
                } 
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
})

router.post("/flyttOpp", authorization, async (req, res)=>{
    const {index} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){

                let temp = env.omOssFeed[index];
                let tempOmOssFeed = [...env.omOssFeed];
                tempOmOssFeed[index] = env.omOssFeed[index-1];
                tempOmOssFeed[index-1] = temp;
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {omOssFeed:tempOmOssFeed});
                if(oppdatertEnv){
                    return res.send({valid:true});
                }

            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
});


router.post("/flyttNed", authorization, async (req, res)=>{
    const {index} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){

                let temp = env.omOssFeed[index];
                let tempOmOssFeed = [...env.omOssFeed];
                tempOmOssFeed[index] = env.omOssFeed[index+1];
                tempOmOssFeed[index+1] = temp;
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {omOssFeed:tempOmOssFeed});
                if(oppdatertEnv){
                    return res.send({valid:true});
                }

            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
});



router.post("/leggTilInnhold", authorization, async (req, res)=>{
    const {objektet} = req.body;
    try {
        if(req.admin){
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$push:{omOssFeed:objektet}});
            if(oppdatertEnv){
                return res.send({valid:true});
            } else {
                return res.send({valid:false});
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/endreAktivertTimebestilling", authorization, async (req, res)=>{
    const {aktivert} = req.body;
    try {
        if(req.admin){
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {aktivertTimebestilling:aktivert});
            if(oppdatertEnv){
                return res.send({valid:true});
            } else {
                return res.send({valid:false});
            }
        }
    } catch (error) {
        console.log(error);
    }
}
);

router.post("/leggTilHoytidsdag", authorization, async (req, res)=>{
    const {dag, dato} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$push:{hoytidsdager:{dag:dag, dato:dato}}});
            if(env){
                return res.send({valid:true});
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/slettHoytidsdag", authorization, async (req, res)=>{
    const {dag} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$pull:{hoytidsdager:{dag:dag}}});
            if(env){
                return res.send({valid:true});
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/giAdmin", authorization, async (req, res)=>{
    const {navn} = req.body;
    try {
        if(req.admin){
            const bruker = await Brukere.findOneAndUpdate({brukernavn:navn}, {admin:true});
            if(bruker){
                return res.send({valid:true});
            }
        }
    } catch (error) {
        console.log(error);

    }
})

router.post("/hentAdminInfo", authorization, async(req,res)=>{
    try {
        if(req.admin){
            const navn = req.body.brukernavn.toLowerCase();
            const bruker = await Brukere.findOne({brukernavn: navn});
            if(bruker){
                return res.send({valid:true, admin:bruker.admin, tlf: jwt.verify(bruker.telefonnummer, TLF_SECRET).telefonnummer, epost: bruker.epost});
            }
        }
    } catch (error) {
        console.log(error);
    }
})
                    

router.post("/oppdaterPaaJobb", authorization, async (req,res)=>{
    const {paaJobb, navn} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let nyFrisorer = env.frisorer.map(frisor => {
                    if(frisor.navn === navn){
                        frisor.paaJobb = paaJobb;
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
        }
    } catch (error) {
        
    }
});

router.post("/opprettFrisor/:navn", authorization, upload, async (req,res)=>{ 

   
    const {nyFrisorTjenester, tittel, beskrivelse, paaJobb} = req.body;
    const {navn} = req.params;
    let nyFrisorTjenesterArray = nyFrisorTjenester.split(",");
    try {
        if(req.admin){
            const img = navn.toLowerCase() + ".jpg";
            const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {$push:{frisorer:{navn:navn, produkter:nyFrisorTjenesterArray, img:img, tittel:tittel, beskrivelse:beskrivelse, paaJobb:JSON.parse(paaJobb)}}});
            if(oppdatertEnv){
                return res.send({message:"Medarbeider opprettet!"});
            } else {
                return res.send({message:"Noe har skjedd gærent i /opprettFrisor!"});
            }
            
        
        }
    } catch (error) {
        console.log(error, "error i opprettFrisor");
    }
})

router.post("/oppdaterTelefonAnsatt", authorization, async (req,res)=>{
    const {telefon, navn} = req.body;
    try {
        if(req.admin){
            const brukere = await Brukere.findOneAndUpdate({brukernavn:navn.toLowerCase()}, {telefonnummer: jwt.sign({telefonnummer: telefon}, TLF_SECRET)});
            if(brukere){
                return res.send({message:"Telefon oppdatert!"});
            } else {
                return res.status(404).send("Kunne ikke oppdatere telefonnummer");
            }
        }
    } catch (error) {
        console.log(error, "error i oppdaterTelefonAnsatt");
    }
}
)

router.post("/oppdaterOmOss", authorization, async (req,res)=>{
    const {omOssArtikkel} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {omOssArtikkel:omOssArtikkel});
            if(env){
                return res.send({message:"Om oss oppdatert!"});
            } else {
                return res.status(404).send("Kunne ikke oppdatere om oss");
            }
        }
    } catch (error) {
        console.log(error, "error i oppdaterOmOss");
    }
}
)

router.post("/oppdaterGoogleReviewLink", authorization, async (req,res)=>{
    const {googleReviewLink} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {googleReviewLink:googleReviewLink});
            if(env){
                return res.send({message:"Google review link oppdatert!"});
            } else {
                return res.status(404).send("Kunne ikke oppdatere google review link");
            }
        }
    } catch (error) {
        console.log(error, "error i oppdaterGoogleReviewLink");
    }
})

router.post("/fjernPause", authorization, async (req, res)=>{
    const {navn, dag, pause} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let nyFrisorer = env.frisorer.map(frisor => {
                    if(frisor.navn === navn){
                        frisor.paaJobb.map(dagPaaJobb => {
                            if(dagPaaJobb.dag === dag){
                                dagPaaJobb.pauser = dagPaaJobb.pauser.filter(p => p !== pause);
                            }
                        })
                    }
                    return frisor;
                })
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:nyFrisorer});
                if(oppdatertEnv){
                    return res.send({message:"Fjernet pause", valid:true});
                } else {
                    return res.send({valid:false});
                }
            }
        }
    } catch (error) {
        console.log(error, "error i fjernPause");
    }
})

router.post("/leggTilPause", authorization, async (req, res)=>{
    //Legger inn ny pause for ansatt på en vilkårlig dag
    const {navn, dag, pause} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let nyFrisorer = env.frisorer.map(frisor => {
                    if(frisor.navn === navn){
                        frisor.paaJobb.map(dagPaaJobb => {
                            if(dagPaaJobb.dag === dag){
                                dagPaaJobb.pauser.push(pause);
                            }
                        })
                    }
                    return frisor;
                })
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:nyFrisorer});
                if(oppdatertEnv){
                    return res.send({message:"Pause lagt til!", valid:true});
                } else {
                    return res.send({message:"Noe har skjedd gærent i /leggTilPause!"});
                }
            }
        }
    } catch (error) {
            
    }
})

router.post("/oppdaterTittelOgBeskrivelse", authorization, async (req,res)=>{
    const {navn, tittel, beskrivelse} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let nyFrisorer = env.frisorer.map(frisor => {
                    if(frisor.navn === navn){
                        frisor.tittel = tittel;
                        frisor.beskrivelse = beskrivelse;
                    }
                    return frisor;
                })
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:nyFrisorer});
                if(oppdatertEnv){
                    return res.send({message:"Tittel og beskrivelse oppdatert!"});
                } else {
                    return res.send({message:"Noe har skjedd gærent i /oppdaterTittelOgBeskrivelse!"});
                }
            }
        }
    } catch (error) {
        console.log(error, "error i oppdaterTittelOgBeskrivelse");
    }
})


router.post("/slettFrisor", authorization, async (req,res)=>{
    const {navn} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let tempFrisorer = env.frisorer;
                let nyFrisorer = tempFrisorer.filter(frisor => frisor.navn !== navn);
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:nyFrisorer});
                if(oppdatertEnv){
                    return res.send({message:"Medarbeider slettet!"});
                } else {
                    return res.send({message:"Noe har skjedd gærent i /slettFrisor!"});
                }
            }
        }
    } catch (error) {
        console.log(error, "error i slettFrisor");
    }
})

router.post("/oppdaterBehandlingerFrisor", authorization, async (req, res)=>{
    const {navn, behandlinger} = req.body;
    
    try {
        if(req.admin){
            const env = await Environment.findOne({bedrift:BEDRIFT});
            if(env){
                let tempFrisorer = env.frisorer;
                let nyFrisorer = tempFrisorer.map(frisor => {
                    if(frisor.navn === navn){
                        frisor.produkter = behandlinger;
                    }
                    return frisor;
                })
                const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {frisorer:nyFrisorer});
                if(oppdatertEnv){
                    return res.send({message:"Behandlinger oppdatert!", valid: true});
                } else {
                    
                    return res.send({message:"Noe har skjedd gærent i /oppdaterBehandlingerFrisor!"});
                }
            }
        }
        
    } catch (error) {
        
    }
})

router.post('/oppdaterEnv',authorization, async(req,res)=>{
    const {tjenester, kategorier, sosialeMedier, kontakt_tlf, kontakt_epost, klokkeslett} = req.body;
    try {
        if(req.admin){
            
        const oppdatertEnv = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {tjenester:tjenester, kategorier:kategorier, sosialeMedier:sosialeMedier, kontakt_tlf:kontakt_tlf, kontakt_epost:kontakt_epost, klokkeslett:klokkeslett});
        
            if(oppdatertEnv){
                return res.send({message:"Environment ble oppdatert!"});
            } else {
                return res.send({message:"Noe har skjedd gærent i /oppdaterEnv!"});
            }
        }
    } catch (error) {
        
    }
})

router.post("/endreStatusSMSfeedback", authorization, async (req,res)=>{
    const {nyStatus} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {aktivertFeedbackSMS:nyStatus});
            if(env){
                return res.send({message:"Status oppdatert!"});
            } else {
                return res.status(404).send("Kunne ikke oppdatere status");
            }
        }
    } catch (error) {
        console.log(error, "error i endreStatusSMSfeedback");
    }
})

router.post("/endreStatusSMSpin", authorization, async (req,res)=>{
    const {nyStatus} = req.body;
    try {
        if(req.admin){
            const env = await Environment.findOneAndUpdate({bedrift:BEDRIFT}, {aktivertSMSpin:nyStatus});
            if(env){
                return res.send({message:"Status oppdatert!"});
            } else {
                return res.status(404).send("Kunne ikke oppdatere status");
            }
        }
    } catch (error) {
        console.log(error, "error i endreStatusSMSpin");
    }
}
)

module.exports = router;