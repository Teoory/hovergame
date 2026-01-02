import { useState, useEffect } from 'react';

export const useMousePosition = (ref) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    const handleMouseMove = (event) => {
      const rect = el.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      x = Math.max(0, Math.min(x, rect.width));
      y = Math.max(0, Math.min(y, rect.height));
      setMousePosition({ x, y });
    };

    el.addEventListener('mousemove', handleMouseMove);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);

  return mousePosition;
};
