import React, {useState} from 'react'
import {klokkeslettFraMinutter, minutterFraKlokkeslett} from './Klokkeslett.js'

function LeggTilFrisor({env, updateTrigger, sUpdateTrigger, varsle, lagreVarsel, varsleFeil}){

    const [nyFrisorNavn, sNyFrisorNavn] = useState("");
    const [nyFrisorTittel, sNyFrisorTittel] = useState("");
    const [nyFrisorBeskrivelse, sNyFrisorBeskrivelse] = useState("");
    const [tlfNyFrisor, sTlfNyFrisor] = useState("");
    const [epost, sEpost] = useState("");
    const [frisorTjenester, setFrisortjenester] = useState([]); //Skal være indekser, akkurat som i databasen
    const [bildeAvFrisor, sBildeAvFrisor] = useState(null);
    const [paaJobb, sPaaJobb] = useState(env.klokkeslett.map(obj => ({ ...obj, pauser:[]})));
    
    const [adminTilgang, sAdminTilgang] = useState(false);

    const [preview, setPreview] = useState(null);
    const [leggtil, sLeggTil] = useState(false);


    const [visPause, sVisPause] = useState(false);
    const [pauseTidspunkt, sPauseTidspunkt] = useState("06:00");
    const [pauseDag, sPauseDag] = useState(env.klokkeslett[0].dag);

    

    let pauseTidspunkter = [];
    for(let i = minutterFraKlokkeslett("06:00"); i < minutterFraKlokkeslett("22:00"); i += 15){
        pauseTidspunkter.push(klokkeslettFraMinutter(i));
    }

    async function lagre(){
        try {
            
        lagreVarsel();
        sLeggTil(false);
        
        let formData = new FormData();
        formData.append("uploaded_file", bildeAvFrisor);
        formData.append("navn", nyFrisorNavn);
        formData.append("nyFrisorTlf", parseInt(tlfNyFrisor));
        formData.append("nyFrisorTjenester", frisorTjenester);
        formData.append("tittel", nyFrisorTittel);
        formData.append("beskrivelse", nyFrisorBeskrivelse);
        formData.append("paaJobb", JSON.stringify(paaJobb));
        const options2 = {
            method:"POST",
            credentials: 'include',
            body: formData
        }
        const request2 = await fetch("/env/opprettFrisor/" + nyFrisorNavn, options2);
        const response2 = await request2.json();

        //Oppretter bruker for ansatt
        if(response2){

            
            const data = {
                nyBrukernavn: nyFrisorNavn.toLowerCase(),
                nyTelefonnummer: parseInt(tlfNyFrisor),
                adminTilgang: adminTilgang,
                epost: epost
            }
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials: 'include',
                body: JSON.stringify(data)
            }
            const request = await fetch("/login/opprettBruker", options);
            const response = await request.json();
            if(response && response.m){
                alert(response.m);
            } else if(response){
                varsle();
                sUpdateTrigger(!updateTrigger);
                setFrisortjenester([]);
                sTlfNyFrisor("");
                sEpost("");
                sNyFrisorNavn("");
                sNyFrisorBeskrivelse("");
                sNyFrisorTittel("");
                sBildeAvFrisor(null);
                sAdminTilgang(false);
                sPaaJobb(env.klokkeslett.map(obj => ({ ...obj, pauser:[]})));
            } else {
                alert("Noe gikk galt. Prøv igjen.");
            }

        } else {
            alert("Noe gikk galt. Prøv igjen.");
        }
            
        


        } catch (error) {
            alert("Bildet er for stort eller på feil format. Bilde må ha formatet .jpg, .jpeg, eller .png og være mindre enn 12mb.");
            varsleFeil();
        }
    }


    function avbryt(){
        setFrisortjenester([]);
        sLeggTil(false);
        sTlfNyFrisor("");
        sNyFrisorNavn("");
        sNyFrisorBeskrivelse("");
        sNyFrisorTittel("");
    }
  return (
    <>
    {leggtil?<div className='fokus' >
        <label style={{display:"flex", flexDirection:"column", fontWeight:"bold"}}>Navn på ny ansatt: <input required onChange={(e)=>{
            sNyFrisorNavn(e.target.value);
        }} value={nyFrisorNavn} type="text" placeholder='Navn navnesen' maxLength={30}></input></label>

        <label style={{display:"flex", flexDirection:"column", fontWeight:"bold"}}>Tittel: <input required onChange={(e)=>{
            sNyFrisorTittel(e.target.value);
        }} value={nyFrisorTittel} type="text" placeholder='eks.: Frisør, Terapeut, etc.' maxLength={30}></input></label>

        <label style={{display:"flex", flexDirection:"column", fontWeight:"bold"}}>Beskrivelse: <textarea onChange={(e)=>{
            sNyFrisorBeskrivelse(e.target.value);
        }} value={nyFrisorBeskrivelse} placeholder='Navn har jobbet hos oss siden... Hen er kreativ og liker å jobbe med... Nøyaktig og opptatt av å forstå kundens behov...'></textarea></label>

        <label style={{display:"flex", flexDirection:"column", fontWeight:"bold"}}>Telefonnummeret til ansatt: <input required style={{letterSpacing:"0.3rem"}} onChange={(e)=>{
            sTlfNyFrisor(e.target.value);
        }} value={tlfNyFrisor} type="text" maxLength={8}></input></label>
        <label style={{display:"flex", flexDirection:"column", fontWeight:"bold"}}>E-post: <input required onChange={(e)=>{
            sEpost(e.target.value);
        }} value={epost} type="email"></input> </label>
        <label style={{display:"flex", alignItems:"center", flexWrap:"wrap", flexDirection:"row"}}>Last opp bilde av ansatt: <input required accept="image/*" onChange={(e)=>{
            let maksStr = 12000000;
            if(e.target.files[0].size < maksStr){
                sBildeAvFrisor(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
            } else {
                alert("Bildet er for stort. Maks " + 12000000/1000000 + "mb");
            }
        }} type="file" name="uploaded_file"></input>Maks 12mb {preview && <img style={{height:"14rem", width:"14rem", objectFit:"contain"}} alt='Forhåndsvisning av bildet' src={preview}></img>}</label>
        

        <p style={{fontWeight:"bold"}} >Velg behandlinger for ansatt:</p>

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

        <p style={{fontWeight:"bold"}}>Velg hvilke dager og klokkeslett den ansatte skal jobbe:</p>
        <p className='litentekst'>Kryss av i ruten dersom vedkommende ikke er på jobb denne dagen</p>
        {paaJobb.map((dag, index)=>{
            return (
                <div style={{display: "flex", flexDirection:"column", justifyContent: "center", borderTop:"1px solid black"}} key={dag.dag}>
                    {dag.dag}
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        
                        <input type="checkbox" onChange={(e)=>{
                        const nyPaaJobb = [...paaJobb];
                        nyPaaJobb[index].stengt = e.target.checked;
                        sPaaJobb(nyPaaJobb);
                    }} checked={dag.stengt} disabled={env.klokkeslett[index].stengt}></input>
                    
                    <input disabled={env.klokkeslett[index].stengt || paaJobb[index].stengt} onChange={(e)=>{
                        let detteKlokkeslettet = e.target.value;
                        let klMinutter = minutterFraKlokkeslett(detteKlokkeslettet);
                        
                        if(klMinutter < minutterFraKlokkeslett(dag.closed) && klMinutter >= minutterFraKlokkeslett(env.klokkeslett[index].open) && klMinutter <= minutterFraKlokkeslett(env.klokkeslett[index].closed) && klMinutter % 15 === 0){
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
                    }} type='time' step="1800" min={dag.open} max={env.klokkeslett[index].closed} value={env.klokkeslett[index].stengt?undefined:dag.closed}></input></div>
                </div>
            )
        })}

        <p style={{fontWeight:"bold"}}>Legg inn pauser:</p>
        <p className='litentekst'>Legg inn pauser. Hver pause varer 15 minutter</p>

        <button onClick={(e)=>{
            e.preventDefault();
            sVisPause(true);
            
        }}>Legg til pause <img className='ikonKnapper' alt="Legg til pause knapp" src="leggtil.png"></img></button>

        {visPause && <div className='fokus'>
                <div className='lukk' onClick={(e)=>{
                    e.preventDefault();
                    sVisPause(false);
                }}></div>

                <h2>Velg pause</h2>
                <p>Velg tidspunkt for pausen og hvilken dag pausen skal gjelde under</p>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <label>Velg pausens tidspunkt:
                        <select value={pauseTidspunkt} onChange={(e)=>{
                            sPauseTidspunkt(e.target.value);
                        }}>
                            {pauseTidspunkter.map((tidspunkt)=>{
                                return <option key={tidspunkt} value={tidspunkt}>{tidspunkt}</option>
                            })}
                            
                        </select>
                    </label>
                    <label>Velg dag for pausen:
                        <select value={pauseDag} onChange={(e)=>{
                            sPauseDag(e.target.value);
                        }}>
                            {paaJobb.map((d)=>{
                                return <option key={d.dag} value={d.dag}>{d.dag}</option>
                            })}
                            
                        </select>
                    </label>

                    <button onClick={()=>{
                        const nyPaaJobb = [...paaJobb];
                        let index = nyPaaJobb.findIndex((d)=>d.dag === pauseDag);
                        nyPaaJobb[index].pauser.push(pauseTidspunkt);
                        sPaaJobb(nyPaaJobb);
                        sVisPause(false);
                    }}>Bekreft</button>
                </div>
            </div>}
            <p className='litentekst'>Valgte pauser:</p>
            {paaJobb.map(dag=>{
                if(dag.pauser.length > 0) return (<ul key={dag.dag}>{dag.dag}
                {dag.pauser.map(p=>{
                    return (<li key={p}>{p} <img onClick={(e)=>{
                        e.preventDefault();
                        const nyPaaJobb = [...paaJobb];
                        let index = nyPaaJobb.findIndex((d)=>d.dag === dag.dag);
                        let pauseIndex = nyPaaJobb[index].pauser.findIndex((h)=>h === p);
                        nyPaaJobb[index].pauser.splice(pauseIndex, 1);
                        sPaaJobb(nyPaaJobb);
                    }} alt="Fjern pause" src="delete.png" className='ikonKnapper'></img></li>)
                })}
                
                </ul>)
            })}

            <p style={{fontWeight:"bold"}}>Legg inn administrator-tilgang:</p>
        <p>Nedenfor krysser du av boksen dersom ansatt skal ha administrator-rettigheter og få tilgang til dette panelet.</p>
        <label>Admin tilgang: <input type="checkbox" onChange={(e)=>{
            sAdminTilgang(e.target.checked);
        }}></input> </label>

        <div>
            <button onClick={(e)=>{
                e.preventDefault();
                avbryt();
            }}>
                Avbryt
            </button>
            <button onClick={(e)=>{
                    e.preventDefault();

                    if(env.frisorer.map(frisor => frisor.navn.toLowerCase()).includes(nyFrisorNavn.toLowerCase())){
                        alert("Medarbeider finnes allerede");
                        return;
                    }

                    if(epost.length > 0 && frisorTjenester.length > 0 && tlfNyFrisor.length===8 && nyFrisorNavn !== "" && !isNaN(parseInt(tlfNyFrisor)) && bildeAvFrisor !== null){
                        lagre();
                        
                    } else {
                        alert("Ikke riktig format");
                    }
                }}>
                Opprett
            </button>
        </div>
    </div>:
    <button style={{display:"flex", alignItems:"center"}} onClick={(e)=>{
        e.preventDefault();
        sLeggTil(true);

    }}>
        <img className='ikonKnapper' src='leggtil.png' alt='Legg til Ansatt'></img>Ny ansatt
    </button>}
    </>
  )
}



export default React.memo(LeggTilFrisor)