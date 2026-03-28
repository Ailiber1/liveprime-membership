"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const heroImages = [
  "/thumbnails/hero-bg-1.png",
  "/thumbnails/hero-bg-2.png",
  "/thumbnails/hero-bg-3.png",
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);

  // 自動フェード（6秒間隔）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // フェードインアニメーション
  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      const els = section.querySelectorAll(".hero-fade");
      els.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = "0";
        htmlEl.style.transform = "translateY(20px)";
        setTimeout(() => {
          htmlEl.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          htmlEl.style.opacity = "1";
          htmlEl.style.transform = "translateY(0)";
        }, 200 + i * 150);
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* フルスクリーン背景画像（フェードスライド） */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/40" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 py-32 text-center sm:px-6">
        <h1 className="hero-fade font-display text-[2.8rem] font-bold leading-[1.1] tracking-[0.02em] text-white sm:text-[4rem] md:text-[5rem]">
          ライブの熱量を、
          <br />
          そのままあなたへ。
        </h1>

        <p className="hero-fade mx-auto mt-8 max-w-lg text-base font-light leading-relaxed text-white/70 sm:text-lg tracking-wide">
          All in One, One for All
        </p>

        <div className="hero-fade mt-12 flex flex-col items-center gap-4">
          <Link
            href="/register"
            prefetch={true}
            className="btn-shine-auto group/btn relative inline-block overflow-hidden rounded-lg border-2 border-white/30 bg-white/10 px-12 py-5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-[600ms] ease-out hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.95] active:bg-white/40 active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] active:duration-100"
          >
            <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[1200ms] ease-out group-hover/btn:translate-x-full" />
            <span className="relative">創作を始める</span>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/login"
              prefetch={true}
              className="text-white/60 transition-colors hover:text-white"
            >
              ログインはこちら
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/creator"
              prefetch={true}
              className="text-white/60 transition-colors hover:text-white"
            >
              クリエイターとして参加する →
            </Link>
          </div>
        </div>
      </div>

      {/* ドットインジケーター */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-white" : "w-1.5 bg-white/30"
            }`}
            aria-label={`背景 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
