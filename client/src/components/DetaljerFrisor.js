import React, {useState, useEffect} from 'react'
import {hentDato} from '../App'
import { minutterFraKlokkeslett, klokkeslettFraMinutter } from './Klokkeslett';
function DetaljerFrisor({env, bruker, frisor, varsle, lagreVarsel, varsleFeil, sUpdateTrigger, updateTrigger}){

    const [visDetaljer, sVisDetaljer] = useState(false);

    
    //Frisører
    const [visRedigerFrisor, sVisRedigerFrisor] = useState(false);  
    const [oppsigelsesDato, sOppsigelsesDato] = useState(new Date());
    const [ikkeSiOpp, sIkkeSiOpp] = useState((frisor.oppsigelse === "Ikke oppsagt")?true:false);
    const [bildeAvFrisor, sBildeAvFrisor] = useState(null);
    const [preview, sPreview] = useState(null);
    const [visRedigerTelefonAnsatt, sVisRedigerTelefonAnsatt] = useState(false);
    const [telefonAnsatt, sTelefonAnsatt] = useState();
    const [nyTelefonAnsatt, sNyTelefonAnsatt] = useState();
    const [epostAnsatt, sEpostAnsatt] = useState();
    const [visRedigerTittelOgBeskrivelse, sVisRedigerTittelOgBeskrivelse] = useState(false);
    const [tittel, sTittel] = useState(frisor.tittel);
    const [beskrivelse, sBeskrivelse] = useState(frisor.beskrivelse);
    const [paaJobb, sPaaJobb] = useState(frisor.paaJobb.map(obj => ({ ...obj })));
    const [nyPause, sNyPause] = useState("06:00");
    const [nyPauseDag, sNyPauseDag] = useState("Søndag");

    //Viser redigeringssider
    const [visRedigerBehandlinger, sVisRedigerBehandlinger] = useState(false);     
    const [visSiOpp, sVisSiOpp] = useState(false);     
    const [visRedigerBilde, sVisRedigerBilde] = useState(false);
    const [visRedigerPaaJobb, sVisRedigerPaaJobb] = useState(false);
    const [visGiAdmin, sVisGiAdmin] = useState(false);
    const [visGiAdminKnapp, sVisGiAdminKnapp] = useState(false);
    const [visEndrePauser, sVisEndrePauser] = useState(false);
    const [leggTilPauseSynlig, sLeggTilPauseSynlig] = useState(false);

    
    let pauseTidspunkter = [];
    for(let i = minutterFraKlokkeslett("06:00"); i < minutterFraKlokkeslett("22:00"); i += 15){
        pauseTidspunkter.push(klokkeslettFraMinutter(i));
    }
    

    //Nye behandlinger
    const [frisorTjenester, setFrisortjenester] = useState(frisor.produkter); //Skal være indekser, akkurat som i databasen

    
    useEffect(() => {
      hentAdminInfo(frisor.navn);
    }, [frisor.navn, updateTrigger])

    //Oppdaterer pausetider
    async function oppdaterPaaJobb(p){
      try {

      lagreVarsel();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({navn:frisor.navn, paaJobb:p})
      }
      const request = await fetch("/env/oppdaterPaaJobb", options);
      const response = await request.json();
      if(response){
        varsle();
        sUpdateTrigger(!updateTrigger);
      } else {
        alert("Noe gikk galt, prøv på nytt");
      }
      } catch (error) {
        alert("Noe gikk galt. Sjekk internettforbindelsen og prøv på nytt");
        varsleFeil();
      }
    }

    async function leggTilPause(){
      try {
        lagreVarsel();
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({navn:frisor.navn, pause:nyPause, dag:nyPauseDag})
        }
        const request = await fetch("/env/leggTilPause", options);
        const response = await request.json();
        if(response){
          varsle();
          sUpdateTrigger(!updateTrigger);
        } 
        } catch (error) {
          alert("Noe gikk galt. Sjekk internettforbindelsen og prøv på nytt");
          varsleFeil();
        }
    }

    //Fjerner pause en gitt dag for vilkårlig ansatt
    async function fjernPause(pause, dag, navn){
      try {
        lagreVarsel();
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({navn:navn, pause:pause, dag:dag})
        }
        const request = await fetch("/env/fjernPause", options);
        const response = await request.json();
        if(response){
          varsle();
          sUpdateTrigger(!updateTrigger);
        } 
        } catch (error) {
          alert("Noe gikk galt. Sjekk internettforbindelsen og prøv på nytt");
          varsleFeil();
        }
    }

    //Oppdaterer tittel og beskrivelse for ansatt
    async function oppdaterTittelOgBeskrivelse(){
      try {
        
      lagreVarsel();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({navn:frisor.navn, tittel:tittel, beskrivelse:beskrivelse})
      }
      const request = await fetch("/env/oppdaterTittelOgBeskrivelse", options);
      const response = await request.json();
      if(response){
        varsle();
        sUpdateTrigger(!updateTrigger);
      } else {
        alert("Noe gikk galt, prøv på nytt");
      }
      } catch (error) {
        alert("Noe gikk galt. Sjekk internettforbindelsen og prøv på nytt");
        varsleFeil();
      }
    }

    
      //Henter info om ansatt er admin, epost og telefonnummer 
      async function hentAdminInfo(n){
        try {
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({brukernavn:n}),
                credentials:'include'

            }
            const request = await fetch("/env/hentAdminInfo", options);
            const response = await request.json();
            if(response){
              sVisGiAdminKnapp(!response.admin);
              sTelefonAnsatt(response.tlf);
              sEpostAnsatt(response.epost);
              sNyTelefonAnsatt(response.tlf);
              //Trenger ikke sUpdatetrigger
            }
        } catch (error) {
            varsleFeil();
            alert("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
        }
    } 
    //Gir admin-tilgang til vedkommende
    async function giAdmin(n){
      lagreVarsel();
      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({navn:n})

        }
        const request = await fetch("/env/giAdmin", options);
        const response = await request.json();
        if(response){
          varsle();
          sUpdateTrigger(!updateTrigger);
        } else {
          alert("Noe gikk galt, sjekk internettforbindelsen og prøv på nytt");
        }
      } catch (error) {
        varsleFeil();
        alert("Noe gikk galt, sjekk internettforbindelsen og prøv på nytt");
      }
    }

    //Oppdaterer en ansatt sitt telefonnummer
    async function oppdaterTelefonAnsatt(){
      try {
        
      lagreVarsel();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({navn:frisor.navn, telefon: nyTelefonAnsatt})
      }
      const request = await fetch("/env/oppdaterTelefonAnsatt", options);
      const response = await request.json();
      if(response){
        varsle();
        //sUpdateTrigger(!updateTrigger); Trenger ikke pga ikke noe med env å gjøre
      } else {
        alert("Noe gikk galt, prøv på nytt");
      }
      } catch (error) {
        alert("Noe gikk galt. Sjekk internetttilkoblingen din og prøv på nytt");
        varsleFeil();
      }
    }


    async function oppdaterBilde(navn){
      try {
        
        lagreVarsel();
        //Oppdaterer bilde i databasen ved å sende bildet og navn som new FormData()
        let formData = new FormData();
        formData.append("uploaded_file", bildeAvFrisor);
        formData.append("navn", navn);

        const options = {
          method: 'POST',
          credentials: 'include',
          body: formData
        }

        const request = await fetch("/env/oppdaterBildeFrisor/" + navn, options);
        const response = await request.json();
        if(response.m){
          alert(response.m);
        } else if(response.valid){
          varsle();
          sUpdateTrigger(!updateTrigger);
        } else {
          alert("Noe gikk galt, prøv på nytt");
        }
      } catch (error) {
        alert("Bilde er for stort eller på feil format. Prøv et bilde på png eller jpg format og mindre enn 2MB");
        varsleFeil();

      }
      
    }

    async function siOppFrisor(){ 

      lagreVarsel();
      try {
        
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({navn: frisor.navn, ikkeSiOpp:ikkeSiOpp, dato:oppsigelsesDato})
        }
        const request = await fetch("/env/siOppFrisor", options);
        const response = await request.json();

        if(response.valid){  
          varsle();
          sUpdateTrigger(!updateTrigger);
        }

      } catch (error) {
        alert("Noe gikk galt, sjekk internettforbindelsen og prøv på nytt");
        varsleFeil();
      }
      sVisRedigerFrisor(false);
      sVisSiOpp(false);
    }

    //endre her 
    async function oppdaterBehandlinger(){
      //Oppdaterer behandlinger i databasen
      lagreVarsel();
      try {

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({navn:frisor.navn, behandlinger:frisorTjenester})
        }
        const request = await fetch("/env/oppdaterBehandlingerFrisor", options);
        const response = await request.json();
        if(response.valid){
          varsle();
          sUpdateTrigger(!updateTrigger);
        } else {
          alert("Noe gikk galt, prøv på nytt");
        }
      }
      catch (error) {
        alert("Noe gikk galt, sjekk internettforbindelsen og prøv på nytt");
        varsleFeil();
      }
      
      
    }

    async function resetPassord(navn){
      try {
        
      lagreVarsel();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({navn:navn.toLowerCase()})
      }
      const request = await fetch("/login/resetPassord", options);
      const response = await request.json();
      if(response.valid){
        varsle();
        sUpdateTrigger(!updateTrigger);
      }
      } catch (error) {
        alert("Noe gikk galt, sjekk internetttilkoblingen din og prøv på nytt");
        varsleFeil();
      }
    }
    
  return (
    <>
    
    <div onClick={()=>{
          sVisDetaljer(!visDetaljer);
      }}  style={{display:"flex", height:"3rem", fontSize:"larger", flexDirection:"row", alignItems:"center", margin:"0.7rem",padding:"0.3rem", cursor:"pointer", borderLeft:"thin solid rgba(0,0,0,0.4)"}}>
      <img className='ikonKnapper' src='detaljer.png' alt="Detaljer om ansatt"></img>
      <div style={{padding:"0.3rem"}}>{frisor.navn} </div>
      <img className='frisorbilde' src={`${window.origin}/uploads/${frisor.img}`} alt={`Bilde av ${frisor.navn}`}></img>
    </div>
    

    {visDetaljer?<div className='fokus'>
    <div className='lukk' onClick={()=>{
      sVisDetaljer(false);
    }}></div>
    <div>
    <div>
          <h3 style={{margin:"0"}}>{frisor.navn}</h3>
          {tittel}
      </div>
      <p>{beskrivelse}</p>
      <img className='frisorbilde' src={`${window.origin}/uploads/${frisor.img}`} alt={`Bilde av ${frisor.navn}`}></img>
    </div>

      <div style={{fontSize:"small"}}>
        <h3>Info om ansatt: </h3>
        E-post: {epostAnsatt}<br></br>
        Telefon: {telefonAnsatt}
      <ul>
        <h3>Behandlinger: </h3>
        {env.tjenester.filter((tjeneste)=>frisorTjenester.includes(tjeneste.navn)).map((element)=>(<li key={element.navn}>{element.navn}</li>))}
      </ul>
      <ul>
        <h3>På jobb: </h3>
        {paaJobb.map((dag)=>(<li key={dag.dag}>{dag.dag}: {dag.stengt?"ikke på jobb":`${dag.open} - ${dag.closed}`}</li>))}
        <h3>Pauser: </h3>
        {paaJobb.map((dag)=>{if(dag.pauser.length > 0) return <p key={dag.dag}>{dag.dag}{dag.pauser.map((p)=>{
          
          return <li key={p}>{p}</li>  
        })}</p>})}
      </ul>
      </div>
      
      <div>{frisor.oppsigelse !== "Ikke oppsagt"?`Dato for oppsigelse: ${frisor.oppsigelse}`:""}</div>
      

      {visRedigerFrisor?
        <div style={{border:"thin solid black", display:"flex", flexDirection:"column", alignItems:"flex-end"}}>
          
          <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            
          <div style={{margin:"0.5rem"}}>Velg hva du vil redigere for ansatt: <p style={{fontWeight:"bolder", fontSize:"larger"}}>{frisor.navn}</p></div>
            <img alt='Lukk' onClick={(e)=>{
                e.preventDefault();
                sVisRedigerFrisor(false);
            }} src='avbryt.png' style={{cursor:"pointer", width:"3rem", height:"3rem"}}></img>
          </div>

          <div style={{width:"100%", boxSizing:"border-box"}}>
                   
              
              <button onClick={(e)=>{
                          e.preventDefault();
                          sVisRedigerBehandlinger(true);
                          
              }}>Rediger behandlinger</button>

              <button onClick={()=>{
                sVisRedigerBilde(true);
              }}>Oppdater bilde</button>

              {visGiAdminKnapp? <button onClick={()=>{
                sVisGiAdmin(true);
              }}>Gi admin-tilgang</button>:""}

              <button onClick={()=>{
                sVisRedigerPaaJobb(true);
              }}>Rediger "på jobb"-tider</button>

              <button onClick={()=>{
                sVisEndrePauser(true);
              }}>Endre pauser</button>

              
              <button onClick={()=>{
                sVisRedigerTittelOgBeskrivelse(true);
              }}>Rediger tittel eller beskrivelse</button>

              
              <button style={{background:"yellow"}} onClick={()=>{
                sVisRedigerTelefonAnsatt(true);
              }}>Endre telefonnummer</button>

              {bruker.navn.toLowerCase() !== frisor.navn.toLowerCase()? <button style={{backgroundColor:"red", color:"white"}} onClick={()=>{
                //Resetter passord til ansatt
                if(window.confirm("Er du sikker på at du vil resette passordet til " + frisor.navn + "? Passordet blir satt til samme som brukernavnet")){
                  sVisRedigerFrisor(false);
                  resetPassord(frisor.navn);
                }
              }} >Resett innloggings-passord for {frisor.navn}</button>:""}

               
              <button onClick={(e)=>{
                          e.preventDefault();
                          //slettFrisor(frisor.navn);
                          sVisSiOpp(true);
                          if(frisor.oppsigelse !== "Ikke oppsagt"){
                              sOppsigelsesDato(frisor.oppsigelse);
                          }
              }}>{frisor.oppsigelse === "Ikke oppsagt"?"Legg inn dato for oppsigelse":"Rediger oppsigelse"}</button>

            </div>   

            {visEndrePauser && <div className='fokus'>
              <div onClick={()=>{sVisEndrePauser(false)}} className='lukk'></div>
              <h4>Endre pauser for {frisor.navn}</h4>
              <p>Her kan du fjerne eller legge til pauser for {frisor.navn}. Pausene varer i 15 minutter</p>
              {paaJobb.map(dag=>{
                if(dag.pauser.length > 0) return (<ul key={dag.dag}>{dag.dag}
                {dag.pauser.map(p=>{
                    return (<li key={p} style={{padding:"0.5rem", display:"flex", flexDirection:"row", alignItems:"center"}}>{p} <img onClick={(e)=>{
                        e.preventDefault();
                        if(window.confirm("Ønsker du å slette denne pausen?")){
                          let nyPaaJobb = [...paaJobb];
                          nyPaaJobb.forEach(d=>{
                            if(d.dag === dag.dag){
                              d.pauser = d.pauser.filter(pause=>pause !== p);
                            }
                          })
                          sPaaJobb(nyPaaJobb);
                          //Fjerner en pause fra ansattes pauser
                          fjernPause(p, dag.dag, frisor.navn);
                        }
                    }} alt="Fjern pause" src="delete.png" className='ikonKnapper'></img></li>)
                })}
                
                </ul>)
            })}

            {leggTilPauseSynlig? <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
            <h4>Velg dag og tid for pausen</h4>
            <label>Velg dag for pausen: <select value={nyPauseDag} onChange={(e)=>{
                sNyPauseDag(e.target.value);
            }}>
                {paaJobb.map(dag=>{
                    return (<option key={dag.dag} value={dag.dag}>{dag.dag}</option>)
                })}
            </select></label>
            <label>Velg pausens tidspunkt:
                        <select value={nyPause} onChange={(e)=>{
                            sNyPause(e.target.value);
                        }}>
                            {pauseTidspunkter.map((tidspunkt)=>{
                                return <option key={tidspunkt} value={tidspunkt}>{tidspunkt}</option>
                            })}
                            
                        </select>
                    </label>
                    <p>Legg til pause {nyPauseDag} klokken {nyPause}</p>
            <div>
              <button onClick={()=>{
                sLeggTilPauseSynlig(false);
              }}>Avbryt</button>
              <button onClick={(e)=>{

              e.preventDefault();
              sLeggTilPauseSynlig(false);
              const nyPaaJobb = [...paaJobb];
              let index = nyPaaJobb.findIndex((d)=>d.dag === nyPauseDag);
              nyPaaJobb[index].pauser.push(nyPause);
              sPaaJobb(nyPaaJobb);
              leggTilPause();
              }}>Bekreft</button></div>
            </div>:<button onClick={()=>{
              sLeggTilPauseSynlig(true);
            }}><img alt="Legg til pause" src="leggtil.png" className='ikonKnapper'></img> Legg til pause</button>}
            </div>}


            {visGiAdmin?<div className='fokus'>
              <div onClick={()=>{
                sVisGiAdmin(false);
              }} className='lukk'></div>
              <h4>Gi admin-tilgang: </h4>
              <p>NB! Denne handlingen er ikke reverserbar. (Man kan ikke fjerne admin tilgang etter man har gitt den til vedkommende, 
                dersom det fremdeles er ønsket å fjerne admin-tilgang av forskjellige grunner, så kontakt databehandler (Ulrik))
                
              </p>
              <button onClick={()=>{
                if(window.confirm("Er du sikker på at du vil gi " + frisor.navn + " admin-tilgang?")){
                  giAdmin(frisor.navn.toLowerCase());
                  sVisGiAdmin(false);
                }
              }}>Gi admin-tilgang</button>
            </div>:""}

            {visRedigerBilde?<div className='fokus'>
            <h4>Last opp nytt bilde: </h4>
              <label style={{display:"flex", alignItems:"center"}}>Last opp bilde av ansatt: <input accept="image/*" onChange={(e)=>{
              sBildeAvFrisor(e.target.files[0]);
              sPreview(e.target.files[0]);
              }} type="file" name="uploaded_file"></input>Last opp bilde her: Maks 2mb {preview && <img className='frisorbilde' style={{height:"300px"}} alt='Forhåndsvisning av bildet' src={preview}></img>}</label>
      
      <div>
        <button onClick={(e)=>{
          e.preventDefault();
          sVisRedigerBilde(false);
          sBildeAvFrisor(null);
        }}>Avbryt</button>
        <button onClick={(e)=>{
          e.preventDefault();
          if(bildeAvFrisor){  
            oppdaterBilde(frisor.navn.toLowerCase());
            sBildeAvFrisor(null);
            sVisRedigerBilde(false);
          }
        }}>Lagre</button>
      </div>
            </div>:<></>}

            {visRedigerTittelOgBeskrivelse?<div className='fokus'>
              <h4>Rediger tittel og/eller beskrivelse for {frisor.navn}</h4>
              <label>Tittel: <input type="text" value={tittel} onChange={(e)=>{
                e.preventDefault();
                sTittel(e.target.value);
              }}></input></label>
              <label>Beskrivelse: <textarea value={beskrivelse} onChange={(e)=>{
                e.preventDefault();
                sBeskrivelse(e.target.value);
              }}></textarea></label>
              <div>
                <button onClick={(e)=>{
                  e.preventDefault();
                  sVisRedigerTittelOgBeskrivelse(false);
                  sTittel(frisor.tittel);
                  sBeskrivelse(frisor.beskrivelse);
                }}>Avbryt</button>
                <button onClick={(e)=>{
                  e.preventDefault();
                  oppdaterTittelOgBeskrivelse();
                  sVisRedigerTittelOgBeskrivelse(false);
                }}>Lagre</button>
              </div>
            </div>:<></>}

            {visRedigerPaaJobb?<div className='fokus'>

            <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
            <div>
                <h4>Rediger "på jobb"-tider for {frisor.navn}</h4>
                <p>Endre på tidene hvor ansatt er på jobb. Dette gjør at kunder kun kan reservere time når ansatt er på jobb. Se åpningstidene til butikken for referanse</p>
                {env.klokkeslett.map((dag, index)=>{
                    return (
                        <div key={dag.dag}>{dag.dag} {dag.open} - {dag.closed}</div>
                    )
                })}
              </div>
              <div>
              {paaJobb.map((dag, index)=>{
            return (
                <div style={{display: "flex", alignItems: "center"}} key={dag.dag}>{dag.dag}
                    <input type="checkbox" onChange={(e)=>{
                        const nyPaaJobb = [...paaJobb];
                        nyPaaJobb[index].stengt = e.target.checked;
                        sPaaJobb(nyPaaJobb);
                    }} checked={dag.stengt} disabled={env.klokkeslett[index].stengt}></input>
                    
                    <input disabled={env.klokkeslett[index].stengt || paaJobb[index].stengt} onChange={(e)=>{
                        let detteKlokkeslettet = e.target.value;
                        let klMinutter = minutterFraKlokkeslett(detteKlokkeslettet);
                        
                        if(klMinutter < minutterFraKlokkeslett(dag.closed)  && klMinutter >= minutterFraKlokkeslett(env.klokkeslett[index].open) && klMinutter <= minutterFraKlokkeslett(env.klokkeslett[index].closed)  && klMinutter % 15 === 0){
                            const nyPaaJobb = [...paaJobb];
                            nyPaaJobb[index].open = detteKlokkeslettet;
                            sPaaJobb(nyPaaJobb);
                        } else {
                            alert("Klokkeslettet må være før ansatt er ferdig på jobb");
                        }
                    }} type='time' step="1800" min={env.klokkeslett[index].open} max={dag.closed} value={env.klokkeslett[index].stengt?undefined:dag.open}></input> 
                    
                    - 
                    
                    <input disabled={env.klokkeslett[index].stengt || paaJobb[index].stengt} onChange={(e)=>{
                        let detteKlokkeslettet = e.target.value;
                        let klMinutter = minutterFraKlokkeslett(detteKlokkeslettet);

                        if(klMinutter > minutterFraKlokkeslett(dag.open) && klMinutter >= minutterFraKlokkeslett(env.klokkeslett[index].open) && klMinutter <= minutterFraKlokkeslett(env.klokkeslett[index].closed) && klMinutter % 15 === 0){
                            const nyPaaJobb = [...paaJobb];
                            nyPaaJobb[index].closed = detteKlokkeslettet;
                            sPaaJobb(nyPaaJobb);
                        } else {
                            alert("Klokkeslettet må være på riktig format eks.: 08:00, 08:30, 09:00 osv.");
                        }
                    }} type='time' step="1800" min={dag.open} max={env.klokkeslett[index].closed} value={env.klokkeslett[index].stengt?undefined:dag.closed}></input>
                </div>
            )
            })}
              </div>
              
            </div>

            <div>
                <button onClick={(e)=>{

                    e.preventDefault();
                    sVisRedigerPaaJobb(false);
                    sPaaJobb(frisor.paaJobb);
                }}>Avbryt</button>
                <button onClick={(e)=>{

                    e.preventDefault();
                    sVisRedigerPaaJobb(false);
                    oppdaterPaaJobb(paaJobb);
                }}>Lagre</button>
            </div>

            </div>:<></>}


            {visRedigerTelefonAnsatt?<div className='fokus'>
            <h4>Endre telefonnummer for {frisor.navn}</h4>
            <p>NB! Endre telefonnummeret til ansatt dersom den ansatte har fått nytt telefonnummer og 
              ikke får loggett inn selv for å endre telefonnummer (ansatt kan bli sperret ute på grunn av tofaktor)</p>
            <input inputMode="numeric" type="numeric" value={nyTelefonAnsatt} onChange={(e)=>{
              e.preventDefault();
              sNyTelefonAnsatt(e.target.value);
            }}></input>
            <div>
              <button onClick={(e)=>{
                e.preventDefault();
                sVisRedigerTelefonAnsatt(false);
                sNyTelefonAnsatt(telefonAnsatt);
              }}>Avbryt</button>
              <button onClick={(e)=>{
                e.preventDefault();
                if(nyTelefonAnsatt.length === 8){
                  oppdaterTelefonAnsatt();
                  sVisRedigerTelefonAnsatt(false);
                  sTelefonAnsatt(nyTelefonAnsatt);
                } else {
                  alert("Telefonnummeret må være på riktig format (8 siffer)");
                }
              }}>Lagre</button>
            </div>
            </div>:<></>}


              {visSiOpp?<div className='fokus'>
              
                  <h4>Legg inn oppsigelsesdato for {frisor.navn}</h4>
                  <p>Legg inn datoen som ansatt ikke lenger jobber. Ansatt vil kunne få reservasjoner før denne datoen men 
                      ikke på denne datoen eller etter. Dette er for å unngå at den ansatte får reservasjoner som ikke kan gjennomføres.
                  </p>
                  <input type="date" disabled={ikkeSiOpp} min={hentDato()} value={oppsigelsesDato} onChange={(e)=>{
                      e.preventDefault();
                      sOppsigelsesDato(e.target.value);
                  }} />
                  <label>Ikke si opp: <input type="checkbox" checked={ikkeSiOpp} onChange={()=>{
                    sIkkeSiOpp(!ikkeSiOpp);
                  }}></input></label>
                  <div>
                  <button onClick={(e)=>{
                      e.preventDefault();
                      sVisSiOpp(false);
                  }} >Avbryt</button>
                  <button onClick={(e)=>{
                      e.preventDefault();
                      sVisSiOpp(false);
                      siOppFrisor();
                  }}>Lagre dato for oppsigelse</button>
                  </div>
              </div>:""}


                
                {visRedigerBehandlinger?
                <div className='fokus'>
                  <h4>Rediger behandlinger for {frisor.navn}</h4>
                  <p>Velg behandlinger for den ansatte</p>
                  <br></br>

                  {env.tjenester.map((tjeneste)=>
                    (<div style={{userSelect:"none", backgroundColor:(frisorTjenester.includes(tjeneste.navn)?"lightgreen":"white"), cursor:"pointer"}} key={tjeneste.navn} onClick={()=>{
                      if(frisorTjenester.includes(tjeneste.navn)){
                          setFrisortjenester(frisorTjenester.filter(element=>element !== tjeneste.navn));
                      } else {
                          setFrisortjenester([...frisorTjenester, tjeneste.navn]);
                      }
                      }}>

                      <input type="checkbox" readOnly checked={frisorTjenester.includes(tjeneste.navn)}></input>
                      {tjeneste.navn}

                      </div>)
                  )}
                  <div>
                    <button onClick={()=>{
                      setFrisortjenester(frisor.produkter);
                      sVisRedigerBehandlinger(false);
                    }}>Avbryt</button>

                    <button onClick={()=>{
                      //Lagre behandlinger
                      oppdaterBehandlinger();
                      sVisRedigerBehandlinger(false);
                    }}>Lagre</button>
                  </div>
                </div>
                  :<></>}

            </div>:
      <button onClick={(e)=>{
        e.preventDefault();
        sVisRedigerFrisor(true);
      }} ><img alt='Rediger ansatt' src='rediger.png' style={{height:"1.4rem"}}></img></button>}
    </div>:""}
    </>
  )
}

export default React.memo(DetaljerFrisor)