const Environment = require("../model/env");

async function opprettEnvironment(){
    try {
        const nyttEnvironment = await Environment.create({
        
            bedrift:"Ulriks frisørsalong",
            antallBestillinger:0,
            kategorier: ["Klipp", "Kur", "Striper", "Barbering"],
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
                }
            ],
            frisorer:[
                {
                    navn:"Ulrik",
                    produkter:[0,1,2,3,4,5]
                },
                {
                    navn:"Anine",
                    produkter:[0,2,3,5]
                },
                {
                    navn:"Ludvik",
                    produkter:[0,1]
                },
                {
                    navn:"Ulrik",
                    produkter:[0,4,5]
                }
                
            ],
            klokkeslett: [
                {
                    tid: "08:00", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "08:30", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "09:00", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "09:30", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "10:00", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "10:30", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "11:00", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "11:30", 
                    tilgjengeligeAnsatte: 2
                },
                {
                    tid: "12:00", 
                    tilgjengeligeAnsatte: 2
                }
            ]
            })
    } catch (error) {
        console.log(error)
    }
}

exports.opprettEnvironment = opprettEnvironment;