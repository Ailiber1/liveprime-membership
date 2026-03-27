"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-2xl font-semibold text-text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs text-text-muted sm:text-sm">{label}</p>
    </div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // パーティクル生成
    const canvas = section.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initParticles() {
      if (!canvas) return;
      particles.length = 0;
      const count = Math.min(Math.floor(canvas.width * canvas.height / 15000), 60);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 84, ${p.opacity})`;
        ctx.fill();
      }

      // パーティクル間の線
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 0, 84, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    function handleResize() {
      resize();
      initParticles();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* アニメーション背景: グラデーションオーブ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-orb hero-orb--1" />
        <div className="hero-orb hero-orb--2" />
        <div className="hero-orb hero-orb--3" />
      </div>

      {/* パーティクルキャンバス */}
      <canvas className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* コンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-32 text-center sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs font-medium text-primary">
            新規会員募集中
          </span>
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-text-primary">プレミアムな</span>
          <br className="sm:hidden" />
          <span className="text-text-primary">ライブ体験を、</span>
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            あなたに。
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
          4K高画質の限定ライブ配信、ここでしか見られないプレミアムコンテンツ、
          クリエイターとの双方向コミュニケーション。
          すべてがひとつのプラットフォームに。
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="w-full rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 sm:w-auto"
          >
            今すぐ始める
          </Link>
          <Link
            href="/#pricing"
            className="w-full rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-text-muted sm:w-auto"
          >
            プランを見る
          </Link>
        </div>

        {/* 統計カウンター */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-16">
          <StatCounter value="10,000+" label="会員" />
          <div className="hidden h-8 w-px bg-border/50 sm:block" />
          <StatCounter value="500+" label="コンテンツ" />
          <div className="hidden h-8 w-px bg-border/50 sm:block" />
          <StatCounter value="99.9%" label="稼働率" />
        </div>
      </div>
    </section>
  );
}
