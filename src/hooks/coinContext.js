import React, {useEffect, useState, createContext, useCallback} from 'react'

export const CoinContext = createContext();

const BASE_HOVER_POWER_ADD_PRICE = 200;
const BASE_HOVER_POWER_MULT_PRICE = 400;
const BASE_HOVER_TIMER_50_PRICE = 300;
const BASE_HOVER_TIMER_100_PRICE = 600;

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

    const [hoverPowerPriceAdd, setHoverPowerPriceAdd] = useState(() => {
        const stored = localStorage.getItem('hoverPowerPriceAdd');
        return stored ? parseInt(stored, 10) : BASE_HOVER_POWER_ADD_PRICE;
    });

    const [hoverPowerPriceMult, setHoverPowerPriceMult] = useState(() => {
        const stored = localStorage.getItem('hoverPowerPriceMult');
        return stored ? parseInt(stored, 10) : BASE_HOVER_POWER_MULT_PRICE;
    });

    const [hoverTimerPrice50, setHoverTimerPrice50] = useState(() => {
        const stored = localStorage.getItem('hoverTimerPrice50');
        return stored ? parseInt(stored, 10) : BASE_HOVER_TIMER_50_PRICE;
    });

    const [hoverTimerPrice100, setHoverTimerPrice100] = useState(() => {
        const stored = localStorage.getItem('hoverTimerPrice100');
        return stored ? parseInt(stored, 10) : BASE_HOVER_TIMER_100_PRICE;
    });

    const addCoins = useCallback((amount) => {
        setCoins((prevCoins) => prevCoins + amount);
    }, []);

    const resetGame = useCallback(() => {
        setCoins(0);
        setHoverPower(1);
        setHoverTimer(2000);
        setTotalTimer(0);
        setHoverPowerPriceAdd(BASE_HOVER_POWER_ADD_PRICE);
        setHoverPowerPriceMult(BASE_HOVER_POWER_MULT_PRICE);
        setHoverTimerPrice50(BASE_HOVER_TIMER_50_PRICE);
        setHoverTimerPrice100(BASE_HOVER_TIMER_100_PRICE);
        localStorage.removeItem('coins');
        localStorage.removeItem('hoverPower');
        localStorage.removeItem('hoverTimer');
        localStorage.removeItem('totalTimer');
        localStorage.removeItem('hoverPowerPriceAdd');
        localStorage.removeItem('hoverPowerPriceMult');
        localStorage.removeItem('hoverTimerPrice50');
        localStorage.removeItem('hoverTimerPrice100');
    }, []);

    useEffect(() => {
        localStorage.setItem('coins', coins);
        localStorage.setItem('hoverPower', hoverPower);
        localStorage.setItem('hoverTimer', hoverTimer);
        localStorage.setItem('totalTimer', totalTimer);
        localStorage.setItem('hoverPowerPriceAdd', hoverPowerPriceAdd);
        localStorage.setItem('hoverPowerPriceMult', hoverPowerPriceMult);
        localStorage.setItem('hoverTimerPrice50', hoverTimerPrice50);
        localStorage.setItem('hoverTimerPrice100', hoverTimerPrice100);
    }, [coins, hoverPower, hoverTimer, totalTimer, hoverPowerPriceAdd, hoverPowerPriceMult, hoverTimerPrice50, hoverTimerPrice100]);

    return (
        <CoinContext.Provider value={{
            coins,
            addCoins,
            hoverPower,
            setHoverPower,
            hoverTimer,
            setHoverTimer,
            totalTimer,
            setTotalTimer,
            hoverPowerPriceAdd,
            setHoverPowerPriceAdd,
            hoverPowerPriceMult,
            setHoverPowerPriceMult,
            hoverTimerPrice50,
            setHoverTimerPrice50,
            hoverTimerPrice100,
            setHoverTimerPrice100,
            resetGame
        }}>
            {children}
        </CoinContext.Provider>
    );
}

export default CoinProvider