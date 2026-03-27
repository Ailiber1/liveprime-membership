"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    number: "4K",
    label: "高画質配信",
    description: "映画品質の映像体験。配信者の表現力をそのまま届ける。",
  },
  {
    number: "10,000+",
    label: "クリエイター",
    description: "ジャンルを超えた多彩な配信者が日々コンテンツを発信中。",
  },
  {
    number: "24/7",
    label: "いつでも視聴可能",
    description: "見逃した配信もアーカイブで。好きな時間に、好きなだけ。",
  },
];

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 控えめな星パーティクル
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;

    const particles: { x: number; y: number; r: number; speed: number; alpha: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = section.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.15 + 0.05,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // フェードイン
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const els = section.querySelectorAll(".why-fade");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-bg-deep"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 dark-only-canvas"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <div className="text-center">
          <p className="why-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
            Why LIVE PRIME
          </p>
          <h2 className="why-fade opacity-0 mt-3 font-body text-2xl font-bold text-text-primary sm:text-4xl">
            なぜ LIVE PRIME なのか
          </h2>
        </div>

        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="why-fade opacity-0 text-center"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <p className="font-display text-5xl sm:text-6xl font-extrabold text-[#f59e0b] leading-none">
                {f.number}
              </p>
              <p className="mt-3 text-lg font-semibold text-text-primary">
                {f.label}
              </p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
