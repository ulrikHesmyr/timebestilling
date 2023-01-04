const express = require("express");
const router = express.Router();
const Environment = require("../model/env");

router.get('/env', async(req,res)=>{
    const env = await Environment.findOne();
    return res.send(env);
})

module.exports = router;