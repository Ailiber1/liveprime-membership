"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center"
      style={{ background: "#0a0a0f" }}
    >
      {/* コンテンツ */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-32 text-center sm:px-6">
        <h1 className="hero-fade font-body text-[2.5rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[3.5rem] md:text-[4rem]">
          ライブの熱量を、
          <br />
          そのままあなたへ。
        </h1>

        <p className="hero-fade mx-auto mt-8 max-w-md text-base font-light leading-relaxed text-[#8b8ba3] sm:text-lg">
          限定配信、4K高画質、クリエイターとの直接交流。
          <br className="hidden sm:block" />
          月額980円から見放題。
        </p>

        <div className="hero-fade mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
          <Link
            href="/register"
            prefetch={true}
            className="inline-block rounded-lg bg-[#f59e0b] px-8 py-4 text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:bg-[#d97706] hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]"
          >
            無料で始める
          </Link>
          <Link
            href="/pricing"
            prefetch={true}
            className="inline-block rounded-lg border border-[rgba(255,255,255,0.12)] px-8 py-4 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-[rgba(255,255,255,0.25)] hover:text-text-primary"
          >
            料金プランを見る
          </Link>
        </div>
        <p className="hero-fade mt-5 text-center text-xs text-[#5a5a72]">
          14日間無料 ・ クレジットカード不要
        </p>
      </div>
    </section>
  );
}
