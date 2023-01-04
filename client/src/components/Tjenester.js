import React from "react";
import {tjenester, kategorier} from '../shared/env.js'
import Fortsett from "./Fortsett.js";


export default function Tjenester({synligKomponent, displayKomponent, produkt, sProdukt, frisor}){
    

    return(
        <div className={synligKomponent === 2? 'animer-inn':'animer-ut'}>
            <Fortsett displayKomponent={displayKomponent} number={3} valid={(produkt.length > 0?false:true)} />
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
                        }}>
                        <div>
                            <h3>{tjenester[element].navn}</h3>
                            <p>Pris: {tjenester[element].pris} kr</p>
                            <p>Tid: {tjenester[element].tid} minutter</p>
                        </div>
                        <input type="checkbox" checked={produkt.includes(tjenester[element].navn)}></input>
                        </div>
            ))}
            </div>
                    
                    
                ))}
            </div>
        </div>
    )
}