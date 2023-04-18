const jwt = require("jsonwebtoken");
const Environment = require("../model/env");
const Brukere = require("../model/brukere");
const {BEDRIFT, ADMIN_TLF, ADMIN_BRUKER, ADMIN_PASS, KONTAKT_TLF, PASSORD_KEY} = process.env;

async function opprettEnvironment(){
    try {
        const nyttenv = await Environment.create({
            kontakt_epost:"eksempel@gmail.com",
            kontakt_tlf: KONTAKT_TLF,
            sosialeMedier:[{
                platform:"Instagram",
                bruker:"UlrikFrisor",
                link:"https://www.instagram.com/bjoerkum/"
            },
            {
                platform:"Facebook",
                bruker:"UlrikFrisor",
                link:"https://www.facebook.com/LogNTNU"
            }],
            bedrift:BEDRIFT,
            adresse:{
                gatenavn:"Jernbanetorget",
                husnummer:"1",
                postnummer:"0154",
                poststed:"Oslo",
                bokstav:"",
                rep:{
                    lat:"59.9138698",
                    lng:"10.7522454"
                }
            },
            antallBestillinger:0,
            kategorier: ["Klipp", "Striper"],
            tjenester: [
                {
                    navn: "Kort-hår klipp",
                    pris: 250,
                    tid: 30,
                    kategori:"Klipp",
                    beskrivelse:"Klipp for langt hår, hår over skulderbladet"
                },
                {
                    navn: "Langt-hår klipp",
                    pris: 400,
                    tid: 60,
                    kategori:"Klipp",
                    beskrivelse:"Klipp for langt hår, hår under skulderbladet"
                },
                {
                    navn: "Striper kort hår",
                    pris: 450,
                    tid: 60,
                    kategori:"Striper",
                    beskrivelse:"Stripe håret i valgfri farge"
                },
                {
                    navn: "Striper langt hår",
                    pris: 650,
                    tid: 75,
                    kategori:"Striper",
                    beskrivelse:"Stripe håret i valgfri farge"
                }
            ],
            frisorer:[],
            hoytidsdager:[],
            googleReviewLink: `${process.env.GOOGLE_REVIEW_LINK}`,
            omOssArtikkel: "Hei, kjære kunde!\n\nVi er Ulrik Fades og vi ønsker velkommen til vår salong i Gjøvik Sentrum!",
            aktivertFeedbackSMS: false,
            aktivertSMSpin: false,
            adresse:{
                
                    gatenavn:"Teknologivegen",
                    husnummer:"22",
                    postnummer:"2815",
                    poststed:"GJØVIK",
                    bokstav:"",
                    rep: {
                    lat:"60.788817855104554",
                    lng:"10.689999999999998"
                    },
                },
            klokkeslett: [
                
                {
                    dag: "Søndag",
                    open:"10:00",
                    closed:"14:00",
                    stengt:true
                },
                {
                dag: "Mandag",
                open:"09:00",
                closed:"17:00"
                },
                {
                dag: "Tirsdag",
                open:"09:00",
                closed:"17:00"
                },
                {
                dag: "Onsdag",
                open:"09:00",
                closed:"17:00"
                },
                {
                dag: "Torsdag",
                open:"09:00",
                closed:"17:00"
                },
                {
                dag: "Fredag",
                open:"10:00",
                closed:"16:00"
                },
                {
                dag: "Lørdag",
                open:"10:00",
                closed:"14:00"
                }]
            })
            
            const bruker = await Brukere.create({
                brukernavn:ADMIN_BRUKER,
                passord: jwt.sign({passord: ADMIN_PASS}, PASSORD_KEY),
                telefonnummer: parseInt(ADMIN_TLF),
                admin:true
            })


            
            if(nyttenv && bruker){
                console.log("Opprettet nytt env!");
            }
    } catch (error) {
        console.log(error)
    }
}

exports.opprettEnvironment = opprettEnvironment;