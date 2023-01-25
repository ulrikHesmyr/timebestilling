import React from "react";
import Fortsett from "./Fortsett";

function Frisor({tilgjengeligeFrisorer, env, synligKomponent, displayKomponent, produkt, klokkeslettet, sKlokkeslett ,frisor, sFrisor}){

    return(
        <div className={synligKomponent === 1? 'animer-inn':""}>
            <div onClick={()=>{
                sFrisor(false);
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }

                }} style={{border: frisor === false?"3px solid black":"thin solid black", cursor:"pointer", padding:"0.2rem", width:"fit-content"}}>
                    
                    Første ledige frisør
                </div>
            <div className="frisorene">
            
                {tilgjengeligeFrisorer.map((element)=>(<div className="frisor" 
                key={element.navn} onClick={()=>{
                    console.log(element);
                    sFrisor(element);
                    if(klokkeslettet != null){
                        sKlokkeslett(null);
                    }

                }} style={{border: frisor === element?"3px solid black": "thin solid black"}}>
                    <img src={`person.png`} alt={`Bilde av frisør ${element.navn}`} style={{height:"4rem", aspectRatio:1/1, objectFit:"contain"}}></img>
                    {element.navn}
                    {(element.produkter.length === env.tjenester.length?(<p>hvilken som helst behandling</p>):element.produkter.map((index)=>(<p key={index}>{env.tjenester[index].navn}</p>)))}
                </div>))}
            </div>
            <Fortsett disabled={(frisor !== null?false:true)} number={2} displayKomponent={displayKomponent} />
        </div>
    )
}

export default React.memo(Frisor);