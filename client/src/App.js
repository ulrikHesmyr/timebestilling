import { useState } from 'react';
import './App.css';
import Timebestilling, {Kvittering} from './pages/Timebestilling';
import ViErBareLinnea from './pages/bareLinnea';

function App() {

  const[page,setPage] = useState(1);

  return (
    <>
    <div className='navBar'>
      <div onClick={()=>{
        setPage(1);
      }}>Bestill time</div>
      <div onClick={()=>{
        setPage(2);
      }}>Vi er "bareLinnea"</div>
    </div>
    {(page === 1?<Timebestilling/>:<ViErBareLinnea/>)}
    {process.env.ANTALL_ANSATTE}
    </>
  );
}

export default App;
