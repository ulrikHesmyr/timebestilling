const express = require("express");
const router = express.Router();
const Environment = require("../model/env");
const mailer = require("../configuration/mailer");
const {BEDRIFT} = process.env;

router.get('/env', async(req,res)=>{
    const env = await Environment.findOne({bedrift: BEDRIFT});
    if(env){
        return res.send(env);
    }
})

module.exports = router;