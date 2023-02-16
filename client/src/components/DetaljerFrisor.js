import React, {useState, useEffect} from 'react'

function DetaljerFrisor({env, frisor, sendTilDatabase, varsle}){

    const [visDetaljer, sVisDetaljer] = useState(false);

    
    //Frisører
    const [visRedigerFrisor, sVisRedigerFrisor] = useState(false);        
    const [frisorRediger, sFrisorRediger] = useState(null);
    const [oppsigelsesDato, sOppsigelsesDato] = useState(new Date());
    const [ikkeSiOpp, sIkkeSiOpp] = useState((frisor.oppsigelse === "Ikke oppsagt")?true:false);
    
    //Viser redigeringssider
    const [visRedigerBehandlinger, sVisRedigerBehandlinger] = useState(false);     
    const [visSiOpp, sVisSiOpp] = useState(false);     

    //Nye behandlinger
    const [frisorTjenester, setFrisortjenester] = useState(frisor.produkter); //Skal være indekser, akkurat som i databasen



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
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({navn:navn.toLowerCase()})
      }
      const request = await fetch('http://localhost:3001/login/resetPassord', options);
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
    <img src='detaljer.png' style={{height:"100%", cursor:"pointer"}} alt="Detaljer om frisør" onClick={()=>{
        sVisDetaljer(!visDetaljer);
    }}></img>
    <div style={{padding:"0.3rem"}}>{frisor.navn} </div>
    <img className='frisorbilde' src={frisorBilde} style={{height:"1.6rem"}} alt={`Bilde av ${frisor.navn}`}></img>
    
    

    {visDetaljer?<div className='fokus'>
    <img alt='Lukk pop-up vindu' className='lukk' src="avbryt.png" onClick={()=>{
      sVisDetaljer(false);
    }}></img>
    <div>
      <div style={{padding:"0.3rem"}}>{frisor.navn} </div>
      <img className='frisorbilde' src={frisorBilde} style={{objectFit:"contain", width:"200px"}} alt={`Bilde av ${frisor.navn}`}></img>
    </div>

      <div style={{fontSize:"small"}}>
      Behandlinger: 
      <ul>
      {env.tjenester.filter((tjeneste)=>frisor.produkter.includes(tjeneste.navn)).map((element)=>(<li>{element.navn}</li>))}
      </ul>
      </div>
      <div>{frisor.oppsigelse !== "Ikke oppsagt"?`Dato for oppsigelse: ${frisor.oppsigelse}`:""}</div>
      

      {visRedigerFrisor?
        <div style={{border:"thin solid black", display:"flex", flexDirection:"column", alignItems:"flex-end"}}>
          
          <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            
          <p style={{margin:"0.5rem"}}>Velg hva du vil redigere for ansatt: {frisorRediger.navn}</p>
            <img onClick={(e)=>{
                e.preventDefault();
                sVisRedigerFrisor(false);
            }} src='avbryt.png' style={{cursor:"pointer"}}></img>
          </div>

          <div style={{width:"100%", boxSizing:"border-box"}}>
                    
              <button onClick={(e)=>{
                          e.preventDefault();
                          //slettFrisor(frisor.navn);
                          sVisSiOpp(true);
                          if(frisorRediger.oppsigelse !== "Ikke oppsagt"){
                              sOppsigelsesDato(frisorRediger.oppsigelse);
                          }
              }}>{frisorRediger.oppsigelse === "Ikke oppsagt"?"Si opp (legg inn oppsigelsesdato)":"Rediger oppsigelse"}</button>
              
              <button onClick={(e)=>{
                          e.preventDefault();
                          //Vis rediger behandlinger for frisør
                          sVisRedigerBehandlinger(true);
                          
              }}>Rediger behandlinger</button>

              <button style={{backgroundColor:"red", color:"white"}} onClick={()=>{
                //Resetter passord til ansatt
                if(window.confirm("Er du sikker på at du vil resette passordet til " + frisorRediger.navn + "?" + "\nPassordet blir satt til samme som brukernavnet")){
                  resetPassord(frisorRediger.navn);
                }
              }} >Resett innloggings-passord for {frisorRediger.navn}</button>

                </div>   


                {visSiOpp?<div className='fokus'>
                
                    <h4>Legg inn oppsigelsesdato for {frisorRediger.navn}</h4>
                    <p>Legg inn datoen som frisøren ikke lenger jobber. Frisøren vil kunne få reservasjoner før denne datoen men 
                        ikke på denne datoen eller etter. Dette er for å unngå at frisøren får reservasjoner som ikke kan gjennomføres.
                    </p>
                    <input type="date" disabled={ikkeSiOpp} value={oppsigelsesDato} onChange={(e)=>{
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
      }} ><img src='rediger.png' style={{height:"1.4rem"}}></img></button>}
    </div>:""}
    </>
  )
}

export default React.memo(DetaljerFrisor)