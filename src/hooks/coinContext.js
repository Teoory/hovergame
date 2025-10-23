import React, {useEffect, useState, createContext} from 'react'

export const CoinContext = createContext();

const CoinProvider = ({ children }) => {
    const [coins, setCoins] = useState(() => {
        const stored = localStorage.getItem('coins');
        return stored ? parseInt(stored, 10) : 0;
    });

    const [hoverPower, setHoverPower] = useState(() => {
        const stored = localStorage.getItem('hoverPower');
        return stored ? parseInt(stored, 10) : 1;
    });

    const [hoverPowerLevel, setHoverPowerLevel] = useState(() => {
        const stored = localStorage.getItem('hoverPowerLevel');
        return stored ? parseInt(stored, 10) : 1;
    });

    const [hoverTimer, setHoverTimer] = useState(() => {
        const stored = localStorage.getItem('hoverTimer');
        return stored ? parseInt(stored, 10) : 2000;
    });

    const [hoverTimerLevel, setHoverTimerLevel] = useState(() => {
        const stored = localStorage.getItem('hoverTimerLevel');
        return stored ? parseInt(stored, 10) : 1;
    });

    const addCoins = (amount) => {
        setCoins((prevCoins) => prevCoins + amount);
    };

    useEffect(() => {
        localStorage.setItem('coins', coins);
        localStorage.setItem('hoverPower', hoverPower);
        localStorage.setItem('hoverTimer', hoverTimer);
        localStorage.setItem('hoverPowerLevel', hoverPowerLevel);
        localStorage.setItem('hoverTimerLevel', hoverTimerLevel);
    }, [coins, hoverPower, hoverTimer, hoverPowerLevel, hoverTimerLevel]);

    return (
        <CoinContext.Provider value={{ coins, addCoins, hoverPower, setHoverPower, hoverPowerLevel, setHoverPowerLevel, hoverTimer, setHoverTimer, hoverTimerLevel, setHoverTimerLevel }}>
            {children}
        </CoinContext.Provider>
    );
}

export default CoinProvider