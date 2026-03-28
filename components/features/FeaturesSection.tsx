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
    thumbnail: "/thumbnails/04-illustration-stream.png",
  },
  {
    id: "3e69b539-e62b-48e1-b2af-8216c2c4a6fc",
    title: "FPS大会ライブ — チーム戦リアルタイム実況",
    creator: "高橋 レン",
    category: "eスポーツ",
    duration: "LIVE",
    thumbnail: "/thumbnails/05-fps-esports.png",
  },
  {
    id: "c52c1b23-9905-4fa7-b05e-d707a7e19cd9",
    title: "ASMR配信 — 睡眠導入ライブ",
    creator: "中村 あかり",
    category: "ASMR",
    duration: "23:00開始",
    thumbnail: "/thumbnails/06-asmr-stream.png",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const total = contents.length;
  const radiusX = 650; // 楕円の横半径（広い）
  const radiusZ = 350; // 楕円の奥行き半径（浅い）

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // 自動回転
  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, 2000);
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
    // 各カードの角度を計算（円周上に均等配置）
    const angleStep = (2 * Math.PI) / total;
    let offset = index - current;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const angle = offset * angleStep;

    // 楕円軌道上の位置を計算
    const x = Math.sin(angle) * radiusX;
    const z = Math.cos(angle) * radiusZ - radiusZ; // 手前が0、奥がマイナス
    const rotateY = -angle * (180 / Math.PI); // ラジアン→度（軌道に忠実）

    // 奥にあるほど暗く小さく
    const isCenter = offset === 0;
    const depthRatio = (z + radiusZ) / (2 * radiusZ); // 0(最奥)〜1(最前面)
    const scale = isCenter ? 1 : 0.5 + depthRatio * 0.35;
    const opacity = isCenter ? 1 : 0.2 + depthRatio * 0.5;
    const zIndex = isCenter ? 30 : Math.round(depthRatio * 20);
    const isClickable = Math.abs(offset) <= 1;

    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: (isClickable ? "auto" : "none") as "auto" | "none",
      isCenter,
      offset,
    };
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden bg-transparent"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 text-center">
        <p className="content-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
          Now Streaming
        </p>
        <h2 className="content-fade opacity-0 mt-3 font-body text-xl font-bold text-text-primary sm:text-4xl">
          こんなコンテンツが見られます
        </h2>
      </div>

      {/* 3D円形カルーセル */}
      <div
        className="content-fade opacity-0 mt-12 sm:mt-16 relative"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative mx-auto flex items-center justify-center"
          style={{ height: "620px", transformStyle: "preserve-3d" }}
        >
          {contents.map((item, i) => {
            const { isCenter, offset: cardOffset, ...style } = getCardStyle(i);

            return (
              <Link
                key={item.id}
                href={`/videos/${item.id}`}
                prefetch={true}
                className={`absolute rounded-2xl overflow-hidden cursor-pointer transition-[transform,opacity,box-shadow] duration-150 ease-linear ${
                  isCenter
                    ? "shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_80px_rgba(245,158,11,0.12),0_0_160px_rgba(245,158,11,0.04)]"
                    : "shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                }`}
                style={{
                  ...style,
                  width: "min(920px, 94vw)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                onClick={(e) => {
                  if (!isCenter) {
                    e.preventDefault();
                    let offset = i - current;
                    if (offset > total / 2) offset -= total;
                    if (offset < -total / 2) offset += total;
                    if (Math.abs(offset) <= 1) setCurrent(i);
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

                  {/* サイドカードの軽い影 */}
                  {!isCenter && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: cardOffset > 0
                          ? "linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 30%)"
                          : "linear-gradient(to left, rgba(0,0,0,0.25) 0%, transparent 30%)",
                      }}
                    />
                  )}

                  {isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 hover:bg-black/30 group/play">
                      <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center opacity-0 transition-all duration-300 group-hover/play:opacity-100 group-hover/play:scale-110">
                        <svg width="28" height="28" viewBox="0 0 16 16" fill="white">
                          <path d="M4 2l10 6-10 6V2z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <span className="absolute top-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                    {item.category}
                  </span>

                  <span className={`absolute bottom-4 right-4 rounded-lg px-3 py-1 text-[11px] font-bold backdrop-blur-sm ${
                    item.duration === "LIVE"
                      ? "bg-[#f59e0b] text-[#0a0a0f] animate-pulse"
                      : "bg-black/60 text-white/90"
                  }`}>
                    {item.duration === "LIVE" ? "● LIVE" : item.duration}
                  </span>
                </div>

                <div className={`p-5 bg-[#111118]/95 backdrop-blur-sm transition-opacity duration-150 ${isCenter ? "opacity-100" : "opacity-0"}`}>
                  <h3 className="text-base font-semibold text-white leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#8b8ba3]">
                    {item.creator}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 左右ナビ — 長押しで高速回転 */}
        <button
          onMouseDown={() => {
            let moved = false;
            const timer = setTimeout(() => { moved = true; }, 200);
            const id = setInterval(() => { if (moved) next(); }, 60);
            const up = () => {
              clearTimeout(timer);
              clearInterval(id);
              if (!moved) next();
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mouseup", up);
          }}
          className="absolute left-4 sm:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 transition-all hover:bg-white/15 hover:text-white hover:scale-110"
          aria-label="前へ"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onMouseDown={() => {
            let moved = false;
            const timer = setTimeout(() => { moved = true; }, 200);
            const id = setInterval(() => { if (moved) prev(); }, 60);
            const up = () => {
              clearTimeout(timer);
              clearInterval(id);
              if (!moved) prev();
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mouseup", up);
          }}
          className="absolute right-4 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 transition-all hover:bg-white/15 hover:text-white hover:scale-110"
          aria-label="次へ"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* ドットインジケーター削除 */}
      </div>
    </section>
  );
}
