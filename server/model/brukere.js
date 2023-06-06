const mongoose = require('mongoose');

const bruker = new mongoose.Schema({
    brukernavn: {type:String, unique:true},
    passord:{type:String},
    telefonnummer:{type:String},
    epost:{type:String},
    aktivertEpost:{type:Boolean, default:true},
    admin:{type:Boolean, default:false}
  })

module.exports = mongoose.model("bruker", bruker);