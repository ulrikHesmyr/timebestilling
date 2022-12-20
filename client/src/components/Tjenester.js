import React from "react";
import {tjenester, antallAnsatte} from '../shared/env.js'


export default function Tjenester(){
    
    return(
        <div>
            <h1>Hva ønsker du å reservere time for?</h1>
            {tjenester.map((element)=>(
                <div className="tjeneste" key={element.navn}>
                <h2>{element.navn}</h2>
                <p>Pris: {element.pris} kr</p>
                <p>Tid: {element.tid} minutter</p>
                </div>
            ))}
        </div>
    )
}