import React, {useEffect, useState} from 'react'
import RedigerKontakt from '../components/RedigerKontakt';
import RedigerPassord from '../components/RedigerPassord';
import LeggTilFrisor from '../components/LeggTilFrisor';
import DetaljerFrisor from '../components/DetaljerFrisor';
import Fri from '../components/Fri';

function Admin({env, bestilteTimer}){
    console.log(env);
    console.log(bestilteTimer);
    
    const [admin_pass, sAPassord] = useState(""); //[{navn:String, produkter:[Number]}]   [OK]

    const [frisorer, sFrisorer] = useState(env.frisorer); //[{navn:String, produkter:[Number]}]   [OK]
    const [klokkeslett, sKlokkeslett] = useState(env.klokkeslett); //[{dag:String, open:String, closed:String}] []
    const [tjenester, sTjenester] = useState(env.tjenester); //[{navn:String, kategori: Number, pris: Number, tid: Number}] []

    const [sosialeMedier, sSosialeMedier] = useState(env.sosialeMedier); //[{bruker:String, platform:String}] []

    const [kategorier, sKategorier] = useState(env.kategorier); //[String] []

    const [kontakt_epost, sKontakt_epost] = useState(env.kontakt_epost); //String
    const [kontakt_tlf, sKontakt_tlf] = useState(env.kontakt_tlf); //Number

    //const [tempBestilteTimer, setTempBestilteTimer] = useState();

    //Synlige sider
    const [synligKomponent, setSynligKomponent] = useState(1);


    //useEffect(()=>{
    //    setTempBestilteTimer(bestilteTimer)
    //}, [bestilteTimer]);

    useEffect(()=>{
        if(env !== null && (frisorer !== env.frisorer || klokkeslett !== env.klokkeslett || tjenester !== env.tjenester || sosialeMedier !== env.sosialeMedier)){

            console.log("SKal oppdatere env: ", frisorer !== env.frisorer && env !== null)
            console.log(frisorer, env.frisorer);
            console.log(klokkeslett, env.klokkeslett);
            console.log(tjenester, env.tjenester);
            console.log(sosialeMedier, env.sosialeMedier);
            console.log(kategorier, env.kategorier);
            console.log(kontakt_epost, env.kontakt_epost);
            console.log(kontakt_tlf, env.kontakt_tlf);
            sendTilDatabase();
        }
    },[env.frisorer, env.klokkeslett, env.tjenester, env.sosialeMedier, env.kategorier, env.kontakt_epost, env.kontakt_tlf, frisorer, klokkeslett, tjenester, sosialeMedier, kategorier, kontakt_epost, kontakt_tlf]);

    useEffect(()=>{
        if(admin_pass !== ""){
            console.log("Oppdaterte passord");
            redigerPassordDB();
        }
    }, [admin_pass])

    async function slettFrisor(frisor){

        //Oppdaterer env i databasen
        console.log("sletter frisor");
        const nyFrisorer = frisorer.filter((f)=>{
            return f.navn !== frisor;
        })
        sFrisorer(nyFrisorer);

        //Fjerner brukeren til frisøren
        try {
            
            const data = {
                slettBrukernavn: frisor.toLowerCase()
            }
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            }
            const request = await fetch("http://localhost:3001/login/slettBruker", options);
            const response = request.json();
            if(response){
                console.log(response);
            } 
            
            } catch (error) {
                console.log(error);
            }
    }

    async function sendTilDatabase(){
        console.log("sendte nytt env til database");
        //fetch
        const nyttEnv = {
            frisorer:frisorer,
            kategorier:kategorier,
            tjenester:tjenester,
            klokkeslett:klokkeslett,
            sosialeMedier:sosialeMedier,
            kontakt_epost:kontakt_epost,
            kontakt_tlf:kontakt_tlf
        }
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(nyttEnv)
        }
        const request = await fetch("http://localhost:3001/env/oppdaterEnv", options);
        const response = await request.json();
        if(response){
            console.log(response);
        }
    }

    async function redigerPassordDB(){
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({admin_pass:admin_pass})
        }
        const request = await fetch("http://localhost:3001/env/oppdaterAdminPass", options);
        const response = await request.json();
        if(response){
            console.log(response);
        }
    }

    async function oppdaterTimebestillinger(){
        console.log("sendte oppdaterte timereservasjoner til databasen");
    }

    return(
        <div className='adminpanel'>
                <h1>Ditt skrivebord</h1>
                {env !== null? <div style={{display:"flex", flexDirection:"row"}}>
                
                    <button style={{margin:"0", borderCollapse:"collapse", border:"2px solid black", borderBottom:(synligKomponent=== 1? "none":"2px solid black")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(1);
                    }}>TIMEBESTILLINGER</button>

                
                    <button style={{margin:"0", borderCollapse:"collapse", border:"2px solid black", borderBottom:(synligKomponent=== 2? "none":"2px solid black")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(2);
                    }}>FRIDAGER OG FRAVÆR</button>

                    <button style={{margin:"0", border:"2px solid black", borderBottom:(synligKomponent=== 3? "none":"2px solid black")}} onClick={(e)=>{
                        e.preventDefault();
                        setSynligKomponent(3);
                    }}>KONTAKT-INFO, PASSORD, FRISØRER etc.</button>

                    </div>:""}

                
                <Fri env={env} bestilteTimer={bestilteTimer} synligKomponent={synligKomponent} />

                {synligKomponent === 1 && bestilteTimer !== null?(<>
                <h3>Timebestillinger</h3>
                    <div>
                        {bestilteTimer.map((time, index)=>(
                            <div key={index}>
                                <div>{time.medarbeider}: {time.dato} {time.tidspunkt}</div>
                            </div>
                        ))}
                    </div>
                    </>
                        
                ):""}


                {synligKomponent === 3 && env !== null?(
                <div>
                    <h3>Frisører, behandlinger, kategorier, åpningstider, kontakt-info og passord</h3>
                    <div>
                        <div className='redigeringsBoks'> <p>Kontakt telefon: {kontakt_tlf}</p> <RedigerKontakt number={true} state={kontakt_tlf} setState={sKontakt_tlf} /></div>
                        <div className='redigeringsBoks'> <p>Kontakt e-post: {kontakt_epost}</p> <RedigerKontakt number={false} state={kontakt_epost} setState={sKontakt_epost} /></div>
                    </div>

                    <div>
                        <div className='redigeringsBoks'><p>Passord for: admin</p> <RedigerPassord state={admin_pass} setState={sAPassord} redigerPassordDB={redigerPassordDB} /> </div>
                    </div>
                    <div>
                        {frisorer.map((frisor)=>(
                            <div key={frisor.navn} style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0.3rem"}}>
                                <DetaljerFrisor frisor={frisor} env={env} />
                                <button onClick={(e)=>{
                                    e.preventDefault();
                                    slettFrisor(frisor.navn);
                                }}><img src='delete.png' style={{height:"1.4rem"}} alt="Slett frisør" ></img></button>
                            </div>
                        ))}
                        {env !== null?<LeggTilFrisor env={env} setState={sFrisorer} state={frisorer}/>:""}
                        
                    </div>
                </div>
                ):""}
        </div>
    )
}

export default React.memo(Admin);