"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  access_level: string;
  category: string | null;
  is_live: boolean;
  created_at: string;
}

interface VideosGridProps {
  videos: Video[];
  userPlan: string;
}

type FilterType = "all" | "free" | "premium" | "live";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const gradients = [
  "linear-gradient(135deg, #ff005430 0%, #ff005408 100%)",
  "linear-gradient(135deg, #6c5ce730 0%, #6c5ce708 100%)",
  "linear-gradient(135deg, #f5b73130 0%, #f5b73108 100%)",
  "linear-gradient(135deg, #2ed57330 0%, #2ed57308 100%)",
  "linear-gradient(135deg, #ff005420 0%, #6c5ce710 100%)",
  "linear-gradient(135deg, #f5b73120 0%, #ff005410 100%)",
];

export default function VideosGrid({ videos, userPlan }: VideosGridProps) {
  // userPlanは将来ペイウォール表示に使用
  void userPlan;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCardClick = useCallback((videoId: string) => {
    setLoadingId(videoId);
  }, []);

  const filteredVideos = useMemo(() => {
    let filtered = videos;

    // テキスト検索
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.description && v.description.toLowerCase().includes(q)) ||
          (v.category && v.category.toLowerCase().includes(q))
      );
    }

    // フィルタ
    switch (activeFilter) {
      case "free":
        filtered = filtered.filter((v) => v.access_level === "free");
        break;
      case "premium":
        filtered = filtered.filter(
          (v) => v.access_level === "premium" || v.access_level === "standard"
        );
        break;
      case "live":
        filtered = filtered.filter((v) => v.is_live);
        break;
    }

    return filtered;
  }, [videos, searchQuery, activeFilter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "free", label: "無料" },
    { key: "premium", label: "プレミアム" },
    { key: "live", label: "ライブ" },
  ];

  return (
    <>
      {/* 検索とフィルタ */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* 検索バー */}
        <div className="relative max-w-sm flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タイトルで検索..."
            className="w-full rounded-lg border border-border bg-bg-input py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* フィルタボタン */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-xs font-medium transition-colors sm:min-h-0 ${
                activeFilter === filter.key
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "border border-border text-text-muted hover:text-text-secondary hover:border-border"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 動画グリッド */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video, i) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              prefetch={true}
              onClick={() => handleCardClick(video.id)}
              className={`group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] transition-all hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.05)] ${loadingId === video.id ? "opacity-70" : ""}`}
            >
              {/* ローディングバー */}
              {loadingId === video.id && (
                <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden bg-primary/20 z-10">
                  <div className="h-full w-1/3 bg-primary loading-bar" />
                </div>
              )}
              {/* サムネイル */}
              <div
                className="relative aspect-video"
                style={{ background: gradients[i % gradients.length] }}
              >
                {/* 再生ボタン */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-white">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                {/* バッジ */}
                {video.is_live && (
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded bg-error px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                )}
                {video.access_level === "premium" && (
                  <span className="absolute right-2.5 top-2.5 rounded bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep">
                    PREMIUM
                  </span>
                )}
                {video.access_level === "free" && (
                  <span className="absolute right-2.5 top-2.5 rounded bg-success/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep">
                    FREE
                  </span>
                )}
                {video.access_level === "standard" && !video.is_live && (
                  <span className="absolute right-2.5 top-2.5 rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    STANDARD
                  </span>
                )}

                {/* 再生時間 */}
                {video.duration_seconds && video.duration_seconds > 0 && (
                  <span className="absolute bottom-2.5 right-2.5 rounded bg-bg-deep/80 px-1.5 py-0.5 font-mono text-[11px] text-text-secondary">
                    {formatDuration(video.duration_seconds)}
                  </span>
                )}
              </div>

              {/* テキスト情報 */}
              <div className="p-4">
                <h3 className="mb-1 text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-white">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="mb-2 text-xs text-text-muted line-clamp-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  {video.category && (
                    <span className="text-[11px] text-text-muted">{video.category}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-16">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="mb-3 text-text-muted"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M10 9l4 2.5-4 2.5V9z" />
          </svg>
          <p className="text-sm text-text-muted">
            {searchQuery
              ? `「${searchQuery}」に一致する動画が見つかりません`
              : "動画が見つかりません"}
          </p>
        </div>
      )}
    </>
  );
}
