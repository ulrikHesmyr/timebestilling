import React, {useState, useEffect} from 'react'
import {hentDato} from '../App'
function DetaljerFrisor({env, bruker, frisor, sendTilDatabase, varsle, lagreVarsel, sUpdateTrigger, updateTrigger}){

    const [visDetaljer, sVisDetaljer] = useState(false);

    
    //Frisører
    const [visRedigerFrisor, sVisRedigerFrisor] = useState(false);        
    const [frisorRediger, sFrisorRediger] = useState(null);
    const [oppsigelsesDato, sOppsigelsesDato] = useState(new Date());
    const [ikkeSiOpp, sIkkeSiOpp] = useState((frisor.oppsigelse === "Ikke oppsagt")?true:false);
    const [bildeAvFrisor, sBildeAvFrisor] = useState(null);
    const [visRedigerTelefonAnsatt, sVisRedigerTelefonAnsatt] = useState(false);
    const [telefonAnsatt, sTelefonAnsatt] = useState();
    const [visRedigerTittelOgBeskrivelse, sVisRedigerTittelOgBeskrivelse] = useState(false);
    const [tittel, sTittel] = useState(frisor.tittel);
    const [beskrivelse, sBeskrivelse] = useState(frisor.beskrivelse);
    
    //Viser redigeringssider
    const [visRedigerBehandlinger, sVisRedigerBehandlinger] = useState(false);     
    const [visSiOpp, sVisSiOpp] = useState(false);     
    const [visRedigerBilde, sVisRedigerBilde] = useState(false);

    //Nye behandlinger
    const [frisorTjenester, setFrisortjenester] = useState(frisor.produkter); //Skal være indekser, akkurat som i databasen

    //Oppdaterer tittel og beskrivelse for ansatt
    async function oppdaterTittelOgBeskrivelse(){
      lagreVarsel();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({navn:frisorRediger.navn, tittel:tittel, beskrivelse:beskrivelse})
      }
      const request = await fetch('http://localhost:1226/env/oppdaterTittelOgBeskrivelse', options);
      const response = await request.json();
      if(response){
        varsle();
      } else {
        alert("Noe gikk galt, prøv på nytt");
      }
    }
    //Oppdaterer en ansatt sitt telefonnummer
    async function oppdaterTelefonAnsatt(){
      console.log({navn:frisorRediger.navn, telefon:parseInt(telefonAnsatt)})
      lagreVarsel();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({navn:frisorRediger.navn, telefon:parseInt(telefonAnsatt)})
      }
      const request = await fetch('http://localhost:1226/env/oppdaterTelefonAnsatt', options);
      const response = await request.json();
      if(response){
        varsle();
      } else {
        alert("Noe gikk galt, prøv på nytt");
      }
    }

    async function oppdaterBilde(navn){
      lagreVarsel();
      //Oppdaterer bilde i databasen ved å sende bildet og navn som new FormData()
      let formData = new FormData();
      formData.append("uploaded_file", bildeAvFrisor);
      formData.append("navn", navn);

      const options = {
        method: 'POST',
        body: formData
      }

      const request = await fetch('http://localhost:1226/env/oppdaterBildeFrisor', options);
      const response = await request.json();
      if(response.valid){
        varsle();
        sUpdateTrigger(!updateTrigger);
      } else {
        alert("Noe gikk galt, prøv på nytt");
      }
      
    }

    async function siOppFrisor(){
      let tempFrisorer = env.frisorer;
      if(ikkeSiOpp){
        tempFrisorer.find((f)=>{return f.navn === frisorRediger.navn}).oppsigelse = "Ikke oppsagt";
      } else {
        tempFrisorer.find((f)=>{return f.navn === frisorRediger.navn}).oppsigelse = oppsigelsesDato;
      }

      sendTilDatabase(tempFrisorer, env.kategorier, env.tjenester, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
      sVisRedigerFrisor(false);
      sVisSiOpp(false);
    }
    async function oppdaterBehandlinger(){
      //Oppdaterer behandlinger i databasen
      let tempFrisorer = env.frisorer;
      tempFrisorer.find((f)=>{return f.navn === frisorRediger.navn}).produkter = frisorTjenester;
      sendTilDatabase(tempFrisorer, env.kategorier, env.tjenester, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
    }
    async function resetPassord(navn){
      lagreVarsel();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({navn:navn.toLowerCase()})
      }
      const request = await fetch('http://localhost:1226/login/resetPassord', options);
      const response = await request.json();
      if(response.valid){
        varsle();
      }
    }
    
    const [frisorBilde, sFrisorBilde] = useState(null);


    useEffect(()=>{
        
      const base = window.btoa(String.fromCharCode.apply(null, new Uint8Array(frisor.img.data.data)));
      const base64Image = `data:${frisor.img.contentType};base64,${base}`;
      sFrisorBilde(base64Image);
    }, [frisor])
  return (
    <>
    <div onClick={()=>{
          sVisDetaljer(!visDetaljer);
      }}  style={{display:"flex", height:"3rem", fontSize:"larger", flexDirection:"row", alignItems:"center", margin:"0.7rem",padding:"0.3rem", cursor:"pointer", borderLeft:"thin solid rgba(0,0,0,0.4)"}}>
      <img className='ikonKnapper' src='detaljer.png' alt="Detaljer om frisør"></img>
      <div style={{padding:"0.3rem"}}>{frisor.navn} </div>
      <img className='frisorbilde' src={frisorBilde} style={{height:"1.6rem"}} alt={`Bilde av ${frisor.navn}`}></img>
    </div>
    

    {visDetaljer?<div className='fokus'>
    <div className='lukk' onClick={()=>{
      sVisDetaljer(false);
    }}></div>
    <div>
    <div>
          <h3 style={{margin:"0"}}>{frisor.navn}</h3>
          {frisor.tittel}
      </div>
      <p>{frisor.beskrivelse}</p>
      <img className='frisorbilde' src={frisorBilde} style={{width:"200px"}} alt={`Bilde av ${frisor.navn}`}></img>
    </div>

      <div style={{fontSize:"small"}}>
      Behandlinger: 
      <ul>
      {env.tjenester.filter((tjeneste)=>frisor.produkter.includes(tjeneste.navn)).map((element)=>(<li key={element.navn}>{element.navn}</li>))}
      </ul>
      </div>
      
      <div>{frisor.oppsigelse !== "Ikke oppsagt"?`Dato for oppsigelse: ${frisor.oppsigelse}`:""}</div>
      

      {visRedigerFrisor?
        <div style={{border:"thin solid black", display:"flex", flexDirection:"column", alignItems:"flex-end"}}>
          
          <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            
          <div style={{margin:"0.5rem"}}>Velg hva du vil redigere for ansatt: <p style={{fontWeight:"bolder", fontSize:"larger"}}>{frisorRediger.navn}</p></div>
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

              
              <button onClick={()=>{
                sVisRedigerTittelOgBeskrivelse(true);
              }}>Rediger tittel eller beskrivelse</button>

              
              <button style={{background:"yellow"}} onClick={()=>{
                sVisRedigerTelefonAnsatt(true);
              }}>Endre telefonnummer</button>

              {bruker.navn.toLowerCase() !== frisorRediger.navn.toLowerCase()? <button style={{backgroundColor:"red", color:"white"}} onClick={()=>{
                //Resetter passord til ansatt
                if(window.confirm("Er du sikker på at du vil resette passordet til " + frisorRediger.navn + "? Passordet blir satt til samme som brukernavnet")){
                  sVisRedigerFrisor(false);
                  resetPassord(frisorRediger.navn);
                }
              }} >Resett innloggings-passord for {frisorRediger.navn}</button>:<p>Rediger passordet ditt i "vakter"-panelet</p>}

               
              <button style={{color:"white", background:"red"}} onClick={(e)=>{
                          e.preventDefault();
                          //slettFrisor(frisor.navn);
                          sVisSiOpp(true);
                          if(frisorRediger.oppsigelse !== "Ikke oppsagt"){
                              sOppsigelsesDato(frisorRediger.oppsigelse);
                          }
              }}>{frisorRediger.oppsigelse === "Ikke oppsagt"?"Si opp (legg inn oppsigelsesdato)":"Rediger oppsigelse"}</button>

            </div>   

            {visRedigerBilde?<div className='fokus'>
            <h4>Last opp nytt bilde: </h4>
              <label style={{display:"flex", alignItems:"center"}}>Last opp bilde av Frisøren: <input accept="image/*" onChange={(e)=>{
              sBildeAvFrisor(e.target.files[0]);
              }} type="file" name="uploaded_file"></input> {bildeAvFrisor && <img className='frisorbilde' style={{height:"300px"}} alt='Forhåndsvisning av bildet' src={URL.createObjectURL(bildeAvFrisor)}></img>}</label>
      
      <div>
        <button onClick={(e)=>{
          e.preventDefault();
          sVisRedigerBilde(false);
          sBildeAvFrisor(null);
        }}>Avbryt</button>
        <button onClick={(e)=>{
          e.preventDefault();
          if(bildeAvFrisor){  
            oppdaterBilde(frisorRediger.navn);
            sBildeAvFrisor(null);
            sVisRedigerBilde(false);
          }
        }}>Lagre</button>
      </div>
            </div>:<></>}

            {visRedigerTittelOgBeskrivelse?<div className='fokus'>
              <h4>Rediger tittel og/eller beskrivelse for {frisorRediger.navn}</h4>
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


            {visRedigerTelefonAnsatt?<div className='fokus'>
            <h4>Endre telefonnummer for {frisorRediger.navn}</h4>
            <p>NB! Endre telefonnummeret til ansatt dersom den ansatte har fått nytt telefonnummer og 
              ikke får loggett inn selv for å endre telefonnummer (ansatt kan bli sperret ute på grunn av tofaktor)</p>
            <input inputMode="numeric" type="numeric" value={telefonAnsatt} onChange={(e)=>{
              e.preventDefault();
              sTelefonAnsatt(e.target.value);
            }}></input>
            <div>
              <button onClick={(e)=>{
                e.preventDefault();
                sVisRedigerTelefonAnsatt(false);
                sTelefonAnsatt("");
              }}>Avbryt</button>
              <button onClick={(e)=>{
                e.preventDefault();
                if(telefonAnsatt.length === 8){
                  oppdaterTelefonAnsatt();
                  sVisRedigerTelefonAnsatt(false);
                  sTelefonAnsatt("");
                } else {
                  alert("Telefonnummeret må være på riktig format (8 siffer)");
                }
              }}>Lagre</button>
            </div>
            </div>:<></>}


              {visSiOpp?<div className='fokus'>
              
                  <h4>Legg inn oppsigelsesdato for {frisorRediger.navn}</h4>
                  <p>Legg inn datoen som frisøren ikke lenger jobber. Frisøren vil kunne få reservasjoner før denne datoen men 
                      ikke på denne datoen eller etter. Dette er for å unngå at frisøren får reservasjoner som ikke kan gjennomføres.
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
                  <h4>Rediger behandlinger for {frisorRediger.navn}</h4>
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
        sFrisorRediger(frisor);
        sVisRedigerFrisor(true);
      }} ><img alt='Rediger frisør' src='rediger.png' style={{height:"1.4rem"}}></img></button>}
    </div>:""}
    </>
  )
}

export default React.memo(DetaljerFrisor)