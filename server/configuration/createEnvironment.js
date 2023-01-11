const Environment = require("../model/env");
const {BEDRIFT} = process.env;

async function opprettEnvironment(){
    try {
        await Environment.create({
            kontakt_epost:"eksempel@gmail.com",
            kontakt_tlf:41394262,
            sosialeMedier:[{
                platform:"Instagram",
                bruker:"UlrikFrisor"
            },
            {
                platform:"Facebook",
                bruker:"UlrikFrisor"
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
            frisorer:[
                {
                    navn:"Robin",
                    produkter:[0,1,2,3,4,5]
                },
                {
                    navn:"Anine",
                    produkter:[0,2,3,5]
                },
                {
                    navn:"Ludvik",
                    produkter:[0,1,4]
                },
                {
                    navn:"Ulrik",
                    produkter:[0,4,5]
                }
                
            ],
            klokkeslett: [
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
    } catch (error) {
        console.log(error)
    }
}

exports.opprettEnvironment = opprettEnvironment;