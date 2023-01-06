const express = require("express");
const router = express.Router();
const mailer = require("../configuration/mailer");

const Bestilttime = require("../model/bestilling");

router.post('/bestilltime', async (req,res)=>{
    try {
        const {dato, behandlinger, frisor, kunde, medarbeider, telefonnummer, tidspunkt} = req.body;
        const bestillNyTime = await Bestilttime.create({
            dato: dato,
            tidspunkt: tidspunkt,
            frisor: frisor,
            behandlinger: behandlinger,
            medarbeider: medarbeider,
            kunde: kunde,
            telefonnummer: telefonnummer
          })
        if(bestillNyTime){
            return res.send({message: "Time er bestilt", bestiltTime: bestillNyTime})
        } else {
            return res.send({message: "Noe har skjedd galt, prøv igjen"})
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/hentBestiltetimer', async (req,res)=>{
    try {
        await Bestilttime.find({},'dato tidspunkt frisor behandlinger', function(err, docs){
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

module.exports = router;