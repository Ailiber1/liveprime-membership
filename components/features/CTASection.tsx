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

    const inner = section.querySelector(".cta-inner");
    if (inner) observer.observe(inner);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="cta-inner opacity-0 relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* 装飾 */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="#f5b731">
                <path d="M7 0l2 4.5 5 .5-3.6 3.5.9 5L7 11l-4.3 2.5.9-5L0 5l5-.5L7 0z" />
              </svg>
              <span className="text-xs font-medium text-accent">
                14日間無料トライアル
              </span>
            </div>

            <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
              全機能をお試しください
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-text-secondary">
              14日間の無料トライアルで、4K配信、限定コンテンツ、コミュニティ機能
              すべてを体験。クレジットカード不要で今すぐスタート。
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="w-full rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover sm:w-auto"
              >
                無料で始める
              </Link>
              <Link
                href="/#features"
                className="w-full rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-text-muted sm:w-auto"
              >
                詳しく見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
