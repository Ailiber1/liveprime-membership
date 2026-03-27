import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import VideosGrid from "./videos-grid";

export default async function VideosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 動画を全件取得
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, description, thumbnail_url, duration_seconds, access_level, category, is_live, is_published, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // ユーザーのサブスクリプション情報
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          動画コンテンツ
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          配信スキルを磨くための動画コンテンツを探す
        </p>
      </div>

      <VideosGrid
        videos={videos || []}
        userPlan={subscription?.plan || "free"}
      />
    </div>
  );
}
