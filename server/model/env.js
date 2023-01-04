const mongoose = require("mongoose");

const env = new mongoose.Schema({
    bedrift:{type:String},
    antallBestillinger:{type:Number},
    kategorier: [String],
    tjenester: [
        {
            navn: String,
            pris: Number,
            tid: Number,
            kategori:Number
        }
    ],
    frisorer:[
        {
            navn:String,
            produkter:[Number]
        }
        
    ],
    klokkeslett: [
        {
        tid: String, 
        tilgjengeligeAnsatte: Number
    }
    ]
})

module.exports = mongoose.model("env", env);