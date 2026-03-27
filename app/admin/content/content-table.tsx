"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import { togglePublish } from "./actions";

interface VideoRow {
  id: string;
  title: string;
  access_level: string;
  is_published: boolean;
  is_live: boolean;
  view_count: number | null;
  created_at: string;
}

const accessLabels: Record<string, { label: string; className: string }> = {
  free: { label: "FREE", className: "bg-success/10 text-success" },
  standard: { label: "STANDARD", className: "bg-secondary/10 text-secondary" },
  premium: { label: "PREMIUM", className: "bg-accent/10 text-accent" },
};

export default function ContentTable({ videos }: { videos: VideoRow[] }) {
  const [items, setItems] = useState(videos);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleToggle = (videoId: string, currentValue: boolean) => {
    // 楽観的UI更新
    setItems((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, is_published: !currentValue } : v))
    );

    startTransition(async () => {
      const result = await togglePublish(videoId, !currentValue);
      if (!result.success) {
        // ロールバック
        setItems((prev) =>
          prev.map((v) => (v.id === videoId ? { ...v, is_published: currentValue } : v))
        );
        showToast("公開状態の変更に失敗しました", "error");
      } else {
        showToast(
          !currentValue ? "動画を公開しました" : "動画を非公開にしました",
          "success"
        );
      }
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">タイトル</th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-text-muted sm:table-cell">アクセスレベル</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">公開状態</th>
            <th className="hidden px-4 py-3 text-right text-xs font-medium text-text-muted md:table-cell">再生回数</th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-text-muted lg:table-cell">作成日</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((v) => {
              const access = accessLabels[v.access_level] || accessLabels.free;
              return (
                <tr
                  key={v.id}
                  className="border-b border-[rgba(255,255,255,0.04)] last:border-0 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary line-clamp-1">
                        {v.title}
                      </span>
                      {v.is_live && (
                        <span className="shrink-0 rounded bg-error px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                          LIVE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${access.className}`}>
                      {access.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(v.id, v.is_published)}
                      disabled={isPending}
                      className="relative flex h-11 w-14 items-center justify-center sm:h-8 sm:w-12"
                      aria-label={v.is_published ? "非公開にする" : "公開する"}
                    >
                      <span className={`relative block h-6 w-10 rounded-full transition-colors ${
                        v.is_published ? "bg-success" : "bg-border"
                      }`}>
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            v.is_published ? "translate-x-[18px]" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                    </button>
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono text-xs text-text-muted md:table-cell">
                    {(v.view_count || 0).toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-text-muted lg:table-cell">
                    {new Date(v.created_at).toLocaleDateString("ja-JP")}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-muted">
                コンテンツがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
