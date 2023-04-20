const mongoose = require("mongoose");

const env = new mongoose.Schema({
    kontakt_epost:{type:String},
    kontakt_tlf:{type: Number},
    sosialeMedier:[{platform: String, bruker: String, link: String}],
    bedrift:{type:String},
    antallBestillinger:{type:Number},
    kategorier: [String],
    googleReviewLink: {type:String},
    omOssArtikkel: {type:String},
    adresse:{gatenavn:String, husnummer:String, postnummer:String, poststed:String, bokstav:String, rep:{lat:String,lng:String}},
    aktivertFeedbackSMS: {type:Boolean, default:false},
    aktivertSMSpin: {type:Boolean, default:false},
    tjenester: [
        {
            navn: String,
            pris: Number,
            tid: Number,
            kategori:String,
            beskrivelse: String
        }
    ],
    frisorer:[
        {
            navn:{type:String},
            img:{
                data:Buffer,
                contentType:String
            },
            produkter:[String],
            oppsigelse:{type: String, default: "Ikke oppsagt"},
            tittel:{type:String},
            beskrivelse:{type:String},
            paaJobb:[{
                dag: {type:String},
                open:{type:String},
                closed:{type:String},
                stengt:{type:Boolean, default:false},
                lunsj:{
                    start:{type:String}, 
                    slutt:{type:String}},
                    ikkeLunsj:{type:Boolean, default:false}
                }]
        }
        
    ],
    hoytidsdager:[{dag:String, dato:String}],
    klokkeslett: [
        {
        dag: {type:String},
        open:{type:String},
        closed:{type:String},
        stengt:{type:Boolean, default:false},
        }]
})

module.exports = mongoose.model("env", env);