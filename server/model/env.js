const mongoose = require("mongoose");

const env = new mongoose.Schema({
    kontakt_epost:{type:String},
    kontakt_tlf:{type: Number},
    sosialeMedier:[{platform: String, bruker: String}],
    admin_bruker:{type:String},
    admin_pass:{type:String},
    vakter_bruker:{type:String},
    vakter_pass:{type:String},
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
        dag: {type:String},
        open:{type:String},
        closed:{type:String}
        }]
})

module.exports = mongoose.model("env", env);