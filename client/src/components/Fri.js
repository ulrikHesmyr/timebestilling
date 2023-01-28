import React, {useState, useEffect} from 'react'
import { hentDato } from '../App';
import { minutterFraKlokkeslett } from './Klokkeslett';

function Fri ({env}) {
    const[visFriElementer, sVisFriElementer] = useState(false);
    const[leggTilFri, sLeggTilFri] = useState(false);
    const[dagsfraver, sDagsfraver] = useState(null);
    const [friElementer, sFriElementer] = useState([]);

    //Frisør som skal ha fri, uavhengig av om det er dagsfravær eller lengre tid
    const [frisor, sFrisor] = useState(null);

    //Dagsfravær
    const [datoDagsFraver, sDatoDagsFraver] = useState(hentDato());
    const [starttidspunkt, sStarttidspunkt] = useState("");
    const [slutttidspunkt, sSlutttidspunkt] = useState("");

    //Fri over en lenger periode
    const [startDato, sStartDato] = useState(hentDato());
    const [sluttDato, sSluttDato] = useState(hentDato());

    //Oppdaterer fri-elementer
    const [updateTrigger, sUpdateTrigger] = useState(false);

    

    //Skal kunne opprette fri for noen. Da trykker de på boksen med navnet til den frisøren som skal ha fri
    // Deretter velger de om det skal være "Flere dager" eller "Dagsfravær"
    //HVIS det er "Flere dager", så kan de velge en startdato og en sluttdato
    //HVIS det er "Dagsfravær", så kan de velge en dato, og deretter starttidspunkt og slutttidspunkt

    
    function reset(){
        sDatoDagsFraver(hentDato());
        sStarttidspunkt("");
        sSlutttidspunkt("");
        sSluttDato(hentDato());
        sStartDato(hentDato());
        sFrisor(null);
        sLeggTilFri(false);
        sDagsfraver(null);
    }

    async function hentFriElementer(){
        console.log("Hentet fri elementer");
        const request = await fetch("http://localhost:3001/env/fri");
        const response = await request.json();
        if(response){
            console.log("Alle fri elementer", response);
            sFriElementer(response);
        }
    }

    async function opprettFri(){

        const data = {
            lengreTid:(dagsfraver === "fler"),
            fraDato:startDato,
            tilDato:sluttDato,
            fraKlokkeslett:starttidspunkt,
            tilKlokkeslett:slutttidspunkt,
            friDag:datoDagsFraver,
            frisor:env.frisorer.indexOf(frisor),
            medarbeider:frisor.navn 
        }

        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }

        const request = await fetch("http://localhost:3001/env/opprettFri", options);
        const response = await request.json();
        if(response){
            console.log(response);
            sUpdateTrigger(!updateTrigger);
        }
    }


    useEffect(()=>{
        if(visFriElementer){
            console.log("Henter fri elementer");
            hentFriElementer();
        }
    },[visFriElementer, updateTrigger])
  return (
    <>
    <button onClick={(e)=>{
        e.preventDefault();
        sVisFriElementer(!visFriElementer);
    }}>
        FRIDAGER OG TIMER
    </button>
    {(visFriElementer?<div>
        {friElementer.map((friElement)=>
            (friElement.lengreTid?(
                <div>{friElement.medarbeider}{friElement.fraDato} - {friElement.tilDato}</div>
            ):(
                <div>{friElement.medarbeider}{friElement.friDag} {friElement.fraKlokkeslett}-{friElement.tilKlokkeslett}</div>
            ))
        )}

        {(!leggTilFri?<button onClick={(e)=>{
        e.preventDefault();
        sLeggTilFri(true);
    }}> <img src='leggtil.png' style={{height:"1.4rem"}}></img> Nytt fravær/fri</button>:"")}
    </div>:"")}
    {
    (leggTilFri?<>

    <button onClick={(e)=>{
        e.preventDefault();
        reset();
    }} > <img src='avbryt.png' style={{height:"1.4rem"}}></img> AVBRYT</button>
    
    <h3>Velg type fri:</h3>
    <div style={{display:"flex", flexDirection:"row"}}>
    <div onClick={()=>{
        sDagsfraver("dag");
    }} style={{cursor:"pointer", border:(dagsfraver === "dag"?"2px solid black":"thin solid black"), padding:"0.4rem", margin:"0.3rem", height:"2rem"}}>Dagsfravær</div>
    
    <div onClick={()=>{
        sDagsfraver("fler");
    }} style={{cursor:"pointer", border:(dagsfraver === "fler"?"2px solid black":"thin solid black"), padding:"0.4rem", margin:"0.3rem", height:"2rem"}}>Fri over flere dager</div>
    </div>
    {(dagsfraver === "dag" || dagsfraver === "fler"?<>
    <h4>Velg frisør som skal ha fri:</h4>
        <div style={{display:"flex",flexWrap:"wrap"}}>
        {env.frisorer.map((f)=>(
            <div style={{margin:"0.3rem",border:(frisor===f?"3px solid black":"thin solid black"),  cursor:"pointer", padding:"0.5rem", height:"1.4rem", width:"fit-content"}} onClick={()=>{
                sFrisor(f);
            }} key={f.navn}>{f.navn}</div>
        ))}
        </div></>:"")}
    {(dagsfraver === "dag"?
    <form style={{display:"flex", flexDirection:"column"}}>
        

    //HVIS det er "Dagsfravær", så kan de velge en dato, og deretter starttidspunkt og slutttidspunkt
    <input min={hentDato()} value={datoDagsFraver} onChange={(e)=>{
        sDatoDagsFraver(e.target.value);
    }} type="date"></input>
    {datoDagsFraver}
    <label>Start-tidspunkt: <input maxLength={5} placeholder='10:30' type="text" value={starttidspunkt} onChange={(e)=>{
        sStarttidspunkt(e.target.value);
    }} ></input> </label>
    <label>Slutt-tidspunkt: <input maxLength={5} placeholder='11:30' type="text" value={slutttidspunkt} onChange={(e)=>{
        sSlutttidspunkt(e.target.value);
    }} ></input> </label>

<button onClick={(e)=>{
    e.preventDefault();
    if(frisor !== null && parseInt(starttidspunkt.substring(3,5))%15 === 0 && parseInt(slutttidspunkt.substring(3,5))%15 === 0 && !isNaN(parseInt(starttidspunkt.substring(0,2)))&& !isNaN(parseInt(slutttidspunkt.substring(0,2))) && starttidspunkt.substring(2,3) == ":" && slutttidspunkt.substring(2,3) == ":" && minutterFraKlokkeslett(starttidspunkt) < minutterFraKlokkeslett(slutttidspunkt)){ 
        console.log(datoDagsFraver);
        console.log(starttidspunkt);
        console.log(slutttidspunkt);
        opprettFri();
        reset();
    } else {
        alert("Tidspunkt passer ikke formatet");
    }
}}>OPPRETT FRI/FRAVÆR</button>
    </form>:"")}


    {(dagsfraver === "fler"?<>
    
    //HVIS det er "Flere dager", så kan de velge en startdato og en sluttdato
    <div style={{display:"flex", flexDirection:"column"}}>
        <label>Fra: <input min={hentDato()} value={startDato} onChange={(e)=>{
            sStartDato(e.target.value);
            let startdatoen = new Date(`${e.target.value}`);
            let sluttdatoen = new Date(`${sluttDato}`);
            if(startdatoen > sluttdatoen){
                sSluttDato(e.target.value);
            }
        }} type="date"></input></label>
        <label>Til: <input min={startDato} value={sluttDato} onChange={(e)=>{
            sSluttDato(e.target.value);
        }} type="date"></input></label>
    </div>
    
<button onClick={(e)=>{
    e.preventDefault();
    if(frisor !== null && startDato !== sluttDato){ 
        opprettFri();
        reset();
    } else {
        alert("Velg frisør og ikke velg samme dato");
    }
}}>OPPRETT FRI/FRAVÆR</button>
    </>:"")}

    </>

    :"")}

    </>
  )
}

export default React.memo(Fri)