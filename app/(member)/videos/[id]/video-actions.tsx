"use client";

import { useState } from "react";

interface VideoActionsProps {
  videoId: string;
  videoTitle?: string;
}

export default function VideoActions({ videoId }: VideoActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  function handleFavorite() {
    setIsFavorite(!isFavorite);
  }

  async function handleShare() {
    const url = `${window.location.origin}/videos/${videoId}`;
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // フォールバック: テキスト選択
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleFavorite}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
          isFavorite
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border text-text-muted hover:border-primary/30 hover:text-primary"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        {isFavorite ? "お気に入り済み" : "お気に入り"}
      </button>

      <button
        onClick={handleShare}
        className="relative flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:border-text-muted hover:text-text-secondary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        共有
        {showCopied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-success px-2 py-1 text-[10px] font-medium text-white">
            URLをコピーしました
          </span>
        )}
      </button>
    </div>
  );
}
