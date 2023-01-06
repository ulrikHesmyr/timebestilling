import React, {useState} from 'react'
import Admin from './Admin';
import Vakter from './Vakter'

function Login({toggleLoggetInn, loggetInn}){
    const [brukernavn, setBrukernavn] = useState('');
    const [passord, setPassord] = useState('');
    const [brukertype, setBukertype] = useState('');

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
            console.log(response.message);
        } else if(response.valid){
           toggleLoggetInn(true);
           setBukertype(response.brukertype);
        }
    }
    
    //useEffect
    //Sjekker om bruker er authenticated med Cookieparser
    return(
        (loggetInn?(brukertype === "admin"?<Admin/>:(brukertype === "vakter"?<Vakter/>:"")):(<div className='login'>
        <h1>Login</h1>
        <form>
            <label>Brukernavn: <input value={brukernavn} type="text" placeholder='brukernavn' onChange={(e)=>{
                setBrukernavn(e.target.value);
            }}></input> </label>
            <label>Passord: <input value={passord} type="password" onChange={(e)=>{
                setPassord(e.target.value);
            }}></input> </label>
            <button onClick={(e)=>{
                e.preventDefault();
                logginn();
            }} >LOGG INN</button>
        </form>
    </div>))
    )
}

export default React.memo(Login);