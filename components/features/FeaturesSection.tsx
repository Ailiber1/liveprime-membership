"use client";

import { useEffect, useRef } from "react";

interface ContentCard {
  title: string;
  creator: string;
  category: string;
  duration: string;
  thumbnail?: string;
}

const contents: ContentCard[] = [
  {
    title: "VTuber配信テクニック — 初心者からデビューまで",
    creator: "星宮 ルナ",
    category: "VTuber",
    duration: "LIVE",
    thumbnail: "/thumbnails/01-vtuber.png",
  },
  {
    title: "ゲーム実況ライブ — 最新RPG初見プレイ",
    creator: "佐藤 ユウキ",
    category: "ゲーム配信",
    duration: "LIVE",
  },
  {
    title: "歌枠ライブ — リクエスト受付中",
    creator: "鈴木 あかり",
    category: "歌配信",
    duration: "LIVE",
  },
  {
    title: "イラスト制作ライブ — キャラデザ配信",
    creator: "水瀬 ひかる",
    category: "お絵描き配信",
    duration: "1:15:00",
  },
  {
    title: "FPS大会ライブ — チーム戦リアルタイム実況",
    creator: "高橋 レン",
    category: "eスポーツ",
    duration: "LIVE",
  },
  {
    title: "ASMR配信 — 睡眠導入ライブ",
    creator: "中村 あかり",
    category: "ASMR",
    duration: "23:00開始",
  },
];

// 無限ループ用に配列を2倍にする
const loopedContents = [...contents, ...contents, ...contents];

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
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="content-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-wide">
          CONTENTS
        </p>
        <h2 className="content-fade opacity-0 mt-3 font-body text-2xl font-bold text-white sm:text-3xl">
          こんなコンテンツが見られます
        </h2>
      </div>

      {/* 自動スライド */}
      <div className="content-fade opacity-0 mt-10 relative">
        {/* 左右のフェードグラデーション */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent" />

        <div className="flex animate-scroll-x gap-5 pl-5">
          {loopedContents.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:opacity-90"
            >
              {/* サムネイル領域 */}
              <div className="relative aspect-video bg-[#151520]">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                      <path d="M4 2l10 6-10 6V2z" />
                    </svg>
                  </div>
                </div>
                <span className="absolute top-3 left-3 rounded bg-[#0a0a0f]/80 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                  {item.category}
                </span>
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
    </section>
  );
}
