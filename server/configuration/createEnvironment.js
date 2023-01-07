const Environment = require("../model/env");
const {BEDRIFT} = process.env;

async function opprettEnvironment(){
    try {
        await Environment.create({
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
            klokkeslett: ["08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00"]
            })
    } catch (error) {
        console.log(error)
    }
}

exports.opprettEnvironment = opprettEnvironment;