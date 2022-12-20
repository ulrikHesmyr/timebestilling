import React, {useState,useEffect, useRef} from 'react'
import Tjenester from '../components/Tjenester';

export default function Timebestilling(){

    const [dato, setDato] = useState(null);
    const tjenesteliste = useRef(null);
    

    return (
    <div className='timebestilling'>
    <h1>Velg din time</h1>
    <input type="date" min={hentDato()} onChange={(e)=>{
        setDato(e.target.value);
        tjenesteliste.current.scrollIntoView({
            behavior:'smooth',
            block:'end'
        })
    }}></input>
    <p>{(dato != null?`Din valgte dato er ${dato.substring(8,10)}. ${hentMaaned(parseInt(dato.substring(5,7)) -1)}`:"")}</p>
    <div ref={tjenesteliste}>
        {(dato!=null? <Tjenester/>:"")}
    </div>
    
    </div>
        )
}

export function Kvittering(){

    return (
        <>
        <p>Kvittering</p>
        </>
    )
}


function hentDato(){ //Hvilket format true=yyyy-mm-dd, false=["dd","mm","yyyy"]
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return (`${year}-${month}-${day}`);
    
}

function hentMaaned(maanedInt){
    
    switch(maanedInt){
        case 0: return "Januar"
        case 1: return "Februar"
        case 2: return "Mars"
        case 3: return "April"
        case 4: return "Mai"
        case 5: return "Juni"
        case 6: return "Juli"
        case 7: return "August"
        case 8: return "September"
        case 9: return "Oktober"
        case 10: return "November"
        case 11: return "Desember"
        default: return ""
    }
}