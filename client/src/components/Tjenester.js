import React from "react";
import {tjenester, kategorier} from '../shared/env.js'


export default function Tjenester({produkt, sProdukt, frisor}){
    
    return(
        <div>
            <h2>Hva ønsker du å reservere time for?</h2>
            <div className="kategorier">
            
                {kategorier.map((kategori)=>(
                    <div key={kategori}>
                    <div className="kategori">{kategori}</div>
                    {frisor.produkter.filter(element=>kategorier[tjenester[element].kategori] === kategori).map((element)=>(
                        <div className="tjeneste" key={tjenester[element].navn} onClick={()=>{
                            if(!produkt.includes(tjenester[element].navn)){
                                sProdukt([...produkt, tjenester[element].navn]);
                            } else {
                                sProdukt(produkt.filter(p=>p !== tjenester[element].navn))
                            }
                        }} style={{border: produkt === tjenester[element].navn?"3px solid black": "thin solid black"}}>
                        <h3>{tjenester[element].navn}</h3>
                        <p>Pris: {tjenester[element].pris} kr</p>
                        <p>Tid: {tjenester[element].tid} minutter</p>
                        </div>
            ))}
            </div>
                    
                    
                ))}
            </div>
        </div>
    )
}