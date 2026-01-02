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

  const { coins, addCoins } = useContext(CoinContext);
  const { hoverPower, setHoverPower } = useContext(CoinContext);
  const { hoverTimer, setHoverTimer } = useContext(CoinContext);
  const { totalTimer, setTotalTimer } = useContext(CoinContext);

  const [currentTimer, setCurrentTimer] = useState(0);

  const coinsText = formatCoins(coins);
  const timeText = formatTime(totalTimer);
  const timeTextCurrent = formatTime(currentTimer);
  const collectMs = hoverTimer || 2000;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (hoverPower < 1) setHoverPower(1);
  }, [hoverPower, setHoverPower]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimer((prev) => prev + 1);
      setTotalTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
      </div>

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
                disabled={coins < 200}
                className={coins < 200 && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-200);
                  setHoverPower(hoverPower + 1);
                }}
              >
                <span>Buy +1 </span>
                <span>Hover Power </span>
                <span>(200 Coins)</span>
              </button>
              <button
                disabled={coins < 400}
                className={coins < 400 && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-400);
                  setHoverPower(hoverPower * 2);
                }}
              >
                <span>Buy x2 </span>
                <span>Hover Power </span>
                <span>(400 Coins)</span>
              </button>
          </div>

          <div className="hoverTimerMarketArea">
            <span>Hover Timer: {hoverTimer} ms</span>
            {hoverTimer > 500 && (
              <button
                disabled={coins < 300}
                className={coins < 300 && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-300);
                  const newTimer = Math.max(500, hoverTimer - 50);
                  setHoverTimer(newTimer);
                }}
              >
                <span>Decrease Hover</span>
                <span> Timer by 50ms </span>
                <span>(300 Coins)</span>
              </button>
            )}
            {hoverTimer > 500 && (
              <button
                disabled={coins < 600}
                className={coins < 600 && "disabledMarketButton"}
                onClick={() => {
                  addCoins(-600);
                  const newTimer = Math.max(500, hoverTimer - 100);
                  setHoverTimer(newTimer);
                }}
              >
                <span>Decrease Hover </span>
                <span>Timer by 100ms </span>
                <span>(600 Coins)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
