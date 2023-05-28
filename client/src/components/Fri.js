import React, {useState, useEffect} from 'react'
import { hentDato, hentMaaned } from '../App';
import { minutterFraKlokkeslett } from './Klokkeslett';

function Fri ({env, bestilteTimer, synligKomponent, varsle, lagreVarsel, varsleFeil}) {
    const[leggTilFri, sLeggTilFri] = useState(false);
    const[dagsfraver, sDagsfraver] = useState(null); //"fler" eller "dag"
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

    function sjekkForKrasj(){
        let funn = bestilteTimer.find((time)=>{
            if(dagsfraver === "dag"){
                if(time.medarbeider === frisor.navn && time.dato === datoDagsFraver && minutterFraKlokkeslett(starttidspunkt) <= minutterFraKlokkeslett(time.tidspunkt) && minutterFraKlokkeslett(time.tidspunkt) < minutterFraKlokkeslett(slutttidspunkt)){
                    return time;
                }
            } else {
                let timeDato = new Date(`${time.dato}`);
                let start = new Date(`${startDato}`);
                let slutt = new Date(`${sluttDato}`);
                if(time.medarbeider === frisor.navn && start <= timeDato && timeDato <= slutt){
                    return time;
                }
            }
            return false;
        })
        return funn?true:false
    }

    async function hentFriElementer(){
        const request = await fetch("/env/fri");
        const response = await request.json();
        if(response){
            sFriElementer(response);
        }
    }

    async function opprettFri(){
        try {
            lagreVarsel();

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
            credentials: 'include',
            body:JSON.stringify(data)
        }

        const request = await fetch("/env/opprettFri", options);
        const response = await request.json();
        if(response){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
         alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
         varsleFeil();   
        }
    }

    
    async function slettFri(frielementet){
        try {
            lagreVarsel();
        const data = {
            lengreTid:frielementet.lengreTid,
            fraDato:frielementet.fraDato,
            tilDato:frielementet.tilDato,
            fraKlokkeslett:frielementet.fraKlokkeslett,
            tilKlokkeslett:frielementet.tilKlokkeslett,
            friDag:frielementet.friDag,
            frisor:frielementet.frisor,
            medarbeider:frielementet.medarbeider 
        }

        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: 'include',
            body:JSON.stringify(data)
        }

        const request = await fetch("/env/slettFri", options);
        const response = await request.json();
        if(response){
            varsle();
            sUpdateTrigger(!updateTrigger);
        }
        } catch (error) {
          alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
        varsleFeil();   
        }
    }

    useEffect(()=>{
        if(synligKomponent === 2){
            hentFriElementer();
        }
    },[synligKomponent, updateTrigger])
  return (
    <>
    {(synligKomponent === 2?<div>
        <h3>Fridager og fravær</h3>
        
        {(!leggTilFri?<button style={{display:"flex", flexDirection:"row", alignItems:"center"}} onClick={(e)=>{
        e.preventDefault();
        sLeggTilFri(true);
        }}> <img alt='Opprett fri/fravær' src='leggtil.png' style={{height:"1.4rem"}}></img> Nytt fravær/fri</button>:"")}


        {friElementer.slice(0).reverse().map((friElement, index)=>
            (
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}} key={index}> {friElement.lengreTid? `${friElement.medarbeider}: ${parseInt(friElement.fraDato.substring(8,10))}. ${hentMaaned(parseInt(friElement.fraDato.substring(5,7)) -1)} - ${parseInt(friElement.tilDato.substring(8,10))}. ${hentMaaned(parseInt(friElement.tilDato.substring(5,7)) -1)}`:`${friElement.medarbeider}: ${parseInt(friElement.friDag.substring(8,10))}. ${hentMaaned(parseInt(friElement.friDag.substring(5,7)) -1)} ${friElement.fraKlokkeslett}-${friElement.tilKlokkeslett}`} <button onClick={(e)=>{
                    if(window.confirm("Er du sikker på at du vil slette dette elementet?")){
                        slettFri(friElement);
                    }
                }}><img alt='Slett fri-element' src='delete.png' style={{height:"1.4rem"}}></img></button> </div>
            )
        )}

    </div>:"")}
    {
    (leggTilFri?<div className='fokus'>
    
    <img alt='Avbryt' src='avbryt.png' className='lukk' onClick={(e)=>{
        e.preventDefault();
        reset();
    }} ></img>
    
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
    <h4>Velg ansatt som skal ha fri:</h4>
        <div style={{display:"flex",flexWrap:"wrap"}}>
        {env.frisorer.map((f)=>(
            <div style={{margin:"0.3rem",border:(frisor===f?"3px solid black":"thin solid black"),  cursor:"pointer", padding:"0.5rem", height:"1.4rem", width:"fit-content"}} onClick={()=>{
                sFrisor(f);
            }} key={f.navn}>{f.navn}</div>
        ))}
        </div></>:"")}
        <p>{frisor !== null?`Du har valgt: ${frisor.navn}`:""}</p>

    {(dagsfraver === "dag"?
    <form style={{display:"flex", flexDirection:"column"}}>
        
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
    
    if(frisor !== null && parseInt(starttidspunkt.substring(3,5))%15 === 0 && parseInt(slutttidspunkt.substring(3,5))%15 === 0 && !isNaN(parseInt(starttidspunkt.substring(0,2)))&& !isNaN(parseInt(slutttidspunkt.substring(0,2))) && starttidspunkt.substring(2,3) === ":" && slutttidspunkt.substring(2,3) === ":" && minutterFraKlokkeslett(starttidspunkt) < minutterFraKlokkeslett(slutttidspunkt)){ 
        let krasj = sjekkForKrasj();
        if(krasj){
            alert("Fri kolliderer med timereservasjon, finn et annet tidspunkt");
            return;
        } else {
            opprettFri();
            reset();
        }
    } else {
        alert("Tidspunkt passer ikke formatet");
    }
}}>OPPRETT FRI/FRAVÆR</button>
    </form>:"")}


    {(dagsfraver === "fler"?
    <>
    
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
    let krasj = sjekkForKrasj();
    if(krasj){
        alert("Fri kolliderer med timereservasjon, finn et annet tidspunkt");
        return
    }
    if(frisor !== null && startDato !== sluttDato){ 
        opprettFri();
        reset();
    } else {
        alert("Velg ansatt og ikke velg samme dato");
    }
}}>OPPRETT FRI/FRAVÆR</button>
    </>:"")}

    </div>

    :"")}

    </>
  )
}

export default React.memo(Fri)