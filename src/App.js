import './App.css'
import { useMousePosition } from './gameManager/useMousePosition'
import { useRef, useState, useContext, useEffect } from 'react'
import { CoinContext } from './hooks/coinContext'

function formatCoins(n) {
  const abs = Math.abs(n);
  const units = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];
  for (const u of units) {
    if (abs >= u.value) {
      const val = n / u.value;
      const str = val >= 10 ? Math.round(val).toString() : val.toFixed(1).replace(/\.0$/, '');
      return str + u.symbol;
    }
  }
  return String(n);
}

function App() {
  const myref = useRef(null);
  const [buttonPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const mousePosition = useMousePosition(myref);

  const { coins, addCoins } = useContext(CoinContext);
  const { hoverPower, setHoverPower } = useContext(CoinContext);
  const { hoverTimer } = useContext(CoinContext);

  const coinsText = formatCoins(coins);
  const collectMs = hoverTimer || 2000;
  // Progress + RAF --- IGNORE ---
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (hoverPower < 1) setHoverPower(1);
  }, [hoverPower, setHoverPower]);

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
      <div className='mouseInfo'>
        <span>X: {Math.round(mousePosition.x)}, Y: {Math.round(mousePosition.y)}</span>
        <span style={{ marginLeft: 20 }}>Coins: {coinsText}</span>
      </div>

      <div ref={myref} className='gameArea'>
        <div className='gameBorder'></div>

        <div
          className='hoveringButton'
          style={{
            left: buttonPos.x, top: buttonPos.y,
            cursor: isHovered ? 'cell' : 'default'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!isHovered && 'Hover Over Me!'}

          <div
            className='hoveringButtonHover'
            style={{
              opacity: progress,
              transition: 'none'
            }}
          >
            <span><strong>Hovering!</strong></span>
            <span>Power: <strong>{hoverPower}</strong></span>
            <span>Coins: <strong>{coins}</strong></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
