"use client";

import { useEffect, useRef } from "react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "4K高画質配信",
    description:
      "最新のストリーミング技術で、どのデバイスからでも圧倒的な映像品質を体験。低遅延で安定した配信環境を実現。",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="24" height="16" rx="2" />
        <path d="M9 24h10M14 20v4" />
        <text x="8" y="15" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="monospace">4K</text>
      </svg>
    ),
  },
  {
    title: "限定コンテンツ",
    description:
      "ここでしか見られないプレミアム動画、舞台裏映像、メイキング。会員だけの特別なコンテンツライブラリ。",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2l3 6 7 1-5 5 1.2 7L14 18l-6.2 3L9 14l-5-5 7-1 3-6z" />
      </svg>
    ),
  },
  {
    title: "コミュニティ",
    description:
      "チャットやコメントでクリエイターと直接交流。同じ趣味を持つ仲間とのつながりが広がるコミュニティ。",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="4" />
        <circle cx="19" cy="10" r="4" />
        <path d="M2 24c0-4 3.6-7 8-7 1.4 0 2.7.3 3.8.8" />
        <path d="M14.2 17.8c1.1-.5 2.4-.8 3.8-.8 4.4 0 8 3 8 7" />
      </svg>
    ),
  },
  {
    title: "収益化サポート",
    description:
      "クリエイターの収益を最大化する分析ツール、サブスクリプション管理、プロモーション機能を提供。",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 22V12l4-3v13" />
        <path d="M10 22V10l4-4v16" />
        <path d="M16 22V8l4-2v16" />
        <path d="M22 22V4l2-1v19" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
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

    const cards = section.querySelectorAll(".feature-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-primary">
            FEATURES
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
            選ばれる理由
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            LIVE PRIMEが提供する、他にはないプレミアムな体験
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card opacity-0 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6 transition-all duration-300 hover:border-primary/20 hover:bg-[rgba(255,255,255,0.05)]"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
