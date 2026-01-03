import "./App.css";
import { useMousePosition } from "./gameManager/useMousePosition";
import { useRef, useState, useContext, useEffect } from "react";
import { CoinContext } from "./hooks/coinContext";

function formatCoins(n) {
  const abs = Math.abs(n);
  const units = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
  ];
  for (const u of units) {
    if (abs >= u.value) {
      const val = n / u.value;
      const str =
        val >= 10
          ? Math.round(val).toString()
          : val.toFixed(1).replace(/\.0$/, "");
      return str + u.symbol;
    }
  }
  return String(n);
}

function calculateGiftCoins(currentCoins) {
  // Geçersiz değer kontrolü
  if (!currentCoins || isNaN(currentCoins) || currentCoins < 0) {
    currentCoins = 0;
  }
  
  let min, max;
  
  if (currentCoins < 100) {
    min = 0;
    max = 100;
  } else if (currentCoins < 500) {
    min = 100;
    max = 500;
  } else if (currentCoins < 1000) {
    min = 1000;
    max = 2000;
  } else if (currentCoins < 2000) {
    min = 2000;
    max = 4000;
  } else if (currentCoins < 5000) {
    min = 4000;
    max = 8000;
  } else if (currentCoins < 10000) {
    min = 8000;
    max = 15000;
  } else {
    min = Math.floor(currentCoins * 0.8);
    max = Math.floor(currentCoins * 1.5);
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return (
    (hrs > 0 ? hrs + "h " : "") +
    (mins > 0 ? mins + "m " : "") +
    secs +
    "s"
  ).trim();
}

function App() {
  const myref = useRef(null);
  const [buttonPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const mousePosition = useMousePosition(myref);
  const {
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
    resetGame,
  } = useContext(CoinContext);

  const [currentTimer, setCurrentTimer] = useState(0);
  const [giftNotification, setGiftNotification] = useState(null);

  const coinsText = formatCoins(coins);
  const timeText = formatTime(totalTimer);
  const timeTextCurrent = formatTime(currentTimer);
  const collectMs = hoverTimer || 2000;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const lastGiftTimeRef = useRef(-1);

  useEffect(() => {
    if (hoverPower < 1) setHoverPower(1);
  }, [hoverPower, setHoverPower]);

  const getIncreasedPrice = (price) => {
    const next = Math.ceil(price * 1.07);
    return next <= price ? price + 1 : next;
  };

  const handleReset = () => {
    if (window.confirm('Tüm oyun verilerini sıfırlamak istediğinizden emin misiniz?')) {
      resetGame();
      setCurrentTimer(0);
      setGiftNotification(null);
      setProgress(0);
      lastGiftTimeRef.current = -1;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimer((prev) => prev + 1);
      setTotalTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Her 5 dakikada bir coin hediyesi (totalTimer'a göre)
  useEffect(() => {
    const currentGiftPeriod = Math.floor(totalTimer / 300);
    
    // Yeni bir 5 dakikalık periyoda girildiyse ve daha önce bu periyotta hediye verilmediyse
    if (totalTimer > 0 && totalTimer % 300 === 0 && lastGiftTimeRef.current !== currentGiftPeriod) {
      lastGiftTimeRef.current = currentGiftPeriod;
      
      const giftAmount = calculateGiftCoins(coins);
      addCoins(giftAmount);
      setGiftNotification(giftAmount);
      
      // 1 dakika sonra bildirimi kaldır
      setTimeout(() => {
        setGiftNotification(null);
      }, 60000);
    }
  }, [totalTimer, coins, addCoins]);

  useEffect(() => {
    if (!isHovered) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setProgress(0);
      return;
    }

    startRef.current = performance.now();
    const loop = (now) => {
      const elapsed = now - startRef.current;
      if (elapsed >= collectMs) {
        addCoins(hoverPower);
        startRef.current = now;
        setProgress(0);
      } else {
        setProgress(elapsed / collectMs);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setProgress(0);
    };
  }, [isHovered, addCoins, hoverPower, collectMs]);

  return (
    <>
      <div className="mouseInfo">
        <span>
          X: {Math.round(mousePosition.x)}, Y: {Math.round(mousePosition.y)}
        </span>
        <span style={{ marginLeft: 20 }}>Coins: {coinsText}</span>
        <span style={{ marginLeft: 20}}>currentTimer: {timeTextCurrent}</span>
        <span style={{ marginLeft: 20}}>totalTimer: {timeText}</span>
        <button className="resetButton" onClick={handleReset}>Sıfırla</button>
        <button className="addCoinButton" onClick={() => addCoins(100)}>Add 100 Coins</button>
      </div>

      {giftNotification && (
        <div className="giftNotification">
          <h2>🎁 Hediye Coin! 🎁</h2>
          <p>Tebrikler! {formatCoins(giftNotification)} coin kazandınız!</p>
          <button className="giftNotificationCloseButton" onClick={() => setGiftNotification(null)}>Kapat</button>
        </div>
      )}

      <div ref={myref} className="gameArea">
        <div className="gameBorder"></div>

        <div
          className="hoveringButton"
          style={{
            left: buttonPos.x,
            top: buttonPos.y,
            cursor: isHovered ? "cell" : "default",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!isHovered && "Hover Over Me!"}

          <div
            className="hoveringButtonHover"
            style={{
              opacity: progress,
              transition: "none",
            }}
          >
            <span>
              <strong>Hovering!</strong>
            </span>
            <span>
              Power: <strong>{hoverPower}</strong>
            </span>
            <span>
              Coins: <strong>{coins}</strong>
            </span>
          </div>
        </div>

        <div className="marketButtons">
          <h3>Market Upgrades</h3>
          <div className="hoverButtonsMarketArea">
            <span>Hover Power: {hoverPower}</span>
              <button
                disabled={coins < hoverPowerPriceAdd}
                className={coins < hoverPowerPriceAdd && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-hoverPowerPriceAdd);
                  setHoverPower(hoverPower + 1);
                  setHoverPowerPriceAdd(getIncreasedPrice(hoverPowerPriceAdd));
                }}
              >
                <span>Buy +1 </span>
                <span>Hover Power </span>
                <span>({formatCoins(hoverPowerPriceAdd)} Coins)</span>
              </button>
              <button
                disabled={coins < hoverPowerPriceMult}
                className={coins < hoverPowerPriceMult && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-hoverPowerPriceMult);
                  setHoverPower(hoverPower * 2);
                  setHoverPowerPriceMult(getIncreasedPrice(hoverPowerPriceMult));
                }}
              >
                <span>Buy x2 </span>
                <span>Hover Power </span>
                <span>({formatCoins(hoverPowerPriceMult)} Coins)</span>
              </button>
          </div>

          <div className="hoverTimerMarketArea">
            <span>Hover Timer: {hoverTimer} ms</span>
            {hoverTimer > 500 && (
              <button
                disabled={coins < hoverTimerPrice50}
                className={coins < hoverTimerPrice50 && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-hoverTimerPrice50);
                  const newTimer = Math.max(500, hoverTimer - 50);
                  setHoverTimer(newTimer);
                  setHoverTimerPrice50(getIncreasedPrice(hoverTimerPrice50));
                }}
              >
                <span>Decrease Hover</span>
                <span> Timer by 50ms </span>
                <span>({formatCoins(hoverTimerPrice50)} Coins)</span>
              </button>
            )}
            {hoverTimer > 500 && (
              <button
                disabled={coins < hoverTimerPrice100}
                className={coins < hoverTimerPrice100 && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-hoverTimerPrice100);
                  const newTimer = Math.max(500, hoverTimer - 100);
                  setHoverTimer(newTimer);
                  setHoverTimerPrice100(getIncreasedPrice(hoverTimerPrice100));
                }}
              >
                <span>Decrease Hover </span>
                <span>Timer by 100ms </span>
                <span>({formatCoins(hoverTimerPrice100)} Coins)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
