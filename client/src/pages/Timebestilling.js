import React, {useState,useEffect} from 'react'

export default function Timebestilling(){

    const [dato, setDato] = useState();
    const antallAnsatte = process.env.ANTALL_ANSATTE;

    return (
    <>
    <h1>Velg din time</h1>
    <input type="date" onChange={(e)=>{
        setDato(e.target.value)
    }}></input>
    <p>{dato}</p>
    <p>{antallAnsatte}</p>
    
    </>
        )
}

export function Kvittering(){

    return (
        <>
        <p>Kvittering</p>
        </>
    )
}