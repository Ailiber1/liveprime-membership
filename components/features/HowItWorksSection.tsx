"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "無料登録",
    description: "メールアドレスだけで30秒。クレジットカードは不要です。",
  },
  {
    number: "02",
    title: "好きな配信を見つける",
    description: "ジャンル・クリエイターから、あなた好みのコンテンツを発見。",
  },
  {
    number: "03",
    title: "プレミアムで全解放",
    description: "月額980円で全コンテンツが見放題。14日間の無料体験付き。",
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
      className="relative py-24 sm:py-32 bg-transparent"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="text-center">
          <p className="how-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="how-fade opacity-0 mt-3 font-body text-2xl font-bold text-text-primary sm:text-4xl">
            始め方はかんたん 3ステップ
          </h2>
        </div>

        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="how-fade opacity-0 relative text-center sm:text-left"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* ステップ番号 */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-bg-card">
                <span className="font-display text-xl font-bold text-[#f59e0b]">
                  {s.number}
                </span>
              </div>

              {/* コネクタライン（モバイル非表示） */}
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-border" />
              )}

              <h3 className="mt-5 text-lg font-semibold text-text-primary">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
