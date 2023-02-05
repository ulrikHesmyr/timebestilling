const mongoose = require("mongoose");

const env = new mongoose.Schema({
    kontakt_epost:{type:String},
    kontakt_tlf:{type: Number},
    sosialeMedier:[{platform: String, bruker: String}],
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
            img:{
                data:Buffer,
                contentType:String
            },
            produkter:[Number],
            oppsigelse:{type: String, default: "Ikke oppsagt"},
        }
        
    ],
    klokkeslett: [
        {
        dag: {type:String},
        open:{type:String},
        closed:{type:String}
        }]
})

module.exports = mongoose.model("env", env);