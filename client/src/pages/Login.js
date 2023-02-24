import React, {useState, useEffect} from 'react'
import Admin from './Admin';
import Vakter from './Vakter'

function Login(){
    const [brukernavn, setBrukernavn] = useState('');
    const [passord, setPassord] = useState('');
    const [brukertype, setBukertype] = useState('');
    const [env, sEnv] = useState();
    const [bestilteTimer, sBestiltetimer] = useState();
    const [loggetInn, toggleLoggetInn] = useState(false);
    const [passordSynlig, sPassordsynlig] = useState(false);
    const [updateTrigger, sUpdateTrigger] = useState(false);
    
    //Varsling
    const[varslingSynlig, sVarslingSynlig] = useState(false);
    const[lagrerVarslingSynlig, sLagrerVarslingSynlig] = useState(false);

    //Fjerne logg inn knapp med en gang de har trykt
    const[trykketLoggInn, sTrykketLoggInn] = useState(false);

    //2FA, bruker må skrive inn PIN fra SMS
    const [twoFApin, sTwoFApin] = useState();
    const [vis2FA, sVis2FA] = useState(false);

    function varsle(){
        sVarslingSynlig(true);
        setTimeout(()=>{
            sVarslingSynlig(false);
        }, 3000);

    }

    function lagreVarsel(){
        sLagrerVarslingSynlig(true);
        setTimeout(()=>{
            sLagrerVarslingSynlig(false);
        }, 3000);

    }

    //Bruker som er innlogget
    const [bruker, sBruker] = useState();

    let format = /[ `!@#$%-^&*()_+=[\]{};':"\\|,.<>/?~]/;

    useEffect(()=>{
        alleredeLoggetInn();
    },[updateTrigger]);

    async function logginn(){
        const data = {
            brukernavn:brukernavn.toLowerCase(), 
            passord:passord
        }
        const request = await fetch('/login/auth', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data),
            credentials:'include'
        });
        
        const response = await request.json();

        //Sjekker om brukeren har prøvd å logge inn for mange ganger
        if(response.m){
            alert("Du har prøvd å logge inn for mange ganger. Vennligst vent 5 minutter og prøv igjen.");
            sTrykketLoggInn(false);
        } else {
            if(!response.valid && response.two_FA){
                sVis2FA(true);
            } else if(!response.valid){
                alert(response.message); 
                sTrykketLoggInn(false);
            } else if(response.valid){
               toggleLoggetInn(true);
               setBukertype(response.brukertype);
               sEnv(response.env);
               sBestiltetimer(response.bestilteTimer);
               sBruker(response.bruker);
    
               //Nullstiller input
               setBrukernavn("");
               setPassord("");
               sTrykketLoggInn(false);
            } else {
                alert("Noe har skjedd galt. Sjekk om du har internett og prøv på nytt.");
            }
        }

            
        
        
    }

    async function send2FA(){
        //Sender request til TWOFA route på server for å sjekke om PIN stemmer
        const request = await fetch("/login/twoFA", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({pin:twoFApin}),
            credentials:'include'
        });
        const response = await request.json();
        
        if(response.valid){
            toggleLoggetInn(true);
            setBukertype(response.brukertype);
            sEnv(response.env);
            sBestiltetimer(response.bestilteTimer);
            sBruker(response.bruker);
        } else {
            alert(response.message);
        }
    }

    async function alleredeLoggetInn(){
        const request = await fetch("/login/loggetinn",{method:"GET", credentials:'include'});
        const response = await request.json();
        if(response.valid){
            toggleLoggetInn(true);
            setBukertype(response.brukertype);
            sEnv(response.env);
            sBestiltetimer(response.bestilteTimer);
            sBruker(response.bruker);
        }
    }

    async function loggut(){
        const request = await fetch("/login/logout", {method:"GET", credentials:'include'});
        const response = await request.json();
        if(response){
            toggleLoggetInn(false);
        }
    }
    

    return(
        <>

        <div className={lagrerVarslingSynlig?"varsling varsel":"skjul varsel"}><div>Lagrer...</div></div>
        <div className={varslingSynlig?"varsling varsel":"skjul varsel"}><div>Endringene er lagret!</div></div>
        {vis2FA && <div className='fokus'>
            <div>2FA</div><input type="text" onChange={(e)=>{
            sTwoFApin(e.target.value);
            }}></input>
            
            <div>
            <button onClick={()=>{
                sTrykketLoggInn(false);
                sVis2FA(false);
                sTwoFApin("");
            }}>Avbryt</button>

            <button onClick={()=>{
                if(twoFApin.length === 4){
                    sVis2FA(false);
                    send2FA();
                }
            }}>Send</button>
            </div>
            </div>
        }
        {(loggetInn && env !== null?<div>
        
     <div style={{ padding:"0.5rem",color:"blue", cursor:"pointer", userSelect:"none"}} onClick={loggut}>LOGG UT</div> {(brukertype === "admin"?<Admin env={env} sUpdateTrigger={sUpdateTrigger} updateTrigger={updateTrigger} lagreVarsel={lagreVarsel} varsle={varsle} bestilteTimer={bestilteTimer}/>:(brukertype === "vakter"?<Vakter env={env} bruker={bruker} varsle={varsle} lagreVarsel={lagreVarsel} bestilteTimer={bestilteTimer} />:""))}</div>:(<div className='login'>
        <form className='loginForm'>
            <label>Brukernavn: <input name='brukernavn' value={brukernavn} maxLength={10} type="text" placeholder='brukernavn' onChange={(e)=>{
                if(!format.test(e.target.value)){
                    setBrukernavn(e.target.value);
                }
            }}></input> </label>
            <label>Passord: <input name='passord' value={passord} type={passordSynlig?"text":"password"} maxLength={20} onChange={(e)=>{
                setPassord(e.target.value);
            }}></input> 
            {(passordSynlig?<img onClick={()=>{
                sPassordsynlig(false);
            }} src='oye_lukket.png' style={{height:"1.4rem", cursor:"pointer"}} alt="Skjul passord"></img>:<img onClick={()=>{
                sPassordsynlig(true);
            }} src='oye_aapnet.png' style={{height:"1.4rem", cursor:"pointer"}} alt="Vis passord"></img>)}
            </label>

            {!trykketLoggInn?<button onClick={(e)=>{
                if(!window.navigator.webdriver){
                    sTrykketLoggInn(true);
                    e.preventDefault();
                    logginn();
                } else {
                    alert("Enheten din blir oppfattet som en webdriver. Kontakt ulrik.hesmyr2002@gmail.com eller 41394262 hvis du leser dette.");
                }
            }} >LOGG INN</button>:"Laster..."}
        </form>
    </div>))}
    </>
    )
}

export default React.memo(Login);