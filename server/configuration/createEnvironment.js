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
            kategorier: ["Klipp", "Kur", "Striper", "Barbering", "Vipper/bryn", "Vask of føhn"],
            tjenester: [
                {
                    navn: "Kort-hår klipp",
                    pris: 250,
                    tid: 30,
                    kategori:0
                },
                {
                    navn: "Langt-hår klipp",
                    pris: 350,
                    tid: 60,
                    kategori:0
                },
                {
                    navn: "Kur for å få lenger hår",
                    pris: 250,
                    tid: 75,
                    kategori:1
                },
                {
                    navn: "Striper kort hår",
                    pris: 600,
                    tid: 45,
                    kategori:2
                },
                {
                    navn: "Barbere kort skjegg",
                    pris: 150,
                    tid: 15,
                    kategori:3
                },
                {
                    navn: "Barbere langt skjegg",
                    pris: 250,
                    tid: 30,
                    kategori:3
                },
                {
                    navn: "Striper langt hår",
                    pris: 560,
                    tid: 60,
                    kategori:2
                },
                {
                    navn: "Nappe bryn",
                    pris: 250,
                    tid: 30,
                    kategori:4
                },
                {
                    navn: "Farge vipper",
                    pris: 200,
                    tid: 30,
                    kategori:4
                },
                {
                    navn: "Farge bryn",
                    pris: 100,
                    tid: 15,
                    kategori:4
                },
                {
                    navn: "Vask og føhn",
                    pris: 560,
                    tid: 45,
                    kategori:5
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