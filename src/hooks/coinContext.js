import React, {useEffect, useState, createContext, useCallback} from 'react'

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

    const [hoverTimer, setHoverTimer] = useState(() => {
        const stored = localStorage.getItem('hoverTimer');
        return stored ? parseInt(stored, 10) : 2000;
    });

    const [totalTimer, setTotalTimer] = useState(() => {
        const stored = localStorage.getItem('totalTimer');
        return stored ? parseInt(stored, 10) : 0;
    });

    const addCoins = useCallback((amount) => {
        setCoins((prevCoins) => prevCoins + amount);
    }, []);

    const resetGame = useCallback(() => {
        setCoins(0);
        setHoverPower(1);
        setHoverTimer(2000);
        setTotalTimer(0);
        localStorage.removeItem('coins');
        localStorage.removeItem('hoverPower');
        localStorage.removeItem('hoverTimer');
        localStorage.removeItem('totalTimer');
    }, []);

    useEffect(() => {
        localStorage.setItem('coins', coins);
        localStorage.setItem('hoverPower', hoverPower);
        localStorage.setItem('hoverTimer', hoverTimer);
        localStorage.setItem('totalTimer', totalTimer);
    }, [coins, hoverPower, hoverTimer, totalTimer]);

    return (
        <CoinContext.Provider value={{ coins, addCoins, hoverPower, setHoverPower, hoverTimer, setHoverTimer, totalTimer, setTotalTimer, resetGame }}>
            {children}
        </CoinContext.Provider>
    );
}

export default CoinProvider