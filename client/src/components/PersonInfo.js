import React, {useRef} from 'react'

export default function PersonInfo({data, sNavn, sTelefonnummer}){
    

    const navnInput = useRef(null);
    const tlfInput = useRef(null);

    async function registrerData(navn, tlf){
        sNavn(navn);
        sTelefonnummer(tlf);
        let finalData = data;
        finalData.navn = navn;
        finalData.telefonnummer = tlf;
        console.log(finalData);
    }

    return (
        <form>
            <input ref={navnInput} type="text" placeholder='Navn Navnesen'></input>
            <input ref={tlfInput} type="number" name="phone"></input>
            <button onClick={(e)=>{
                e.preventDefault();
                registrerData(navnInput.current.value, tlfInput.current.value);
            }}>SEND INN RESERVASJON</button>
        </form>
    )
}