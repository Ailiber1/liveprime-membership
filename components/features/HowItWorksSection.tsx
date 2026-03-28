"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "無料登録",
    description: "メールアドレスだけで30秒。クレジットカードは不要です。",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "好きな配信を見つける",
    description: "ジャンル・クリエイターから、あなた好みのコンテンツを発見。",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <polygon points="11,8 13.5,12 11,12 13.5,16 8.5,12 11,12 8.5,8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "プレミアムで全解放",
    description: "月額980円で全コンテンツが見放題。14日間の無料体験付き。",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
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
      { threshold: 0.15 }
    );

    const els = section.querySelectorAll(".how-fade");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 sm:py-40 bg-transparent"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="text-center">
          <p className="how-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="how-fade opacity-0 mt-3 font-display text-xl font-bold text-text-primary sm:text-3xl md:text-5xl">
            始め方はかんたん3ステップ
          </h2>
        </div>

        <div className="mt-20 sm:mt-24 relative">
          {/* コネクタライン（デスクトップのみ） */}
          <div className="hidden sm:block absolute top-[3.5rem] left-[16.67%] right-[16.67%] z-0">
            <div className="h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent" />
            {/* 矢印（中間） */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#f59e0b]/40" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 6L8 2V10L2 6Z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 relative z-10">
            {steps.map((s, i) => (
              <div
                key={i}
                className="how-fade opacity-0 relative text-center group"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* ステップカード */}
                <div className="rounded-2xl border border-border bg-bg-card p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#f59e0b]/30 group-hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)]">
                  {/* ステップ番号（大きなアンバー） */}
                  <span className="font-display text-[2.5rem] font-extrabold leading-none bg-gradient-to-b from-[#f59e0b] via-[#fbbf24] to-[#d97706] bg-clip-text text-transparent">
                    {s.number}
                  </span>

                  {/* アイコン */}
                  <div className="mt-5 inline-flex items-center justify-center w-14 h-14 rounded-full border border-border bg-bg-deep text-[#f59e0b] transition-colors duration-300 group-hover:border-[#f59e0b]/40">
                    {s.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-text-primary">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* モバイル用コネクタ矢印 */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden flex justify-center my-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#f59e0b]/40">
                      <path d="M10 4V16M10 16L6 12M10 16L14 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
