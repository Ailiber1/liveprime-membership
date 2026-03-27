import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./logout-button";
import WelcomeToast from "./welcome-toast";

// キャッシュを無効化して常に最新データを取得
export const dynamic = "force-dynamic";

interface WatchHistoryVideo {
  id: string;
  title: string;
  category: string | null;
  duration_seconds: number;
  is_live: boolean;
  access_level: string;
  is_published?: boolean;
}

interface WatchHistoryEntry {
  id: string;
  watched_seconds: number;
  completed: boolean;
  last_watched_at: string;
  videos: WatchHistoryVideo | WatchHistoryVideo[] | null;
}

function getVideo(entry: WatchHistoryEntry): WatchHistoryVideo | null {
  if (!entry.videos) return null;
  return Array.isArray(entry.videos) ? entry.videos[0] : entry.videos;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}時間${m}分`;
  return `${m}分`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // サブスクリプション情報を取得（.maybeSingle()でnull許容）
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  // 最近の動画を取得（公開済み、最新4件）
  const { data: recentVideos } = await supabase
    .from("videos")
    .select("id, title, category, duration_seconds, is_live, access_level, is_published, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // 視聴履歴を取得
  const { data: watchHistoryRaw } = await supabase
    .from("watch_history")
    .select("id, watched_seconds, completed, last_watched_at, videos(id, title, category, duration_seconds, is_live, access_level)")
    .eq("user_id", user.id)
    .order("last_watched_at", { ascending: false })
    .limit(4);
  const watchHistory = watchHistoryRaw as unknown as WatchHistoryEntry[] | null;

  // 続きを見る（未完了の視聴履歴）
  const { data: continueWatchingRaw } = await supabase
    .from("watch_history")
    .select("id, watched_seconds, completed, last_watched_at, videos(id, title, category, duration_seconds, is_live, access_level, is_published)")
    .eq("user_id", user.id)
    .eq("completed", false)
    .order("last_watched_at", { ascending: false })
    .limit(4);
  const continueWatching = continueWatchingRaw as unknown as WatchHistoryEntry[] | null;

  const totalWatchSeconds = watchHistory?.reduce((sum, w) => sum + (w.watched_seconds || 0), 0) || 0;
  const completedCount = watchHistory?.filter((w) => w.completed).length || 0;

  const planLabels: Record<string, string> = {
    free: "Free",
    standard: "Standard",
    premium: "Premium",
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: "有効", color: "text-success" },
    canceled: { label: "解約済み", color: "text-error" },
    past_due: { label: "支払い遅延", color: "text-accent" },
    trialing: { label: "トライアル中", color: "text-secondary" },
  };

  const currentPlan = subscription?.plan || "free";
  const currentStatus = subscription?.status || "active";
  const statusInfo = statusLabels[currentStatus] || statusLabels.active;

  // グラデーションカラー配列（サムネイル用）
  const gradients = [
    "linear-gradient(135deg, #ff005440, #ff005410)",
    "linear-gradient(135deg, #6c5ce740, #6c5ce710)",
    "linear-gradient(135deg, #f5b73140, #f5b73110)",
    "linear-gradient(135deg, #2ed57340, #2ed57310)",
  ];

  return (
    <div className="p-4 sm:p-8 lg:p-10">
      {/* Stripe Checkout成功時のウェルカムトースト */}
      <WelcomeToast />

      {/* ヘッダー */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
            ダッシュボード
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {user.user_metadata?.display_name || user.email} さん、おかえりなさい。
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* KPIカード */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-xs text-text-muted">視聴時間</span>
          </div>
          <p className="font-mono text-lg font-semibold text-text-primary sm:text-xl">
            {totalWatchSeconds > 0 ? formatDuration(totalWatchSeconds) : "0分"}
          </p>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-xs text-text-muted">完了コース</span>
          </div>
          <p className="font-mono text-lg font-semibold text-text-primary sm:text-xl">
            {completedCount}
          </p>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span className="text-xs text-text-muted">お気に入り</span>
          </div>
          <p className="font-mono text-lg font-semibold text-text-primary sm:text-xl">
            0
          </p>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs text-text-muted">連続視聴</span>
          </div>
          <p className="font-mono text-lg font-semibold text-text-primary sm:text-xl">
            {watchHistory && watchHistory.length > 0 ? "1日" : "0日"}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* メインコンテンツ（左2/3） */}
        <div className="space-y-8 lg:col-span-2">
          {/* サブスクリプション状態カード */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                  現在のプラン
                </h2>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-bold text-text-primary">
                    {planLabels[currentPlan]}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                {currentPlan !== "free" && (
                  <p className="mt-2 text-sm text-text-secondary">
                    {currentPlan === "premium" ? "すべての機能をご利用いただけます" : "HD画質・ライブ配信をご利用いただけます"}
                  </p>
                )}
              </div>
              {currentPlan === "free" ? (
                <Link
                  href="/pricing"
                  prefetch={true}
                  className="rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  アップグレード
                </Link>
              ) : (
                <Link
                  href="/settings"
                  prefetch={true}
                  className="rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-text-secondary"
                >
                  プラン管理
                </Link>
              )}
            </div>
            {subscription?.current_period_end && currentPlan !== "free" && (
              <p className="mt-3 text-xs text-text-muted">
                次回更新日: {new Date(subscription.current_period_end).toLocaleDateString("ja-JP")}
              </p>
            )}
          </div>

          {/* 続きを見る */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-text-primary">
                続きを見る
              </h2>
              <Link href="/videos" prefetch={true} className="text-xs text-text-muted transition-colors hover:text-primary">
                すべて見る &rarr;
              </Link>
            </div>
            {continueWatching && continueWatching.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {continueWatching.map((entry, i) => (
                  <Link
                    key={entry.id}
                    href={`/videos/${getVideo(entry)?.id}`}
                    className="group overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] transition-colors hover:border-[rgba(255,255,255,0.12)]"
                  >
                    <div
                      className="relative aspect-video"
                      style={{ background: gradients[i % gradients.length] }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-white">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      {getVideo(entry)?.is_live && (
                        <span className="absolute left-2 top-2 rounded bg-error px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          LIVE
                        </span>
                      )}
                      {getVideo(entry)?.access_level === "premium" && (
                        <span className="absolute right-2 top-2 rounded bg-accent/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep">
                          PREMIUM
                        </span>
                      )}
                      {getVideo(entry)?.duration_seconds && getVideo(entry)!.duration_seconds > 0 && (
                        <span className="absolute bottom-2 right-2 rounded bg-bg-deep/80 px-1.5 py-0.5 text-[10px] font-mono text-text-secondary">
                          {formatDuration(getVideo(entry)!.duration_seconds)}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-text-primary line-clamp-1">
                        {getVideo(entry)?.title || "動画"}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {getVideo(entry)?.category}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] py-8 text-center text-sm text-text-muted">
                まだ視聴履歴がありません
              </p>
            )}
          </div>

          {/* 最近の動画 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-text-primary">
                最近の動画
              </h2>
              <Link href="/videos" prefetch={true} className="text-xs text-text-muted transition-colors hover:text-primary">
                すべて見る &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recentVideos && recentVideos.length > 0 ? (
                recentVideos.map((video, i) => (
                  <Link
                    key={video.id}
                    href={`/videos/${video.id}`}
                    className="group overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] transition-colors hover:border-[rgba(255,255,255,0.12)]"
                  >
                    {/* サムネイル */}
                    <div
                      className="relative aspect-video"
                      style={{ background: gradients[i % gradients.length] }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-white">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      {video.is_live && (
                        <span className="absolute left-2 top-2 rounded bg-error px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          LIVE
                        </span>
                      )}
                      {video.access_level === "premium" && (
                        <span className="absolute right-2 top-2 rounded bg-accent/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep">
                          PREMIUM
                        </span>
                      )}
                      {video.access_level === "free" && (
                        <span className="absolute right-2 top-2 rounded bg-success/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-deep">
                          FREE
                        </span>
                      )}
                      {video.duration_seconds > 0 && (
                        <span className="absolute bottom-2 right-2 rounded bg-bg-deep/80 px-1.5 py-0.5 text-[10px] font-mono text-text-secondary">
                          {formatDuration(video.duration_seconds)}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-text-primary line-clamp-1">
                        {video.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-muted">{video.category}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-2 py-8 text-center text-sm text-text-muted">
                  まだ動画がありません
                </p>
              )}
            </div>
          </div>
        </div>

        {/* サイドバー（右1/3） */}
        <div className="space-y-8">
          {/* アクティビティフィード */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
            <h2 className="mb-4 font-display text-base font-semibold text-text-primary">
              アクティビティ
            </h2>
            <div className="space-y-4">
              {watchHistory && watchHistory.length > 0 ? (
                watchHistory.map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-text-primary">
                        {getVideo(entry)?.title || "動画"}を視聴
                      </p>
                      <p className="text-xs text-text-muted">
                        {new Date(entry.last_watched_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-text-primary">アカウントを作成しました</p>
                      <p className="text-xs text-text-muted">
                        {new Date(user.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-text-primary">
                        {planLabels[currentPlan]}プランで利用開始
                      </p>
                      <p className="text-xs text-text-muted">
                        {new Date(user.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* クイックリンク */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
            <h2 className="mb-4 font-display text-base font-semibold text-text-primary">
              クイックリンク
            </h2>
            <div className="space-y-2">
              <Link
                href="/videos"
                prefetch={true}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M10 9l4 2.5-4 2.5V9z" fill="currentColor" stroke="none" />
                </svg>
                動画一覧を見る
              </Link>
              <Link
                href="/settings"
                prefetch={true}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
                </svg>
                アカウント設定
              </Link>
              {currentPlan === "free" && (
                <Link
                  href="/pricing"
                  prefetch={true}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary transition-colors hover:bg-primary/5"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  プランをアップグレード
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
