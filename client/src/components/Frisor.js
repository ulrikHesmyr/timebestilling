import React from "react";
import { frisorer, tjenester } from "../shared/env";

export default function Frisor({sKlokkeslett ,frisor, sFrisor, tjenesteliste, sProdukt}){

    return(
        <div className="frisorComponent">
        <h2>Velg frisør</h2>
        <div className="frisorene">
            
            {frisorer.map((element)=>(<div className="frisor" key={element.navn} onClick={()=>{
                sFrisor(element);
                sProdukt([]);
                sKlokkeslett(null);
                tjenesteliste.current.scrollIntoView({
                    behavior:'smooth',
                    block:'start'
                })

            }} style={{border: frisor === element?"3px solid black": "thin solid black"}}>
                {element.navn}
                {(element.produkter.length === tjenester.length?(<p>hvilken som helst behandling</p>):element.produkter.map((index)=>(<p key={index}>{tjenester[index].navn}</p>)))}
            </div>))}
        </div>
        </div>
    )
}