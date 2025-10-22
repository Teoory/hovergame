import React, {useEffect, useContext} from 'react'
import { CoinContext } from './coinContext'

const coinStorage = () => {
  const { coins, addCoins } = useContext(CoinContext);

  useEffect(() => {
    const storedCoins = localStorage.getItem('coins');
    if (storedCoins) {
      addCoins(parseInt(storedCoins, 10));
    }
  }, [addCoins]);

  useEffect(() => {
    localStorage.setItem('coins', coins);
  }, [coins]);

  return null;
}

export default coinStorage