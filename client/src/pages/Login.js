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

    let format = /[ `!@#$%-^&*()_+=[\]{};':"\\|,.<>/?~]/;

    useEffect(()=>{
        alleredeLoggetInn();
    },[]);

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
        (loggetInn && env !== null?<div> <div style={{color:"blue", cursor:"pointer", userSelect:"none"}} onClick={loggut}>LOGG UT</div> {(brukertype === "admin"?<Admin env={env} bestilteTimer={bestilteTimer}/>:(brukertype === "vakter"?<Vakter env={env} bestilteTimer={bestilteTimer} />:""))}</div>:(<div className='login'>
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
                e.preventDefault();
                logginn();
            }} >LOGG INN</button>
        </form>
    </div>))
    )
}

export default React.memo(Login);