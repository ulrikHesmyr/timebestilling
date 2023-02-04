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

    function varsle(){
        sVarslingSynlig(true);
        setTimeout(()=>{
            sVarslingSynlig(false);
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
        const request = await fetch('http://localhost:3001/login/auth', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data),
            //credentials:'include'
        });
        const response = await request.json();
        console.log(response);
        if(!response.valid){
            alert(response.message); 
        } else if(response.valid){
           toggleLoggetInn(true);
           setBukertype(response.brukertype);
           sEnv(response.env);
           sBestiltetimer(response.bestilteTimer);
           sBruker(response.bruker);

           //Nullstiller input
           setBrukernavn("");
           setPassord("");
        }
    }

    async function alleredeLoggetInn(){
        console.log("allerede logget inn funksjon");
        const request = await fetch("http://localhost:3001/login/loggetinn");
        const response = await request.json();
        if(response.valid){
            toggleLoggetInn(true);
            setBukertype(response.brukertype);
            sEnv(response.env);
            sBestiltetimer(response.bestilteTimer);
            console.log(response.bruker);
            sBruker(response.bruker);
        } else {
            console.log(response.message);
        }
    }

    async function loggut(){
        const request = await fetch("http://localhost:3001/login/logout");
        const response = await request.json();
        if(response){
            console.log(response);
            toggleLoggetInn(false);
        }
    }
    

    return(
        <>
        {varslingSynlig && <div className="varsling"><div>Endringene er lagret!</div></div>}
        {(loggetInn && env !== null?<div>
        
     <div style={{color:"blue", cursor:"pointer", userSelect:"none"}} onClick={loggut}>LOGG UT</div> {(brukertype === "admin"?<Admin env={env} sUpdateTrigger={sUpdateTrigger} updateTrigger={updateTrigger} varsle={varsle} bestilteTimer={bestilteTimer}/>:(brukertype === "vakter"?<Vakter env={env} bruker={bruker} varsle={varsle} bestilteTimer={bestilteTimer} />:""))}</div>:(<div className='login'>
        <form className='loginForm'>
            <label>Brukernavn: <input name='brukernavn' value={brukernavn} maxLength={10} type="text" placeholder='brukernavn' onChange={(e)=>{
                if(!format.test(e.target.value)){
                    setBrukernavn(e.target.value);
                }
            }}></input> </label>
            <label>Passord: <input name='passord' value={passord} type={passordSynlig?"text":"password"} maxLength={20} onChange={(e)=>{
                setPassord(e.target.value);
            }}></input> {(passordSynlig?<img onClick={()=>{
                sPassordsynlig(false);
            }} src='oye_lukket.png' style={{height:"1.4rem"}} alt="Skjul passord"></img>:<img onClick={()=>{
                sPassordsynlig(true);
            }} src='oye_aapnet.png' style={{height:"1.4rem"}} alt="Vis passord"></img>)}</label>
            <button onClick={(e)=>{
                if(!window.navigator.webdriver){
                    e.preventDefault();
                    logginn();
                } else {
                    alert("Enheten din blir oppfattet som en webdriver. Kontakt ulrik.hesmyr2002@gmail.com eller 41394262 hvis du leser dette.");
                }
            }} >LOGG INN</button>
        </form>
    </div>))}
    </>
    )
}

export default React.memo(Login);