import React, {useState} from 'react'

function LeggTilFrisor({env, setState, state}){

    const [leggtil, sLeggTil] = useState(false);
    const [nyFrisorNavn, sNyFrisorNavn] = useState("");
    const [frisorTjenester, setFrisortjenester] = useState([]); //Skal være indekser, akkurat som i databasen


    function lagre(){
        setState([...state, {navn:nyFrisorNavn, produkter:frisorTjenester}]);//Skal være akkurat som env.frisorer i databasen
        sLeggTil(false);
    }

    function avbryt(){
        setFrisortjenester([]);
        sLeggTil(false);
    }
  return (
    <>
    {leggtil?<div >
        <label style={{fontWeight:"bold"}}>Navn på ny frisør: <input onChange={(e)=>{
            sNyFrisorNavn(e.target.value);
        }} value={nyFrisorNavn} type="text" placeholder='Navn navnesen' maxLength={20}></input></label>
        <p style={{fontWeight:"bold"}} >Velg behandlinger for frisør:</p>
        {env.tjenester.map((tjeneste, index)=>
        (<div style={{userSelect:"none", backgroundColor:(frisorTjenester.includes(index)?"lightgreen":"white"), cursor:"pointer"}} key={tjeneste.navn} onClick={()=>{
            if(frisorTjenester.includes(index)){
                setFrisortjenester(frisorTjenester.filter(element=>element !== index));
            } else {
                setFrisortjenester([...frisorTjenester, index]);
            }
        }}>
            <input type="checkbox" readOnly checked={frisorTjenester.includes(index)}></input>
            {tjeneste.navn}
        </div>)
        )}
        <button onClick={(e)=>{
            e.preventDefault();
            avbryt();
        }}>
            <img alt="Avbryt" src='avbryt.png' style={{height:"2rem"}}></img>
        </button>
        <button onClick={(e)=>{
                e.preventDefault();
                lagre();
            }}>
            <img alt="lagre" src='lagre.png' style={{height:"2rem"}}></img>
        </button>
    </div>:
    <button style={{display:"flex", alignItems:"center"}} onClick={(e)=>{
        e.preventDefault();
        sLeggTil(true);

    }}>
        <img src='leggtil.png' alt='Legg til Frisør' style={{height:"2rem"}}></img>Ny Frisør
    </button>}
    </>
  )
}


export default React.memo(LeggTilFrisor)