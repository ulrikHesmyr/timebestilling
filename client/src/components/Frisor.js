import React from "react";
import { frisorer, tjenester } from "../shared/env";

function Frisor({synligKomponent, displayKomponent, produkt, klokkeslettet, sKlokkeslett ,frisor, sFrisor, sProdukt}){

    return(
        <div className={synligKomponent === 1? 'animer-inn':'animer-ut'}>
            <div className="frisorene">

                {frisorer.map((element)=>(<div className="frisor" key={element.navn} onClick={()=>{
                    sFrisor(element);
                    setTimeout(()=>{
                        displayKomponent(2);
                    },100);
                    if(produkt.length > 0 || klokkeslettet != null){
                        sProdukt([]);
                        sKlokkeslett(null);
                    }

                }} style={{border: frisor === element?"3px solid black": "thin solid black"}}>
                    {element.navn}
                    {(element.produkter.length === tjenester.length?(<p>hvilken som helst behandling</p>):element.produkter.map((index)=>(<p key={index}>{tjenester[index].navn}</p>)))}
                </div>))}
            </div>
        </div>
    )
}

export default React.memo(Frisor);