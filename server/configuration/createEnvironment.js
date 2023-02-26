const Environment = require("../model/env");
const Brukere = require("../model/brukere");
const {BEDRIFT, ADMIN_TLF, ADMIN_BRUKER, ADMIN_PASS} = process.env;

async function opprettEnvironment(){
    try {
        const nyttenv = await Environment.create({
            kontakt_epost:"eksempel@gmail.com",
            kontakt_tlf:41394262,
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
                passord:ADMIN_PASS,
                telefonnummer: parseInt(ADMIN_TLF),
                admin:true
            })
            const adminBruker = await Brukere.create({
                brukernavn:"admin",
                passord:ADMIN_PASS,
                telefonnummer: parseInt(ADMIN_TLF),
                admin:true
            })


            
            if(adminBruker && nyttenv && bruker){
                console.log("Opprettet nytt env!");
            }
    } catch (error) {
        console.log(error)
    }
}

exports.opprettEnvironment = opprettEnvironment;