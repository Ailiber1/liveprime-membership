"use client";

import { useCallback, useEffect, useRef } from "react";

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = document.documentElement.scrollHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // 静的な星を生成
    const isMobile = w < 768;
    const count = isMobile ? 150 : 300;

    interface BgStar {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      speed: number;
      offset: number;
    }

    const stars: BgStar[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 0.3 + Math.random() * 1.5,
        baseOpacity: 0.1 + Math.random() * 0.4,
        speed: 0.3 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      });
    }

    const startTime = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        const twinkle = Math.sin(elapsed * star.speed + star.offset) * 0.5 + 0.5;
        const opacity = star.baseOpacity * (0.4 + twinkle * 0.6);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return () => { if (cleanup) cleanup(); };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 dark-only-canvas"
      aria-hidden="true"
    />
  );
}
