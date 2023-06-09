import React, {useRef} from "react";
import { hentDato } from "../App";
import Fortsett from "./Fortsett";

function Frisor({tilgjengeligeFrisorer, sDatoForsteLedige, sDato, sMidlertidigDato, displayKomponent, klokkeslettet, sKlokkeslett ,frisor, sFrisor}){

    const valgtFrisorBoks = useRef(null);
    const referanceElement = useRef(null);

    return(
        <div>
            {tilgjengeligeFrisorer.length > 0?<>
            <div className="forsteLedige" tabIndex={0} aria-label="Velg første ledige medarbeider" onClick={()=>{
                sFrisor(false);
                sDatoForsteLedige(null);
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
                        sDatoForsteLedige(null);
                        sDato(hentDato());
                        sMidlertidigDato(hentDato());
                        valgtFrisorBoks.current.scrollIntoView({behavior:"smooth", block:"center"});
                        if(klokkeslettet != null){
                            sKlokkeslett(null);
                        }
                    }
    
                    }}
                style={{ textDecoration:frisor === false?"underline":"none", cursor:"pointer", padding:"0.8rem", width:"fit-content", color:"var(--color3)", borderRadius:"0.4rem", border:"thin solid black", backgroundColor:"white"}}>
                    
                    Første ledige medarbeider
                </div>
                
            <div className="frisorene">
            
                {tilgjengeligeFrisorer.map((element, index)=>(<div tabIndex={0} role="button" className="frisor" 
                key={element.navn} aria-label={`Velg medarbeider med navn ${element.navn}`} onClick={()=>{
                    sFrisor(element);
                    sDatoForsteLedige(null);
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
                        sDatoForsteLedige(null);
                        sDato(hentDato());
                        sMidlertidigDato(hentDato());
                        valgtFrisorBoks.current.scrollIntoView({behavior:"smooth", block:"center"});
                        if(klokkeslettet != null){
                            sKlokkeslett(null);
                        }
                    }

                }}
                style={{ textDecoration:frisor === element?"underline":"none"}}>
                    <img className="velgmedarbeider" src={`${window.origin}/uploads/${element.img}`} alt={`Bilde av medarbeider ${element.navn}`}></img>
                    {element.navn}
                    
                </div>))}
            </div>
            <div className="valgtFrisorTekst">
            {frisor === false && "Du har valgt: Første ledige medarbeider"}
            <div ref={valgtFrisorBoks} ></div>
            {frisor !== null && frisor !== false && <div >Du har valgt:<div
                key={frisor.navn} style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                     {frisor.navn}
                    <img className="velgmedarbeider" style={{height:"6rem"}} src={`${window.origin}/uploads/${frisor.img}`} alt={`Bilde av medarbeider ${frisor.navn}`}></img>
                    
                </div></div>}
                
            </div>
            </>:(tilgjengeligeFrisorer.length < 1?"Ingen tilgjengelige medarbeidere for disse behandlingene":<div className="laster"></div>)}
            <Fortsett disabled={(frisor !== null?false:true)} previous={1} number={2} displayKomponent={displayKomponent} referanceElement={referanceElement} />
        </div>
    )
}

export default React.memo(Frisor);