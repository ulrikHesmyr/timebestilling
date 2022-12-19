import './App.css';
import Timebestilling, {Kvittering} from './pages/Timebestilling';

function App() {

  let boolean = false;
  return (
    <>
    {(boolean? <Kvittering/>: <Timebestilling/>)}
    {process.env.ANTALL_ANSATTE}
    </>
  );
}

export default App;
