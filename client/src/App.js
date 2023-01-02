import React, {useState, useEffect} from 'react'
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Timebestilling from './pages/Timebestilling'
import ViErBareLinnea from './pages/bareLinnea'
import './App.css'

const App = ()=> {

  
  const [dato, setDato] = useState(null);
  const [produkt, setProdukt] = useState([]);
  const [frisor, setFrisor] = useState(null);
  const [klokkeslettet, setKlokkeslett] = useState(null);
  const [navn, setNavn] = useState(null);
  const [telefonnummer, setTelefonnummer] = useState(null);


  return (
      <BrowserRouter>
        <div>
            <nav className='navBar'>
              <Link to="/">Bestill time</Link>
              <Link to="/about">VI ER bareLinnea</Link>
            </nav>
            <Routes>
              <Route exact path="/" element={<Timebestilling navn={navn} sNavn={setNavn} telefonnummer={telefonnummer} sTelefonnummer={setTelefonnummer} klokkeslettet={klokkeslettet} sKlokkeslett={setKlokkeslett} sDato={setDato} dato={dato} produkt={produkt} sProdukt={setProdukt} frisor={frisor} sFrisor={setFrisor}/>} />
              <Route exact path="/about" element={<ViErBareLinnea/>} />
            </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
