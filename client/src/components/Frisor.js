import React from "react";
import Fortsett from "./Fortsett";

function Frisor({env, synligKomponent, displayKomponent, produkt, klokkeslettet, sKlokkeslett ,frisor, sFrisor, sProdukt}){

    function includesArray(source, target) {
        return target.every(function(elem) {
            return source.includes(elem);
        });
    }
    return(
        <div className={synligKomponent === 1? 'animer-inn':'animer-ut'}>
            <div className="frisorene">

                {env.frisorer.filter((frisor)=>{
                    if(includesArray(frisor.produkter, produkt.map(tjeneste=>env.tjenester.indexOf(tjeneste)))){
                        return frisor
                    } else {
                        return undefined
                    }
                }).filter(x=>x).map((element)=>(<div className="frisor" key={element.navn} onClick={()=>{
                    sFrisor(element);
                    if(klokkeslettet != null){
                        sKlokkeslett(null);
                    }

                }} style={{border: frisor === element?"3px solid black": "thin solid black"}}>
                    <img src={`person.png`} alt={`Bilde av frisør ${element.navn}`} style={{height:"8rem", aspectRatio:1/2, objectFit:"contain"}}></img>
                    {element.navn}
                    {(element.produkter.length === env.tjenester.length?(<p>hvilken som helst behandling</p>):element.produkter.map((index)=>(<p key={index}>{env.tjenester[index].navn}</p>)))}
                </div>))}
            </div>
            <Fortsett valid={(frisor !== null?false:true)} number={2} displayKomponent={displayKomponent} />
        </div>
    )
}

export default React.memo(Frisor);