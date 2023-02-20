import React, {useState} from 'react'

function LeggTilFrisor({env, updateTrigger, sUpdateTrigger, varsle}){

    const [leggtil, sLeggTil] = useState(false);
    const [nyFrisorNavn, sNyFrisorNavn] = useState("");
    const [tlfNyFrisor, sTlfNyFrisor] = useState("");
    const [frisorTjenester, setFrisortjenester] = useState([]); //Skal være indekser, akkurat som i databasen
    const [bildeAvFrisor, sBildeAvFrisor] = useState(null);


    async function lagre(){
        
        sLeggTil(false);
        console.log("tilkalte 'lagret'");
        
        try {
            
        const data = {
            nyBrukernavn: nyFrisorNavn.toLowerCase(),
            nyTelefonnummer: parseInt(tlfNyFrisor)
        }
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        }
        const request = await fetch("http://localhost:3001/login/opprettBruker", options);
        const response = request.json();
        
        
        let formData = new FormData();
        formData.append("uploaded_file", bildeAvFrisor);
        formData.append("nyFrisorNavn", nyFrisorNavn);
        formData.append("nyFrisorTlf", parseInt(tlfNyFrisor));
        formData.append("nyFrisorTjenester", frisorTjenester);
        const options2 = {
            method:"POST",
            body: formData
        }
        const request2 = await fetch("http://localhost:3001/env/opprettFrisor", options2);
        const response2 = request2.json();
        if(response && response2){
            sUpdateTrigger(!updateTrigger);
            setFrisortjenester([]);
            sTlfNyFrisor("");
            sNyFrisorNavn("");
            sBildeAvFrisor(null);
            varsle();
        }
        
        } catch (error) {
            console.log(error);
        }


    }


    function avbryt(){
        setFrisortjenester([]);
        sLeggTil(false);
        sTlfNyFrisor("");
        sNyFrisorNavn("");
    }
  return (
    <>
    {leggtil?<div className='fokus' >
        <label style={{fontWeight:"bold"}}>Navn på ny frisør: <input onChange={(e)=>{
            sNyFrisorNavn(e.target.value);
        }} value={nyFrisorNavn} type="text" placeholder='Navn navnesen' maxLength={20}></input></label>

        <label style={{fontWeight:"bold"}}>Telefonnummeret til frisøren: <input style={{letterSpacing:"0.3rem"}} onChange={(e)=>{
            sTlfNyFrisor(e.target.value);
        }} value={tlfNyFrisor} type="text" maxLength={8}></input></label>
        <label style={{display:"flex", alignItems:"center"}}>Last opp bilde av Frisøren: <input accept="image/*" onChange={(e)=>{
            sBildeAvFrisor(e.target.files[0]);
        }} type="file" name="uploaded_file"></input> {bildeAvFrisor && <img className='frisorbilde' style={{height:"300px"}} alt='Forhåndsvisning av bildet' src={URL.createObjectURL(bildeAvFrisor)}></img>}</label>
        

        <p style={{fontWeight:"bold"}} >Velg behandlinger for frisør:</p>

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
            <button onClick={(e)=>{
                e.preventDefault();
                avbryt();
            }}>
                Avbryt
            </button>
            <button onClick={(e)=>{
                    e.preventDefault();
                    if(frisorTjenester.length > 0 && tlfNyFrisor.length===8 && nyFrisorNavn !== "" && !isNaN(parseInt(tlfNyFrisor)) && bildeAvFrisor !== null){
                        lagre();
                    } else {
                        alert("Ikke riktig format");
                    }
                }}>
                Lagre
            </button>
        </div>
    </div>:
    <button style={{display:"flex", alignItems:"center"}} onClick={(e)=>{
        e.preventDefault();
        sLeggTil(true);

    }}>
        <img className='ikonKnapper' src='leggtil.png' alt='Legg til Frisør'></img>Ny Frisør
    </button>}
    </>
  )
}


export default React.memo(LeggTilFrisor)