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
    thumbnail: "/thumbnails/03-singing-stream.png",
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

  // 自動回転（3.5秒間隔、ホバー時停止）
  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, isHovered]);

  // フェードイン
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

  function getCardStyle(index: number) {
    let offset = index - current;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);
    const isCenter = offset === 0;

    if (absOffset > 2) {
      return {
        opacity: 0,
        transform: "translateX(0) translateZ(-800px) rotateY(0deg) scale(0.4)",
        zIndex: 0,
        pointerEvents: "none" as const,
      };
    }

    // 中央カードは巨大、左右は奥に沈み込む
    const translateX = offset * 420;
    const translateZ = isCenter ? 0 : -200 - absOffset * 100;
    const rotateY = offset * 25;
    const scale = isCenter ? 1 : 0.72 - (absOffset - 1) * 0.1;
    const zIndex = 20 - absOffset * 5;
    const opacity = isCenter ? 1 : 0.5 - (absOffset - 1) * 0.15;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      opacity: Math.max(opacity, 0.2),
      pointerEvents: (absOffset <= 1 ? "auto" : "none") as "auto" | "none",
    };
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 text-center">
        <p className="content-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
          Now Streaming
        </p>
        <h2 className="content-fade opacity-0 mt-3 font-body text-2xl font-bold text-white sm:text-4xl">
          こんなコンテンツが見られます
        </h2>
      </div>

      {/* 3Dカルーセル */}
      <div
        className="content-fade opacity-0 mt-12 sm:mt-16 relative"
        style={{ perspective: "1400px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 床の反射グラデーション */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent z-10 pointer-events-none" />

        <div className="relative mx-auto flex items-center justify-center" style={{ height: "420px", maxWidth: "100vw" }}>
          {contents.map((item, i) => {
            const style = getCardStyle(i);
            const isCenter = i === current;

            return (
              <Link
                key={item.id}
                href={`/videos/${item.id}`}
                prefetch={true}
                className={`absolute rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  isCenter
                    ? "shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.08)]"
                    : "shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                }`}
                style={{
                  ...style,
                  width: "min(560px, 75vw)",
                  transformStyle: "preserve-3d",
                }}
                onClick={(e) => {
                  if (!isCenter) {
                    e.preventDefault();
                    let offset = i - current;
                    if (offset > total / 2) offset -= total;
                    if (offset < -total / 2) offset += total;
                    if (Math.abs(offset) <= 2) setCurrent(i);
                  }
                }}
              >
                {/* サムネイル — 16:9 */}
                <div className="relative aspect-video bg-[#0c0c14]">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0c0c14]" />
                  )}

                  {/* 中央カードのホバーで再生ボタン */}
                  {isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 hover:bg-black/30">
                      <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                        <svg width="28" height="28" viewBox="0 0 16 16" fill="white">
                          <path d="M4 2l10 6-10 6V2z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* カテゴリ */}
                  <span className="absolute top-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                    {item.category}
                  </span>

                  {/* LIVE / 時間 */}
                  <span className={`absolute bottom-4 right-4 rounded-lg px-3 py-1 text-[11px] font-bold backdrop-blur-sm ${
                    item.duration === "LIVE"
                      ? "bg-[#f59e0b] text-[#0a0a0f] animate-pulse"
                      : "bg-black/60 text-white/90"
                  }`}>
                    {item.duration === "LIVE" ? "● LIVE" : item.duration}
                  </span>
                </div>

                {/* 情報 — 中央カードのみ表示 */}
                {isCenter && (
                  <div className="p-5 bg-[#111118]/95 backdrop-blur-sm">
                    <h3 className="text-base font-semibold text-white leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#8b8ba3]">
                      {item.creator}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* 左右ナビ — 大きめ、半透明 */}
        <button
          onClick={next}
          className="absolute left-4 sm:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 transition-all hover:bg-white/15 hover:text-white hover:scale-110"
          aria-label="前へ"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={prev}
          className="absolute right-4 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 transition-all hover:bg-white/15 hover:text-white hover:scale-110"
          aria-label="次へ"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* ドットインジケーター */}
        <div className="relative z-20 mt-6 flex items-center justify-center gap-2">
          {contents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? "h-2 w-8 bg-[#f59e0b]"
                  : "h-2 w-2 bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.3)]"
              }`}
              aria-label={`コンテンツ ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
