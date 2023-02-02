const mongoose = require('mongoose');

const bruker = new mongoose.Schema({
    brukernavn: {type:String},
    passord:{type:String},
    telefonnummer:{type:Number}
  })

module.exports = mongoose.model("bruker", bruker);