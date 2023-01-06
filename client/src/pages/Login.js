import React, {useState} from 'react'
import Cookies from 'js-cookie'

function Login({toggleLoggetInn}){
    const [brukernavn, setBrukernavn] = useState('');
    const [passord, setPassord] = useState('');

    async function logginn(){
        const access_token = Cookies.get("access_token");
        const test_token = Cookies.get("test_token");
        const data = {
            brukernavn:brukernavn.toLowerCase(), 
            passord:passord,
            token: access_token
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
            //Cookies.set(response.cookie.name, response.cookie.accessToken, {expires:7});
           toggleLoggetInn(true);
           Notification.requestPermission().then(function(permission){
            console.log(permission);
            if(permission === 'granted'){
                console.log("h");
                //new Notification("This is a push alert");
            }
           }) 
        }
    }
    
    //useEffect
    //Sjekker om bruker er authenticated med Cookieparser
    return(
        <div className='login'>
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
        </div>
    )
}

export default React.memo(Login);