const mongoose = require('mongoose');

const bestilling = new mongoose.Schema({
    dato: {type:String},
    tidspunkt: {type:String},
    skisser:[String],
    opplastinger:[String],
    behandlinger: {type:Array},
    medarbeider: {type:String},
    kunde: {type:String},
    telefonnummer: {type:String}
})

module.exports = mongoose.model("bestilling", bestilling);