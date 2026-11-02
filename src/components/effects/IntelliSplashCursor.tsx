import React, { useEffect, useRef } from 'react';

// A minimal interactive canvas fallback for the SplashCursor effect
// WebGL fluid dynamics omitted here for performance/safety without exact library source

interface SplashCursorProps {
  color?: string;
}

export const IntelliSplashCursor: React.FC<SplashCursorProps> = ({ color = '#4f46e5' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; alpha: number }[] = [];
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      particles.push({ x: e.clientX, y: e.clientY, alpha: 1 });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.alpha -= 0.05;
        if (p.alpha <= 0) {
          particles.splice(index, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 * p.alpha, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
};
