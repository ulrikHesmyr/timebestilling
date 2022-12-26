import React, {useState} from 'react'
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Timebestilling from './pages/Timebestilling'
import ViErBareLinnea from './pages/bareLinnea'
import './App.css'

const App = ()=> {

  
  const [dato, setDato] = useState(null);

  return (
      <BrowserRouter>
        <div>
            <nav className='navBar'>
              <Link to="/">Bestill time</Link>
              <Link to="/about">VI ER bareLinnea</Link>
            </nav>
            <Routes>
              <Route exact path="/" element={<Timebestilling sDato={setDato} dato={dato}/>} />
              <Route exact path="/about" element={<ViErBareLinnea/>} />
            </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
