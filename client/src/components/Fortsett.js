import React from 'react'

function Fortsett({displayKomponent, number, valid}){
    return (
        <button className='fortsett' disabled={valid} onClick={(e)=>{
            e.preventDefault();
            displayKomponent(number);
        }}>FORTSETT</button>
    )
}

export default React.memo(Fortsett);