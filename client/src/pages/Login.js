import React, {useState} from 'react'

function Login(){

    const [brukernavn, setBrukernavn] = useState('');
    const [passord, setPassord] = useState('');

    async function logginn(){
        const request = await fetch('http://localhost:3001/login', {
            method: "POST",
            headers:{
                "Content-Type":"appliaction/json",
            },
            body:JSON.stringify({brukernavn: brukernavn, passord: passord})
        })
        const response = await request.json();
        console.log(response);
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