import React, {useState, useEffect} from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import { hentMaaned } from '../App'
import {Link} from 'react-router-dom'

import {klokkeslettFraMinutter, minutterFraKlokkeslett} from '../components/Klokkeslett'

const localizer = momentLocalizer(moment);

function Vakter({env, bestilteTimer, bruker, varsle, lagreVarsel, varsleFeil}){
  
  const farger = ["darkblue", "cadetblue", "chartreuse", "coral", "mediumorchid", "indigo","red","black","purple","peru", "burylwood"];
  const ukedag = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
  const [ansatt, setAnsatt] = useState(env.frisorer.map(frisor=>frisor.navn));
  //timebestillinger og fri
  const [vakterTimebestillinger, sVakterTimebestillinger] = useState();
  
  //Redigere ansatt info
  const [visRedigerTelefonnummer, sVisRedigerTelefonnummer] = useState(false);
  const [visRedigerPassord, sVisRedigerPassord] = useState(false);
  const [visInnstillinger, sVisInnstillinger] = useState(false);
  const [visEndreEpost, sVisEndreEpost] = useState(false);
  const [aktivertEpost, sAktivertEpost] = useState(bruker.aktivertEpost);
  const [nyttTlf, sNyttTlf] = useState(bruker.telefonnummer);
  const [lagretTlf, sLagretTlf] = useState(bruker.telefonnummer);
  const [nyEpost, sNyEpost] = useState(bruker.epost);
  const [lagretEpost, sLagretEpost] = useState(bruker.epost);
  const [nyttPassord, sNyttPassord] = useState("");
  const [gjentaNyttPassord, sGjentaNyttPassord] = useState("");
  const [visNyttPassord, sVisNyttPassord] = useState(false);
  const [visGjentaPassord, sVisGjentaPassord] = useState(false);


  const [visDetaljer, sVisDetaljer] = useState(false);
  const [time, sTime] = useState();

  const [isMobile, setisMobile] = useState(false);
  useEffect(()=>{
    
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      setisMobile(true);
    }
    
    
    let hihi = env.frisorer.map(frisor=>frisor.navn);
    oppdaterSynligeElementer(hihi);
  },[]);

  async function endreVarlinger(){
    //Aktiverer eller deaktiverer epost varslinger i databasen
    try {
      lagreVarsel();
      const request = await fetch("/login/endreVarlinger", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({aktivertEpost: !aktivertEpost})
      });
      const response = await request.json();
      if(response && response.valid){
        varsle();
        sAktivertEpost(response.aktivertEpost)
      }
    } catch(erorr){
      varsleFeil();
      alert("Noe gikk galt, sjekk internettet og prøv igjen");
    }  
  }

  async function oppdaterSynligeElementer(a){
    try {
      
      const request = await fetch("/env/fri");
      const friElementer = await request.json();
      
      let frii = friElementer.map((element)=>{
      if(a.includes(element.medarbeider)){
        
        element.fri = true;
        if(element.lengreTid){
          element.start = new Date(`${element.fraDato}T00:30:00`);
          element.end = new Date(`${element.tilDato}T23:59:00`);
          element.title = `${element.medarbeider}`;
          element.color = "red";
          element.tidspunkt = "LANGFRI";
          return element;
        } else {
          element.start = new Date(`${element.friDag}T${element.fraKlokkeslett}:00`);
          element.end = new Date(`${element.friDag}T${element.tilKlokkeslett}:00`);
          element.title = `${element.medarbeider} - FRI`;
          element.color = "red";
          element.tidspunkt = element.fraKlokkeslett;
          element.slutt = element.tilKlokkeslett;
          return element;
        }
      } else {
        return undefined;
      }
      }).filter(x=>x);
      const v = bestilteTimer.map((time)=>{
      if(a.includes(time.medarbeider)){
        const gjeldendeTjenester = env.tjenester.filter(tjeneste => time.behandlinger.includes(tjeneste.navn)).reduce((total, element)=> total + element.tid, 0);
        time.start = new Date(`${time.dato}T${time.tidspunkt}:00`);
        time.end = new Date(`${time.dato}T${klokkeslettFraMinutter(gjeldendeTjenester+minutterFraKlokkeslett(time.tidspunkt))}:00`);
        time.slutt = klokkeslettFraMinutter(minutterFraKlokkeslett(time.tidspunkt)+gjeldendeTjenester);
        time.title = `${time.medarbeider.toUpperCase()}, ${time.behandlinger.join(", ")} Kunde: ${time.kunde}, tlf.: ${time.telefonnummer}`
        return time;
      }
      return undefined;
    }).filter(x=>x);

    
    let allevakter = v.concat(frii);
    sVakterTimebestillinger(allevakter);

    } catch (error) {
      alert("Noe gikk galt. Sjekk internettforbindelsen din og prøv igjen.");
      varsleFeil();
    }
    
  }

    const MIN_DATE = new Date(2020, 0, 1, 7, 0, 0); // 08:00
    const MAX_DATE = new Date(2020, 0, 1, 20, 0, 0); // 17:30

    let formats = {
      timeGutterFormat: 'HH:mm',
    }

    async function endreEpost(){
      try {
        lagreVarsel();
        //Endrer eposten til den ansatte i databasen

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({brukernavn: bruker.navn, nyEpost: nyEpost}),
        }
        const request = await fetch("/login/endreEpost", options);
        const response = await request.json();
        if(response){
          varsle();
          sVisEndreEpost(false);
          sLagretEpost(nyEpost);
        }
      } catch (error) {
        alert("Noe skjedde galt. Sjekk internettforbindelsen og prøv på nytt!");
        varsleFeil();
      }
    }

    async function oppdaterPassord(){
      try {
        //Oppdaterer passordet til brukeren (gjelder kun frisører her og ikke admin) i databasen ved å sende request til serveren
      lagreVarsel();
      const options = {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({passord: gjentaNyttPassord}),
        credentials:'include'
      };
      const request = await fetch("/login/oppdaterPassord", options);
      const response = await request.json();
      if(response){
        varsle();
        sVisRedigerPassord(false);
      }
      } catch (error) {
        alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen");
        varsleFeil();
      }
    }

    async function oppdaterTelefonnummer(){ 
      try {
        lagreVarsel();
      if(nyttTlf >= 40000000){
        //Sender en request til serveren for å endre telefonnummeret til den ansatte
        const options = {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({telefonnummer: nyttTlf}),
          credentials:'include'
        };

        const request = await fetch("/login/oppdaterTelefonnummer", options);
        const response = await request.json();
        if(response){
          varsle();
          sLagretTlf(nyttTlf);
        } 
      } else {
        alert("Telefonnummeret er ikke riktig format");
        sNyttTlf(lagretTlf);
      }
      } catch (error) {
        alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen");
        varsleFeil();
      }
    }

    return(
        <div className='vaktpanel'>
            <h3>Ditt vaktpanel</h3>
          <div style={{display:"flex", flexDirection:"row"}}>
          <p>Logget inn som: {bruker.navn}</p><button onClick={(e)=>{
            e.preventDefault();
            sVisInnstillinger(true);
            }}><img src="settings.png" alt="Innstillinger for ansatt" style={{height:"1.4rem"}}></img></button></div>
          
            {visInnstillinger?<div className='fokus'>
              <div onClick={()=>{
                sVisInnstillinger(false);
              }} className='lukk'></div>
              <h4>Logget inn som {bruker.navn}</h4>
            <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", alignItems:"center"}}>
            {visEndreEpost?<div className='fokus'>
              <h4>Endre epost-adresse</h4>
              <p>Epostadressen brukes til å motta varslinger på epost når noen reserverer time hos deg</p>
            Din epost: {lagretEpost}
              <label>Ny epost: <input onChange={(e)=>{
                sNyEpost(e.target.value);
              }} value={nyEpost}></input></label>
            <div>
              
              <button onClick={()=>{
                sVisEndreEpost(false);
                sNyEpost(lagretEpost);
              }}>Avbryt</button>
              <button onClick={()=>{
                sVisEndreEpost(false);
                endreEpost();
              }}>Lagre</button>
            </div>
            </div>:<>Din epost: {lagretEpost} <button onClick={()=>{
            sVisEndreEpost(true);
          }} ><img src="rediger.png" alt='rediger epost' style={{height:"1.4rem"}}></img></button></>}
            
            </div>
          
            
            {visRedigerTelefonnummer?<div className='fokus'>
              <h4>Endre telefonnummer</h4>
              <p>Telefonnummeret ditt lagres beskyttet og kryptert og brukes kun for tofaktorautentisering.</p>
            <label>Skriv inn nytt telefonnummer: +47<input inputMode="numeric" value={nyttTlf} maxLength={8} onChange={(e)=>{
              let newValue = e.target.value;
              if(/^\d*$/.test(newValue)){
                sNyttTlf(newValue);
              }
            }}></input> </label>
            <div>
            <button onClick={(e)=>{
              e.preventDefault();
              sVisRedigerTelefonnummer(false);
              sNyttTlf(lagretTlf);
            }}>Avbryt</button>
            <button onClick={(e)=>{
              e.preventDefault();
              sVisRedigerTelefonnummer(false);
              oppdaterTelefonnummer();
            }}>Lagre</button></div>
            </div>:<div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>Ditt telefonnummer: {lagretTlf} 
            <button onClick={(e)=>{
              //Redigerer telefonnummer
              e.preventDefault();
              sVisRedigerTelefonnummer(true);
            }}>
              <img src="rediger.png" alt="Rediger telefonnummer" style={{height:"1.4rem"}}></img>
            </button></div>  }
          
          
          <div>
          Rediger passord
          {visRedigerPassord?<>
          <div className='fokus'>
            <h4>Endre passord</h4>
            <p>Endre passordet som du bruker for å logge inn.</p>
          <label>Nytt passord: <input type={visNyttPassord?"text":"password"} onChange={(e)=>{
            sNyttPassord(e.target.value);
          }} value={nyttPassord}></input><input type="checkbox" onChange={()=>{
            sVisNyttPassord(!visNyttPassord);
          }}></input> </label>
          <label>Gjenta nytt passord: <input type={visGjentaPassord?"text":"password"} onChange={(e)=>{
            sGjentaNyttPassord(e.target.value);
          }} value={gjentaNyttPassord}></input><input type="checkbox" onChange={()=>{
            sVisGjentaPassord(!visGjentaPassord);
          }}></input></label>
          <div>
          <button onClick={()=>{sVisRedigerPassord(false); sNyttPassord(""); sGjentaNyttPassord("");}}>Avbryt</button>
          <button onClick={()=>{
            if(nyttPassord === gjentaNyttPassord){
              sVisRedigerPassord(false);
              sNyttPassord("");
              sGjentaNyttPassord("");
              oppdaterPassord();  
            } else {
              alert("Passordene er ikke like");
            }
          }} >Lagre</button></div>
          </div>
          </>:
          <button onClick={()=>{
            sVisRedigerPassord(true);
          }} ><img src="rediger.png" alt='rediger passord' style={{height:"1.4rem"}}></img></button>
          }</div>

          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>Varslinger (epost) for timebestilling: {aktivertEpost? <div style={{color:"green", padding:"0.2rem", display:"flex", alignItems:"center"}}>Aktivert <button onClick={()=>{
            if(window.confirm("Er du sikker på at du vil deaktivere varslinger på epost?")){
              endreVarlinger();
            }
          }}>Deaktiver</button></div>:<div style={{color:"red", padding:"0.2rem", display:"flex", alignItems:"center"}}>Deaktivert<button onClick={()=>{
            if(window.confirm("Er du sikker på at du vil aktivere varslinger på epost?")){
              endreVarlinger();
            }
          }}>Aktiver</button></div>}</div>
          

           </div>:""}
           <h3>Bestille time:</h3>
           <p>Dersom kunder bestiller time enten muntlig, over telefon eller over sosiale medier, så legg inn bestillingen i systemet for vedkommende via timebestillingen her på siden. Link: <Link to="/timebestilling">BESTILL TIME</Link> </p>
          <h3>Velg vakter for:</h3>
          <p>Trykk på navn til medarbeider for å vise timebestillinger for vedkommende.</p>
        <div className='velgFrisorVakter'>
        {env.frisorer.map((frisorElement)=>(
          <div key={frisorElement.navn} style={{border:(ansatt === frisorElement.navn? "2px solid black":"none"), backgroundColor:farger[env.frisorer.indexOf(frisorElement)], userSelect:"none"}} onClick={()=>{
            setAnsatt(frisorElement.navn);
            oppdaterSynligeElementer(frisorElement.navn);
          }} >{frisorElement.navn}</div>
        ))}
        <div style={{color:"black", borderBottom:"thin solid black"}} onClick={()=>{
            let alleFrisorenesNavn = env.frisorer.map(frisor=>frisor.navn);
            setAnsatt(alleFrisorenesNavn);
            oppdaterSynligeElementer(alleFrisorenesNavn);
          }} >ALLE</div>
        </div>
        <h3>Timebestillinger</h3>
        <p>Nedenfor er alle timebestillingene. Trykk på en timebestilling for å vise detaljer. </p>
        
        <Calendar format={"DD/MM/YYYY HH:mm"}
        components={{
            event: ({event}) => (
              <div onClick={()=>{
                if(!event.fri){
                  sTime(event);
                  sVisDetaljer(true);
                }
                console.log(event);
              }}>
                {event.lengreTid?`${event.tidspunkt} - ${event.title}` :`${event.tidspunkt}-${event.slutt}: ${event.title}`}
              </div>
            )
          }}
        formats={formats}
        min={MIN_DATE} max={MAX_DATE} events={vakterTimebestillinger} defaultDate={new Date()} defaultView="day" 
        views={["agenda", "day","week","month"]}
        localizer={localizer} startAccessor="start" endAccessor="end" style={{height:(isMobile?"150vh":"100vh"), margin:"5px"}}
        eventPropGetter={event => {
          return {
            style:{ 
              backgroundColor: farger[env.frisorer.map(f=>f.navn).indexOf(event.medarbeider)],
              padding:"0.05rem"
            },
            className: 'eventWrapper'

          };
        }}/> 
        {visDetaljer && <div className='fokus'>
          <div onClick={()=>{
            sVisDetaljer(false);
          }} className='lukk'></div>

            <h4>{ukedag[new Date(time.dato).getDay() -1]} {parseInt(time.dato.substring(8,10))}. {hentMaaned(parseInt(time.dato.substring(5,7)) -1)} {time.tidspunkt} - {time.slutt}</h4> 
            
            <div>
              <strong>Medarbeider:</strong>
              <p> {time.medarbeider}</p>
            </div>
            <hr></hr>
            <div>
              <strong>Kunde:</strong>
              <p>{time.kunde} tlf.: {time.telefonnummer}</p> 
            </div>
            <hr></hr>
            <div>
              <strong>Behandlinger: </strong>
              {env.tjenester.filter(t=>time.behandlinger.includes(t.navn)).map((t)=>{return <p>{t.kategori} - {t.navn}</p>})}
            </div>
            
            
          </div>}
        </div>
    )
}

export default React.memo(Vakter);