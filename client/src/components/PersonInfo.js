import React, {useRef} from 'react'

export default function PersonInfo({data, sNavn, sTelefonnummer}){
    

    const navnInput = useRef(null);
    const tlfInput = useRef(null);

    async function registrerData(navn, tlf){
        sNavn(navn);
        sTelefonnummer(tlf);
        let finalData = data;
        finalData.kunde = navn;
        finalData.telefonnummer = tlf;
        console.log(finalData);
        const request = await fetch('http://localhost:3001/api/bestilltime', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(finalData)
        });
        const response = await request.json();
        console.log(response);
    }

    return (
        <form>
            <label htmlFor="navn">Navn: </label>
            <input ref={navnInput} type="text" placeholder='Navn Navnesen' name='navn'></input>
            <label htmlFor="phone">Telefon: </label>
            <input ref={tlfInput} type="number" name="phone"></input>
            <button onClick={(e)=>{
                e.preventDefault();
                if(tlfInput.current.value.length === 8){
                    registrerData(navnInput.current.value, parseInt(tlfInput.current.value));
                } else {
                    alert("Telefonnumeret er ikke gyldig");
                }
            }}>SEND INN RESERVASJON</button>
        </form>
    )
}