import { useState, useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';


function useCurrencyCounter (initArg) {
    const [state, setState] = useState(initArg);

    const getCurrency = (currency) => {        
        setState(currency)
    }

    return {state, getCurrency}
}


function App() {  
    const input = useCurrencyCounter('');
    const usd = useCurrencyCounter(0);
    const byn = useCurrencyCounter(0);
    const eur = useCurrencyCounter(0);
    const rub = useCurrencyCounter(0);

    const getData = () => {                                                    
    return fetch('https://cdn.cur.su/api/latest.json')
        .then(response =>response.json())
        .then(data => { 
            rub.getCurrency(data.rates.RUB);
            eur.getCurrency(data.rates.EUR);
            byn.getCurrency(data.rates.BYN);
        })
        .catch(error => console.log(error))
    };

    useEffect(() =>{
        getData()
        focusFirstTi();
    }, []);

    useEffect(() => {
        usd.getCurrency(input.state);
    },[input.state]);

    console.log(usd.state , input.state);

    const rubCounter = () => {
        // usd.getCurrency(input.state);
        usd.getCurrency(input.state * rub.state );
    };
        
    const eurCounter = () => {
        // usd.getCurrency(input.state);
        usd.getCurrency(input.state / eur.state );
    };
    
    const bynCounter = () => {  
        // usd.getCurrency(input.state);
        usd.getCurrency( input.state * byn.state );
    };
    
    function resCounter () {
        usd.getCurrency(0);
        input.getCurrency('');
    };

    const inputRef = useRef(null)    
    const focusFirstTi = () => inputRef.current.focus()

    const result = (usd.state ? +usd.state : 0).toFixed(2);

    return (
        <>
        <img src={logo} className="App-logo" alt="logo" />

        <label className='app-label' htmlFor="">Ведите сумму в $</label>
        <input 
            ref={inputRef} 
            onChange={e => input.getCurrency(e.target.value)} 
            className='app-input' type="number" 
            value={input.state}
            />
        <div onClick={focusFirstTi} className='app'>            
            <div className='counter'> {result} </div>
            <div className='controls'>
                <button onClick={rubCounter}>RUB</button>
                <button onClick={eurCounter}>EUR</button>
                <button onClick={bynCounter}>BYN</button>
                <button onClick={resCounter}>RESET</button>
            </div>             
        </div>

        </>
    );
}

export default App;
