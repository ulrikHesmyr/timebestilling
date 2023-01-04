const express = require("express");
const router = express.Router();

router.post('/auth', async (req,res)=>{
    try {
        console.log(req.headers);
        return res.send({message:req.body.brukernavn});
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;