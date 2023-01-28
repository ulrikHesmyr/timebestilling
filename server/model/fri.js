const mongoose = require('mongoose');

//lengreTid bestemmer om fri er for flere dager, eller om det bare er et tidspunkt én dag
const fri = new mongoose.Schema({
    lengreTid:{type:Boolean},
    fraDato:{type:String},
    tilDato:{type:String},
    fraKlokkeslett:{type:String},
    tilKlokkeslett:{type:String},
    friDag:{type:String},
    frisor:{type:Number},
    medarbeider:{type:String}
  })

module.exports = mongoose.model("fri", fri);