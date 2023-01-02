const mongoose = require('mongoose');

const bestilling = new mongoose.Schema({
    dato: {type:String},
    tidspunkt: {type:String},
    frisor: {type:Number},
    behandlinger: {type:Array},
    medarbeider: {type:String},
    kunde: {type:String},
    telefonnummer: {type:Number}
  })

module.exports = mongoose.model("bestilling", bestilling);