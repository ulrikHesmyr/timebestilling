const express = require("express");
const router = express.Router();
const Environment = require("../model/env");
const mailer = require("../configuration/mailer");
const {BEDRIFT} = process.env;



router.get('/env', async(req,res)=>{
    try {
        await Environment.findOne({bedrift: BEDRIFT}).select('-admin_bruker -admin_pass -antallBestillinger -vakter_bruker -vakter_pass -_id -__v').exec((err, doc)=>{
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

module.exports = router;