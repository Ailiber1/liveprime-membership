"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface ContentCard {
  id: string;
  title: string;
  creator: string;
  category: string;
  duration: string;
  thumbnail?: string;
}

const contents: ContentCard[] = [
  {
    id: "e7785f54-e7cd-4462-b4d0-ebd817b08a18",
    title: "VTuber配信テクニック — 初心者からデビューまで",
    creator: "星宮 ルナ",
    category: "VTuber",
    duration: "LIVE",
    thumbnail: "/thumbnails/01-vtuber.png",
  },
  {
    id: "89cbcd81-7cf8-48ef-b96e-932ce05a2ba0",
    title: "ゲーム実況ライブ — 最新RPG初見プレイ",
    creator: "佐藤 ユウキ",
    category: "ゲーム配信",
    duration: "LIVE",
    thumbnail: "/thumbnails/02-game-stream.jpeg",
  },
  {
    id: "50663b5e-41dc-4ee4-8b6d-f8ee599ea760",
    title: "歌枠ライブ — リクエスト受付中",
    creator: "鈴木 あかり",
    category: "歌配信",
    duration: "LIVE",
  },
  {
    id: "d396d0ac-a8fd-4d88-8481-ec0f273e9e8d",
    title: "イラスト制作ライブ — キャラデザ配信",
    creator: "水瀬 ひかる",
    category: "お絵描き配信",
    duration: "1:15:00",
  },
  {
    id: "3e69b539-e62b-48e1-b2af-8216c2c4a6fc",
    title: "FPS大会ライブ — チーム戦リアルタイム実況",
    creator: "高橋 レン",
    category: "eスポーツ",
    duration: "LIVE",
  },
  {
    id: "c52c1b23-9905-4fa7-b05e-d707a7e19cd9",
    title: "ASMR配信 — 睡眠導入ライブ",
    creator: "中村 あかり",
    category: "ASMR",
    duration: "23:00開始",
  },
];

// 無限ループ用に配列を2倍にする
const loopedContents = [...contents, ...contents, ...contents, ...contents];

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
            <Link
              key={`${item.title}-${i}`}
              href={`/videos/${item.id}`}
              prefetch={true}
              className="group/card relative flex-shrink-0 w-[280px] sm:w-[320px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-3 hover:z-20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
            >
              {/* サムネイル領域 */}
              <div className="relative aspect-video bg-[#151520]">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                  <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 16 16" fill="white">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
