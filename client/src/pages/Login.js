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
    const [lasterSynlig, sLasterSynlig] = useState(false);

    //Bruker må velge hvilken brukertype de er
    const [brukertypeValg, sBrukertypeValg] = useState("vakter");
    
    //Varsling
    const[varslingSynlig, sVarslingSynlig] = useState(false);
    const[visFeil, sVisFeil] = useState(false);
    const[lagrerVarslingSynlig, sLagrerVarslingSynlig] = useState(false);

    //Fjerne logg inn knapp med en gang de har trykt
    const[trykketLoggInn, sTrykketLoggInn] = useState(false);
    const[disableInputFields, sDisableInputFields] = useState(false);

    //2FA, bruker må skrive inn PIN fra SMS
    const [twoFApin, sTwoFApin] = useState();
    const [vis2FA, sVis2FA] = useState(false);

    function varsle(){
        sLagrerVarslingSynlig(false);
        sVarslingSynlig(true);
        setTimeout(()=>{
            sVarslingSynlig(false);
        }, 3000);
    }

    function varsleFeil(){
        sLagrerVarslingSynlig(false);
        sVisFeil(true);
        setTimeout(()=>{
            sVisFeil(false);
        }, 3000);
    }

    function lagreVarsel(){
        sLagrerVarslingSynlig(true);
    }

    //Bruker som er innlogget
    const [bruker, sBruker] = useState();

    let format = /[()<>.:[\]-_;,`'*`^+?!&%¤$£#"/=]/;

    useEffect(()=>{
        sLasterSynlig(true);
        alleredeLoggetInn();
    },[updateTrigger]);

    async function logginn(){
        const data = {
            brukernavn:brukernavn.toLowerCase(), 
            passord:passord,
            valgtBrukertype:false,
            brukertype:brukertypeValg
        }
        const request = await fetch("http://localhost:1227/login/auth", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data),
            //credentials:'include'
        });
        
        const response = await request.json();

        //Sjekker om brukeren har prøvd å logge inn for mange ganger
        if(response.m){
            alert(response.m);
            sTrykketLoggInn(false);
            sDisableInputFields(true);
            setTimeout(()=>{
                sDisableInputFields(false);
            }, 1000*60*5);
        } else {
            if(response.velgBrukertype){
                let hihi = window.confirm("GODKJENT!\n\nLogge inn på administrator-panelet?\n\n Hvis du velger \"Ok\" vil du logge inn på admin-panelet\n\n Hvis du velger \"Avbryt\" vil du logge inn på vakter-panelet");
                if(hihi){
                    
                    sBrukertypeValg("admin");
                } else {
                    sBrukertypeValg("vakter");
                }
                const d = {
                    brukernavn:brukernavn.toLowerCase(), 
                    passord:passord,
                    valgtBrukertype:true,
                    brukertype:(hihi ? "admin" : "vakter")
                }

                const r = await fetch("http://localhost:1227/login/auth", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify(d),
                    //credentials:'include'
                });
                const res = await r.json();
                if(!res.valid && res.two_FA){
                    sVis2FA(true);
                } else if(!res.valid){
                    alert(res.message); 
                    sTrykketLoggInn(false);
                } else if(res.valid){
                   toggleLoggetInn(true);
                   setBukertype(res.brukertype);
                   sEnv(res.env);
                   sBestiltetimer(res.bestilteTimer);
                   sBruker(res.bruker);
        
                   //Nullstiller input
                   setBrukernavn("");
                   setPassord("");
                   sTrykketLoggInn(false);
                } else {
                    alert("Noe har skjedd galt. Sjekk om du har internett og prøv på nytt.");
                }
            }else if(!response.valid && response.two_FA){
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
        const request = await fetch("http://localhost:1227/login/TWOFA", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({pin:twoFApin, brukertype:brukertypeValg}),
            //credentials:'include'
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
        const request = await fetch("http://localhost:1227/login/loggetinn",{method:"GET",
         //credentials:'include'
        });
        const response = await request.json();
        if(response.valid){
            toggleLoggetInn(true);
            setBukertype(response.brukertype);
            sEnv(response.env);
            sBestiltetimer(response.bestilteTimer);
            sBruker(response.bruker);
            sLasterSynlig(false);
        } else {
            sTrykketLoggInn(false);
            sLasterSynlig(false);
        }
    }

    async function loggut(){
        const request = await fetch("http://localhost:1227/login/logout", {method:"GET",
            //credentials:'include'
        });
        const response = await request.json();
        if(response){
            toggleLoggetInn(false);
            sTrykketLoggInn(false);
            sBrukertypeValg("vakter");
        }
    }
    

    return(
        <>
        {lasterSynlig && <div className='laster'></div>}
        <div className={lagrerVarslingSynlig?"varsling varsel":"skjul varsel"}><div>Lagrer...</div></div>
        <div className={varslingSynlig?"varsling varsel":"skjul varsel"}><div>Endringene er lagret!</div></div>
        <div className={visFeil?"varsling varsel":"skjul varsel"} style={{background:"red !important", color:"white !important"}}><div>Feilet</div></div>
        {vis2FA && <div className='fokus'>
            <div><h4>Tofaktor</h4>Se SMS for PIN. Dersom du ikke har mottatt PIN innen et par minutter, vennligst kontakt din daglig leder for å se om det er oppført riktig telefonnummer.</div><input type="text" inputMode="numeric" autoComplete="one-time-code" onChange={(e)=>{
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
        
     <div style={{marginTop:"8rem", padding:"0.5rem",color:"blue", cursor:"pointer", userSelect:"none"}} onClick={loggut}>LOGG UT</div> {(brukertype === "admin"?<Admin env={env} bruker={bruker} sUpdateTrigger={sUpdateTrigger} updateTrigger={updateTrigger} lagreVarsel={lagreVarsel} varsle={varsle} varsleFeil={varsleFeil} bestilteTimer={bestilteTimer}/>:(brukertype === "vakter"?<Vakter env={env} loggut={loggut} bruker={bruker} varsle={varsle} varsleFeil={varsleFeil} lagreVarsel={lagreVarsel} bestilteTimer={bestilteTimer} />:""))}</div>:(<div className='login'>
        <form className='loginForm' name='login' id="login">
            <label>Brukernavn: <input disabled={disableInputFields} name='brukernavn' value={brukernavn} maxLength={20} type="text" placeholder='brukernavn' onChange={(e)=>{
                if(!format.test(e.target.value)){
                    setBrukernavn(e.target.value);
                }
            }}></input> </label>
            <label>Passord: <input disabled={disableInputFields} name='passord' value={passord} type={passordSynlig?"text":"password"} maxLength={20} onChange={(e)=>{
                setPassord(e.target.value);
            }}></input> 
            {(passordSynlig?<img onClick={()=>{
                sPassordsynlig(false);
            }} src='oye_lukket.png' style={{height:"1.4rem", cursor:"pointer"}} alt="Skjul passord"></img>:<img onClick={()=>{
                sPassordsynlig(true);
            }} src='oye_aapnet.png' style={{height:"1.4rem", cursor:"pointer"}} alt="Vis passord"></img>)}
            </label>

            {!trykketLoggInn?<button disabled={disableInputFields} onClick={(e)=>{
                if(!window.navigator.webdriver){
                    sTrykketLoggInn(true);
                    e.preventDefault();
                    logginn();
                } else {
                    alert("Enheten din blir oppfattet som en webdriver. Kontakt ulrik.hesmyr2002@gmail.com eller 41394262 hvis du leser dette.");
                }
            }}>LOGG INN</button>:"Laster..."}
        </form>
    </div>))}
    </>
    )
}

export default React.memo(Login);