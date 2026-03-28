"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.2 }
    );

    const els = section.querySelectorAll(".cta-fade");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-transparent"
    >
      {/* 背景画像 + オーバーレイ */}
      <div className="absolute inset-0 z-0">
        <img
          src="/thumbnails/hero-bg-2.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <h2 className="cta-fade opacity-0 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          ライブの世界に、
          <br />
          飛び込もう。
        </h2>

        <p className="cta-fade opacity-0 mt-6 text-base text-white/70 max-w-md mx-auto leading-relaxed">
          10,000人以上のクリエイターが待っています。
          <br className="hidden sm:block" />
          14日間無料で、すべてのコンテンツを体験。
        </p>

        <div className="cta-fade opacity-0 mt-10 flex flex-col items-center gap-5">
          <Link
            href="/register"
            prefetch={true}
            className="btn-shine-auto group/cta relative inline-block overflow-hidden rounded-lg border-2 border-white/30 bg-white/10 px-12 py-5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-[600ms] ease-out hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.95] active:bg-white/40 active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] active:duration-100"
          >
            <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[1200ms] ease-out group-hover/cta:translate-x-full" />
            <span className="relative">14日間無料で試す</span>
          </Link>
          <Link
            href="/pricing"
            prefetch={true}
            className="text-sm text-white/50 transition-colors duration-300 hover:text-white/80"
          >
            料金プランを見る →
          </Link>
        </div>

        <p className="cta-fade opacity-0 mt-5 text-xs text-white/40">
          クレジットカード不要 ・ いつでもキャンセル可能
        </p>
      </div>
    </section>
  );
}
