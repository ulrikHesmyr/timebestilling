const express = require("express");
const router = express.Router();

router.post('/', async (req,res)=>{
    return res.json({message:"du logget inn"});
})

module.exports = router;