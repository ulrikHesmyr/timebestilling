import React, {useState, useEffect} from 'react'

function DetaljerFrisor({env, frisor, sendTilDatabase}){

    const [visDetaljer, sVisDetaljer] = useState(false);

    
    //Frisører
    const [visRedigerFrisor, sVisRedigerFrisor] = useState(false);        
    const [visSiOpp, sVisSiOpp] = useState(false);        
    const [frisorRediger, sFrisorRediger] = useState(null);
    const [oppsigelsesDato, sOppsigelsesDato] = useState(new Date());
    const [ikkeSiOpp, sIkkeSiOpp] = useState((frisor.oppsigelse === "Ikke oppsagt")?true:false);



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
    
    const [frisorBilde, sFrisorBilde] = useState(null);
    useEffect(()=>{
        
      const base = window.btoa(String.fromCharCode.apply(null, new Uint8Array(frisor.img.data.data)));
      const base64Image = `data:${frisor.img.contentType};base64,${base}`;
      sFrisorBilde(base64Image);
    }, [])
  return (
    <>
    <img src='detaljer.png' style={{height:"100%", cursor:"pointer"}} alt="Detaljer om frisør" onClick={()=>{
        sVisDetaljer(!visDetaljer);
    }}></img>
    <div style={{padding:"0.3rem"}}>{frisor.navn} </div>
    <img className='frisorbilde' src={frisorBilde} style={{height:"1.6rem"}} alt={`Bilde av ${frisor.navn}`}></img>
    
    

    {visDetaljer?<div className='fokus'>
    <img className='lukk' src="avbryt.png" onClick={()=>{
      sVisDetaljer(false);
    }}></img>
    <div style={{padding:"0.3rem"}}>{frisor.navn} </div>
    <img className='frisorbilde' src={frisorBilde} style={{height:"3rem"}} alt={`Bilde av ${frisor.navn}`}></img>
      <div style={{fontSize:"small"}}>
      Behandlinger: {env.tjenester.length === frisor.produkter.length?"Alle":env.tjenester.filter((tjeneste, index)=>frisor.produkter.includes(index)).map((element)=>(element.navn + ", "))}
      </div>
      <div>{frisor.oppsigelse !== "Ikke oppsagt"?`Dato for oppsigelse: ${frisor.oppsigelse}`:""}</div>
      
      <button onClick={(e)=>{
        e.preventDefault();
        sFrisorRediger(frisor);
        sVisRedigerFrisor(true);
      }} >Rediger</button>

      {visRedigerFrisor?
        <div>
          <button onClick={(e)=>{
              e.preventDefault();
              sVisRedigerFrisor(false);
          }}>Lukk</button>
        <div>
                    
          {frisorRediger.navn}
              <button onClick={(e)=>{
                          e.preventDefault();
                          //slettFrisor(frisor.navn);
                          sVisSiOpp(true);
                          if(frisorRediger.oppsigelse !== "Ikke oppsagt"){
                              sOppsigelsesDato(frisorRediger.oppsigelse);
                          }
              }}>
              {frisorRediger.oppsigelse === "Ikke oppsagt"?"Si opp (legg inn oppsigelsesdato)":"Rediger oppsigelse"}</button>
                     
                </div>   
                {visSiOpp?<>
                
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
                </>:""}
            </div>:""}
    </div>:""}
    </>
  )
}

export default React.memo(DetaljerFrisor)