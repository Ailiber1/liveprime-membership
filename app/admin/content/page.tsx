import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import ContentTable from "./content-table";

export default async function AdminContentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 動画一覧を取得
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, access_level, is_published, is_live, view_count, created_at")
    .order("created_at", { ascending: false });

  // 統計
  const allVideos = videos || [];
  const publishedCount = allVideos.filter((v) => v.is_published).length;
  const liveCount = allVideos.filter((v) => v.is_live).length;
  const draftCount = allVideos.filter((v) => !v.is_published).length;

  return (
    <div className="p-4 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          コンテンツ管理
        </h1>
        <p className="mt-1 text-sm text-text-muted">動画コンテンツの管理と公開設定</p>
      </div>

      {/* コンテンツ統計 */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
          <p className="text-xs text-text-muted">公開中の動画</p>
          <p className="mt-1 font-mono text-lg font-semibold text-text-primary">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
          <p className="text-xs text-text-muted">ライブ予定</p>
          <p className="mt-1 font-mono text-lg font-semibold text-text-primary">{liveCount}</p>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
          <p className="text-xs text-text-muted">下書き</p>
          <p className="mt-1 font-mono text-lg font-semibold text-text-primary">{draftCount}</p>
        </div>
      </div>

      <ContentTable videos={allVideos} />
    </div>
  );
}
