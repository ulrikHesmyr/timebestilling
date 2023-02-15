const Environment = require("../model/env");
const Brukere = require("../model/brukere");
const {BEDRIFT, ADMIN_TLF} = process.env;

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
            admin_bruker:"admin",
            admin_pass:"KongHarald",
            vakter_bruker:"vakter",
            vakter_pass:"DronningSonja",
            bedrift:BEDRIFT,
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
            adresse:"Ulrik Frisør, Storgata 1, 1234 Sted",
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
            let tlf = parseInt(ADMIN_TLF)

            const adminBruker = await Brukere.create({
                brukernavn:"admin",
                passord:"KongHarald",
                telefonnummer: tlf
            })


            
            if(adminBruker && nyttenv){
                console.log("Opprettet nytt env!");
            }
    } catch (error) {
        console.log(error)
    }
}

exports.opprettEnvironment = opprettEnvironment;