import React, {useState, useEffect} from "react";
import Fortsett from "./Fortsett";

function Frisor({tilgjengeligeFrisorer, env, synligKomponent, displayKomponent, produkt, klokkeslettet, sKlokkeslett ,frisor, sFrisor}){

    const [frisorBildeArray, sFrisorBildeArray] = useState(null);
    useEffect(()=>{
        //Lager et array med base64 bilder
        let midlertidigArray = [];
        for(let i = 0; i < env.frisorer.length; i++){
            const array = new Uint8Array(env.frisorer[i].img.data.data);
            const base = window.btoa(String.fromCharCode.apply(null, array));
            const base64Image = `data:${env.frisorer[i].img.contentType};base64,${base}`;

            //const base64Image = `data:${env.frisorer[i].img.contentType};base64,${window.btoa(env.frisorer[i].img.data.data)}`;
            midlertidigArray.push(base64Image);
        }
        sFrisorBildeArray(midlertidigArray);
    }, [tilgjengeligeFrisorer])
    return(
        <div className={synligKomponent === 1? 'animer-inn':""}>
            {tilgjengeligeFrisorer.length > 0?<>
            <div onClick={()=>{
                sFrisor(false);
                if(klokkeslettet != null){
                    sKlokkeslett(null);
                }

                }} style={{border: frisor === false?"3px solid black":"thin solid black", cursor:"pointer", padding:"0.5rem", width:"fit-content"}}>
                    
                    Første ledige frisør
                </div>
                
            <div className="frisorene">
            
                {frisorBildeArray !== null? tilgjengeligeFrisorer.map((element, index)=>(<div className="frisor" 
                key={element.navn} onClick={()=>{
                    sFrisor(element);
                    if(klokkeslettet != null){
                        sKlokkeslett(null);
                    }

                }} style={{border: frisor === element?"3px solid black": "thin solid black"}}>
                    <img className="frisorbilde" src={frisorBildeArray[index]} alt={`Bilde av frisør ${element.navn}`} style={{height:"4rem"}}></img>
                    {element.navn}
                    
                </div>)):""}
            </div></>:"Ingen tilgjengelige frisører for disse behandlingene"}
            <Fortsett disabled={(frisor !== null?false:true)} number={2} displayKomponent={displayKomponent} />
        </div>
    )
}

export default React.memo(Frisor);