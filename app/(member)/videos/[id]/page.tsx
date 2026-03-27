import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import PaywallGate from "@/components/features/PaywallGate";
import VideoActions from "./video-actions";
import PlayButton from "./play-button";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}時間${m}分`;
  return `${m}分`;
}

const gradients = [
  "linear-gradient(135deg, #ff005430 0%, #ff005408 100%)",
  "linear-gradient(135deg, #6c5ce730 0%, #6c5ce708 100%)",
  "linear-gradient(135deg, #f5b73130 0%, #f5b73108 100%)",
  "linear-gradient(135deg, #2ed57330 0%, #2ed57308 100%)",
];

// プランの優先度
const planRank: Record<string, number> = {
  free: 0,
  standard: 1,
  premium: 2,
};

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 動画データを取得（video_urlを除く基本カラムのみ）
  const { data: video } = await supabase
    .from("videos")
    .select("id, title, description, thumbnail_url, duration_seconds, access_level, category, is_live, is_published, created_at, created_by")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!video) {
    notFound();
  }

  // ユーザーのサブスクリプション情報
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const userPlan = subscription?.plan || "free";
  const userRank = planRank[userPlan] ?? 0;
  const videoRank = planRank[video.access_level] ?? 0;
  const hasAccess = userRank >= videoRank;

  // アクセス権がある場合のみvideo_urlを取得
  let _videoUrl: string | null = null;
  if (hasAccess) {
    const { data: videoWithUrl } = await supabase
      .from("videos")
      .select("video_url")
      .eq("id", id)
      .single();
    _videoUrl = videoWithUrl?.video_url ?? null;
  }
  // TODO: _videoUrlは将来的にVideoPlayerコンポーネントに渡す
  void _videoUrl;

  // 関連動画（同カテゴリ or ランダム、自身を除く）
  const { data: relatedVideos } = await supabase
    .from("videos")
    .select("id, title, category, duration_seconds, is_live, access_level, is_published, created_at")
    .eq("is_published", true)
    .neq("id", video.id)
    .limit(4);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* パンくずリスト */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-text-muted">
        <Link href="/videos" className="transition-colors hover:text-text-secondary">
          動画コンテンツ
        </Link>
        <span>/</span>
        <span className="text-text-secondary line-clamp-1">{video.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2">
          {/* ペイウォールまたはプレーヤー */}
          {hasAccess ? (
            <div className="relative mb-4 overflow-hidden rounded-xl">
              <div
                className="relative flex aspect-video items-center justify-center"
                style={{
                  background: gradients[video.title.length % gradients.length],
                }}
              >
                {/* 再生ボタン（視聴履歴を記録） */}
                <PlayButton videoId={video.id} userId={user.id} />

                {video.is_live && (
                  <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg bg-error px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    LIVE 配信中
                  </span>
                )}

                {video.duration_seconds > 0 && (
                  <span className="absolute bottom-4 right-4 rounded-lg bg-bg-deep/80 px-2 py-1 font-mono text-xs text-text-secondary">
                    {formatDuration(video.duration_seconds)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <PaywallGate videoTitle={video.title} requiredPlan={video.access_level} />
            </div>
          )}

          {/* 動画情報 */}
          <div className="mb-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {video.access_level === "premium" && (
                <span className="rounded bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep">
                  PREMIUM
                </span>
              )}
              {video.access_level === "free" && (
                <span className="rounded bg-success/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep">
                  FREE
                </span>
              )}
              {video.access_level === "standard" && (
                <span className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  STANDARD
                </span>
              )}
              {video.category && (
                <span className="rounded border border-border px-2 py-0.5 text-[10px] text-text-muted">
                  {video.category}
                </span>
              )}
            </div>

            <h1 className="mb-2 font-display text-lg font-bold text-text-primary sm:text-xl">
              {video.title}
            </h1>

            {/* クリエイター情報 */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                LP
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">LIVE PRIME</p>
                <p className="text-xs text-text-muted">公式チャンネル</p>
              </div>
            </div>

            {/* アクションボタン */}
            <VideoActions videoId={video.id} videoTitle={video.title} />
          </div>

          {/* 説明文 */}
          {video.description && (
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
              <h2 className="mb-2 text-sm font-semibold text-text-primary">概要</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                {video.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 border-t border-[rgba(255,255,255,0.06)] pt-3 text-xs text-text-muted">
                {video.duration_seconds > 0 && (
                  <span>再生時間: {formatDuration(video.duration_seconds)}</span>
                )}
                <span>
                  公開日: {new Date(video.created_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 関連動画サイドバー */}
        <div className="lg:col-span-1">
          <h2 className="mb-4 font-display text-base font-semibold text-text-primary">
            関連動画
          </h2>
          <div className="space-y-3">
            {relatedVideos && relatedVideos.length > 0 ? (
              relatedVideos.map((rv, i) => (
                <Link
                  key={rv.id}
                  href={`/videos/${rv.id}`}
                  className="group flex gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)]"
                >
                  {/* ミニサムネイル */}
                  <div
                    className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg"
                    style={{
                      background: gradients[i % gradients.length],
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    {rv.is_live && (
                      <span className="absolute left-1 top-1 rounded bg-error px-1 py-0.5 text-[8px] font-bold text-white">
                        LIVE
                      </span>
                    )}
                    {rv.duration_seconds && rv.duration_seconds > 0 && (
                      <span className="absolute bottom-1 right-1 rounded bg-bg-deep/80 px-1 py-0.5 font-mono text-[9px] text-text-secondary">
                        {formatDuration(rv.duration_seconds)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-medium text-text-primary line-clamp-2 group-hover:text-white">
                      {rv.title}
                    </h3>
                    <p className="text-xs text-text-muted">LIVE PRIME</p>
                    {rv.category && (
                      <p className="mt-0.5 text-[11px] text-text-muted">{rv.category}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-text-muted">
                関連動画はありません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
