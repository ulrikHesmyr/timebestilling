import React, {useState} from 'react'
import {minutterFraKlokkeslett} from './Klokkeslett'

function RedigerAapningstider({env, varsleFeil, lagreVarsel, varsle, updateTrigger, sUpdateTrigger, dag, sVisRedigerAapningstider}){

  const [aapningstid, sAapningstid] = useState(dag.open);
  const [stengetid, sStengetid] = useState(dag.closed);
  const [stengt, sStengt] = useState(dag.stengt);

  //Oppdaterer åpningstidene i databasen
  async function oppdaterAapningsTider(d){
    lagreVarsel();
    try {
      const request = await fetch("http://localhost:1227/env/oppdaterAapningstider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        },
        //credentials: 'include',
        body: JSON.stringify({dag:d,  aapningstid:aapningstid, stengetid:stengetid, stengt:stengt})
      });
      const response = await request.json();
      if(response){
        varsle();
        sUpdateTrigger(!updateTrigger);
      }
    } catch (error) {
      varsleFeil();
      alert("Noe skjedde gærent. Sjekk internettforbindelsen og prøv igjen.");
    }

  }
  return (
    <div className='fokus'>
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
    <div>
      <button onClick={(e)=>{
        e.preventDefault();
        sVisRedigerAapningstider(false);
        sAapningstid(dag.open);
        sStengetid(dag.closed);
      }}>Avbryt</button>
      <button disabled={stengt === dag.stengt && stengetid === dag.closed && aapningstid === dag.open} onClick={(e)=>{
        e.preventDefault();
        if(stengetid.length === 5 && aapningstid.length === 5  && parseInt(aapningstid.substring(3,5))%15 === 0 && parseInt(stengetid.substring(3,5))%15 === 0 && !isNaN(parseInt(aapningstid.substring(0,2)))&& !isNaN(parseInt(stengetid.substring(0,2))) && aapningstid.substring(2,3) === ":" && stengetid.substring(2,3) === ":" && minutterFraKlokkeslett(aapningstid) < minutterFraKlokkeslett(stengetid)){
          sVisRedigerAapningstider(false);
          if(window.confirm("Er du sikker på at du vil endre åpningstidene? NB Husk å endre \"på jobb\"-tidene til hver enkelt ansatt")){
            oppdaterAapningsTider(dag);
          }
        } else {
          alert("Ikke riktig format");
        }
      }}>Lagre</button>
    </div>
    </div>
  )
}

export default React.memo(RedigerAapningstider)