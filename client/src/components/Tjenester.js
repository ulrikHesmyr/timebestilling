import React from "react";
import {tjenester} from '../shared/env.js'


export default function Tjenester({produkt, sProdukt, valgtProdukt}){
    
    return(
        <div>
            <h1>Hva ønsker du å reservere time for?</h1>
            {tjenester.map((element)=>(
                <div className="tjeneste" key={element.navn} onClick={(e)=>{
                    sProdukt(element.navn);
                }} style={{border: produkt === element.navn?"3px solid black": "thin solid black"}}>
                <h2>{element.navn}</h2>
                <p>Pris: {element.pris} kr</p>
                <p>Tid: {element.tid} minutter</p>
                </div>
            ))}
        </div>
    )
}