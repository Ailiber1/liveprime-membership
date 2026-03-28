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
      {/* 背景のアクセントグロー */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#f59e0b]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <h2 className="cta-fade opacity-0 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-tight">
          ライブの世界に、
          <br />
          飛び込もう。
        </h2>

        <p className="cta-fade opacity-0 mt-6 text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          10,000人以上のクリエイターが待っています。
          <br className="hidden sm:block" />
          14日間無料で、すべてのコンテンツを体験。
        </p>

        <div className="cta-fade opacity-0 mt-10 flex flex-col items-center gap-5">
          <Link
            href="/register"
            prefetch={true}
            className="group/cta relative inline-block overflow-hidden rounded-lg border-2 border-white/30 bg-white/10 px-12 py-5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-white/90 hover:text-[#0a0a0f] hover:border-white/80 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.98] active:duration-100"
          >
            <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[1200ms] ease-out group-hover/cta:translate-x-full" />
            <span className="relative">14日間無料で試す</span>
          </Link>
          <Link
            href="/pricing"
            prefetch={true}
            className="text-sm text-text-muted transition-colors duration-300 hover:text-text-primary"
          >
            料金プランを見る →
          </Link>
        </div>

        <p className="cta-fade opacity-0 mt-5 text-xs text-text-muted">
          クレジットカード不要 ・ いつでもキャンセル可能
        </p>
      </div>
    </section>
  );
}
