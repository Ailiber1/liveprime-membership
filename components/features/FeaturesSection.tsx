"use client";

import { useEffect, useRef } from "react";

interface ContentCard {
  title: string;
  creator: string;
  category: string;
  duration: string;
}

const contents: ContentCard[] = [
  {
    title: "Behind the Stage — 舞台裏ドキュメンタリー",
    creator: "佐藤美咲",
    category: "ドキュメンタリー",
    duration: "45:00",
  },
  {
    title: "プロが教える映像編集マスターコース",
    creator: "田中裕也",
    category: "チュートリアル",
    duration: "1:20:00",
  },
  {
    title: "Acoustic Live Session vol.12",
    creator: "山本健太",
    category: "ライブ配信",
    duration: "LIVE",
  },
  {
    title: "週末キッチン — 季節の和食レシピ",
    creator: "中村あかり",
    category: "料理",
    duration: "32:00",
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
      { threshold: 0.1 }
    );

    const els = section.querySelectorAll(".content-fade");
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32"
      style={{ background: "#0a0a0f" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="content-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-wide">
          CONTENTS
        </p>
        <h2 className="content-fade opacity-0 mt-3 font-body text-2xl font-bold text-white sm:text-3xl">
          こんなコンテンツが見られます
        </h2>

        {/* 横スクロールカード */}
        <div className="mt-10 -mx-5 sm:-mx-6">
          <div className="flex gap-4 overflow-x-auto px-5 sm:px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
            {contents.map((item, i) => (
              <div
                key={item.title}
                className="content-fade opacity-0 flex-shrink-0 w-[280px] sm:w-[320px] snap-start rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* サムネイル領域 */}
                <div className="relative aspect-video bg-[#151520]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                        <path d="M4 2l10 6-10 6V2z" />
                      </svg>
                    </div>
                  </div>
                  {/* カテゴリタグ */}
                  <span className="absolute top-3 left-3 rounded bg-[#0a0a0f]/80 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                    {item.category}
                  </span>
                  {/* 再生時間 */}
                  <span className={`absolute bottom-3 right-3 rounded px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
                    item.duration === "LIVE"
                      ? "bg-[#f59e0b]/90 text-[#0a0a0f]"
                      : "bg-[#0a0a0f]/80 text-white/80"
                  }`}>
                    {item.duration}
                  </span>
                </div>
                {/* 情報 */}
                <div className="p-4 bg-[#111118]">
                  <h3 className="text-sm font-medium text-white leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#5a5a72]">
                    {item.creator}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
