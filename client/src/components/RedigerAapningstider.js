import React, {useState} from 'react'
import {minutterFraKlokkeslett} from './Klokkeslett'

function RedigerAapningstider({env, sendTilDatabase, dag, sVisRedigerAapningstider}){

  const [aapningstid, sAapningstid] = useState(dag.open);
  const [stengetid, sStengetid] = useState(dag.closed);
  const [stengt, sStengt] = useState(dag.stengt);
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
    <h3>Endre åpningstider for {dag.dag}</h3>
    <label>Skriv inn ny åpningstid: <input disabled={stengt} onChange={(e)=>{
      sAapningstid(e.target.value);
    }} value={aapningstid} maxLength={5} ></input> </label>
    <label>Skriv inn ny stengetid: <input disabled={stengt} onChange={(e)=>{
      sStengetid(e.target.value);
    }} value={stengetid} maxLength={5} ></input> </label>
    <label>Stengt denne dagen: <input onChange={()=>{
      sStengt(!stengt);
    }} checked={stengt} type="checkbox" ></input></label>

    <button onClick={(e)=>{
      e.preventDefault();
      sVisRedigerAapningstider(false);
      sAapningstid(dag.open);
      sStengetid(dag.closed);
    }}>Avbryt</button>
    <button onClick={(e)=>{
      e.preventDefault();
      if(stengetid.length === 5 && aapningstid.length === 5  && parseInt(aapningstid.substring(3,5))%15 === 0 && parseInt(stengetid.substring(3,5))%15 === 0 && !isNaN(parseInt(aapningstid.substring(0,2)))&& !isNaN(parseInt(stengetid.substring(0,2))) && aapningstid.substring(2,3) === ":" && stengetid.substring(2,3) === ":" && minutterFraKlokkeslett(aapningstid) < minutterFraKlokkeslett(stengetid)){
        sVisRedigerAapningstider(false);
        let nyeAapningstider = env.klokkeslett.map((a)=>{
          if(a.dag === dag.dag){
            a.open = aapningstid; 
            a.closed = stengetid;
            a.stengt = stengt;
          } 
          return a;
        })
        sendTilDatabase(env.frisorer, env.kategorier, env.tjenester, nyeAapningstider, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);
    
      } else {
        alert("Ikke riktig format");
      }
    }}>Lagre</button>
    </div>
  )
}

export default React.memo(RedigerAapningstider)