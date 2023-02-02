import React, {useState} from 'react'

function LeggTilFrisor({env, sendTilDatabase}){

    const [leggtil, sLeggTil] = useState(false);
    const [nyFrisorNavn, sNyFrisorNavn] = useState("");
    const [tlfNyFrisor, sTlfNyFrisor] = useState("");
    const [frisorTjenester, setFrisortjenester] = useState([]); //Skal være indekser, akkurat som i databasen


    async function lagre(){
        console.log("tilkalte 'lagret'");
        sLeggTil(false);
        try {
            
        const data = {
            nyBrukernavn: nyFrisorNavn.toLowerCase(),
            nyTelefonnummer: parseInt(tlfNyFrisor)
        }
        console.log("data opprett frisør: ",data);
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        }
        const request = await fetch("http://localhost:3001/login/opprettBruker", options);
        const response = request.json();
        if(response){
            console.log(response);
        } 
        
        } catch (error) {
            console.log(error);
        }
        setFrisortjenester([]);
        sLeggTil(false);
        sTlfNyFrisor("");
        sNyFrisorNavn("");
        sendTilDatabase([...env.frisorer, {navn:nyFrisorNavn, produkter:frisorTjenester}], env.kategorier, env.tjenester, env.klokkeslett, env.sosialeMedier, env.kontakt_epost, env.kontakt_tlf);

    }

    function avbryt(){
        setFrisortjenester([]);
        sLeggTil(false);
        sTlfNyFrisor("");
        sNyFrisorNavn("");
    }
  return (
    <>
    {leggtil?<div >
        <label style={{fontWeight:"bold"}}>Navn på ny frisør: <input onChange={(e)=>{
            sNyFrisorNavn(e.target.value);
        }} value={nyFrisorNavn} type="text" placeholder='Navn navnesen' maxLength={20}></input></label>

        <label style={{fontWeight:"bold"}}>Telefonnummeret til frisøren: <input style={{letterSpacing:"0.3rem"}} onChange={(e)=>{
            sTlfNyFrisor(e.target.value);
        }} value={tlfNyFrisor} type="text" placeholder='Navn navnesen' maxLength={8}></input></label>

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
                console.log("Trykte på knappen");
                console.log(tlfNyFrisor.length === 8);
                console.log(nyFrisorNavn !== "");
                console.log(!isNaN(parseInt(tlfNyFrisor)));
                if(tlfNyFrisor.length===8 && nyFrisorNavn !== "" && !isNaN(parseInt(tlfNyFrisor))){
                    lagre();
                } else {
                    alert("Ikke riktig format");
                }
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