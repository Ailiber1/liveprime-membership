"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
      {/* フルスクリーン背景画像 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/thumbnails/hero-bg-1.png"
          alt=""
          className="h-full w-full object-cover"
        />
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

        <div className="hero-fade mt-12">
          <Link
            href="/register"
            prefetch={true}
            className="inline-block rounded-lg border border-white/30 bg-white/10 px-10 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/50"
          >
            創作を始める
          </Link>
        </div>
      </div>
    </section>
  );
}
