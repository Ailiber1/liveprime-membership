"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const total = contents.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // 自動回転（4秒間隔、ホバー時停止）
  useEffect(() => {
    if (isHovered) return;
    intervalRef.current = setInterval(next, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, isHovered]);

  // フェードインアニメーション
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

  // カードの位置を計算（中央が0、左が負、右が正）
  function getCardStyle(index: number) {
    let offset = index - current;
    // 最短距離でループ
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);
    const isCenterCard = offset === 0;

    // 表示範囲外は非表示
    if (absOffset > 2) {
      return { opacity: 0, transform: "translateX(0) scale(0.5)", zIndex: 0, pointerEvents: "none" as const };
    }

    const translateX = offset * 280;
    const scale = isCenterCard ? 1 : 0.8 - absOffset * 0.05;
    const rotateY = offset * -15;
    const zIndex = 10 - absOffset;
    const opacity = isCenterCard ? 1 : 0.6 - (absOffset - 1) * 0.2;

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity: Math.max(opacity, 0.3),
      pointerEvents: (absOffset <= 1 ? "auto" : "none") as "auto" | "none",
    };
  }

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

      {/* 3Dカルーセル */}
      <div
        className="content-fade opacity-0 mt-14 relative"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mx-auto flex items-center justify-center" style={{ height: "320px" }}>
          {contents.map((item, i) => {
            const style = getCardStyle(i);
            const isCenterCard = i === current;

            return (
              <Link
                key={item.id}
                href={`/videos/${item.id}`}
                prefetch={true}
                className={`absolute w-[300px] sm:w-[360px] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
                  isCenterCard ? "shadow-[0_20px_60px_rgba(0,0,0,0.7)]" : "shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                }`}
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                }}
                onClick={(e) => {
                  if (!isCenterCard && Math.abs(i - current) <= 2) {
                    e.preventDefault();
                    setCurrent(i);
                  }
                }}
              >
                {/* サムネイル */}
                <div className="relative aspect-video bg-[#151520]">
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  {isCenterCard && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 16 16" fill="white">
                          <path d="M4 2l10 6-10 6V2z" />
                        </svg>
                      </div>
                    </div>
                  )}
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
                  <h3 className="text-sm font-medium text-white leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#5a5a72]">
                    {item.creator}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 左右ナビボタン */}
        <button
          onClick={prev}
          className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white transition-colors hover:bg-white/20"
          aria-label="前へ"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white transition-colors hover:bg-white/20"
          aria-label="次へ"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* ドットインジケーター */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {contents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-[#f59e0b]"
                  : "w-1.5 bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.3)]"
              }`}
              aria-label={`コンテンツ ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
