import React, {useEffect, useRef} from "react";
import { hentDato } from "../App";
import Fortsett from "./Fortsett";

function Frisor({tilgjengeligeFrisorer, sDato, sMidlertidigDato, frisorBildeArray, sFrisorBildeArray, displayKomponent, klokkeslettet, sKlokkeslett ,frisor, sFrisor}){

    const valgtFrisorBoks = useRef(null);
    const referanceElement = useRef(null);
    function genererBilder(){
        
        //Lager et array med base64 bilder
        let midlertidigArray = [];
        for(let i = 0; i < tilgjengeligeFrisorer.length; i++){
            const array = new Uint8Array(tilgjengeligeFrisorer[i].img.data.data);
            const base = window.btoa(String.fromCharCode.apply(null, array));
            const base64Image = `data:${tilgjengeligeFrisorer[i].img.contentType};base64,${base}`;

            //const base64Image = `data:${env.frisorer[i].img.contentType};base64,${window.btoa(env.frisorer[i].img.data.data)}`;
            midlertidigArray.push(base64Image);
        }
        sFrisorBildeArray(midlertidigArray);
    }
    
    useEffect(()=>{
        genererBilder();
    }, [tilgjengeligeFrisorer])
    return(
        <div>
            {tilgjengeligeFrisorer.length > 0?<>
            <div tabIndex={0} aria-label="Velg første ledige frisør" onClick={()=>{
                sFrisor(false);
                sDato(hentDato());
                sMidlertidigDato(hentDato());
                valgtFrisorBoks.current.scrollIntoView({behavior:"smooth", block:"center"});
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }

                }} 
                onKeyDown={(e)=>{
                    if(e.code === "Enter" || e.code === "Space"){
                        sFrisor(false);
                        sDato(hentDato());
                        sMidlertidigDato(hentDato());
                        valgtFrisorBoks.current.scrollIntoView({behavior:"smooth", block:"center"});
                        if(klokkeslettet != null){
                            sKlokkeslett(null);
                        }
                    }
    
                    }}
                style={{ textDecoration:frisor === false?"underline":"none", cursor:"pointer", padding:"0.8rem", width:"fit-content", color:"var(--color3)", borderRadius:"0.4rem", border:"thin solid black", backgroundColor:"white"}}>
                    
                    Første ledige frisør
                </div>
                
            <div className="frisorene">
            
                {frisorBildeArray !== null? tilgjengeligeFrisorer.map((element, index)=>(<div tabIndex={0} role="button" className="frisor" 
                key={element.navn} aria-label={`Velg frisøren ${element.navn}`} onClick={()=>{
                    sFrisor(element);
                    sDato(hentDato());
                    sMidlertidigDato(hentDato());
                    valgtFrisorBoks.current.scrollIntoView({behavior:"smooth", block:"center"});
                    if(klokkeslettet != null){
                        sKlokkeslett(null);
                    }

                }} 
                onKeyDown={(e)=>{
                    if(e.code === "Enter" || e.code === "Space"){
                        
                        sFrisor(element);
                        sDato(hentDato());
                        sMidlertidigDato(hentDato());
                        valgtFrisorBoks.current.scrollIntoView({behavior:"smooth", block:"center"});
                        if(klokkeslettet != null){
                            sKlokkeslett(null);
                        }
                    }

                }}
                style={{ textDecoration:frisor === element?"underline":"none"}}>
                    <img className="frisorbilde" src={frisorBildeArray[index]} alt={`Bilde av frisør ${element.navn}`} style={{height:"4rem"}}></img>
                    {element.navn}
                    
                </div>)):""}
            </div>
            <div className="valgtFrisorTekst">
            {frisor === false && "Du har valgt: Første ledige frisør"}
            <div ref={valgtFrisorBoks} ></div>
            {frisor !== null && frisor !== false && <div >Du har valgt:<div
                key={frisor.navn} style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                     {frisor.navn}
                    <img className="frisorbilde" src={frisorBildeArray[tilgjengeligeFrisorer.indexOf(frisor)]} alt={`Bilde av frisør ${frisor.navn}`} style={{height:"4rem"}}></img>
                    
                </div></div>}
                
            </div>
            </>:"Ingen tilgjengelige frisører for disse behandlingene"}
            <Fortsett disabled={(frisor !== null?false:true)} previous={1} number={2} displayKomponent={displayKomponent} referanceElement={referanceElement} />
        </div>
    )
}

export default React.memo(Frisor);