import React from 'react'

function Fortsett({displayKomponent, number, disabled}){
    return (
        <button className='fortsett' disabled={disabled} onClick={(e)=>{
            e.preventDefault();
            displayKomponent(number);
        }}>FORTSETT</button>
    )
}

export default React.memo(Fortsett);