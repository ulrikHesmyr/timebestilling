const express = require("express");
const router = express.Router();

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
        const alleBestilteTimer = await Bestilttime.find();
        return res.json(alleBestilteTimer)
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;