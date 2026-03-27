import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import SettingsTabs from "./settings-tabs";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // プロフィール情報を取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, bio, role")
    .eq("id", user.id)
    .single();

  // サブスクリプション情報を取得
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_start, current_period_end")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="p-4 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          設定
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          アカウント情報やサブスクリプションを管理
        </p>
      </div>

      <SettingsTabs
        userId={user.id}
        email={user.email || ""}
        profile={{
          displayName: profile?.display_name || "",
          avatarUrl: profile?.avatar_url || "",
          bio: profile?.bio || "",
        }}
        subscription={{
          plan: subscription?.plan || "free",
          status: subscription?.status || "active",
          currentPeriodStart: subscription?.current_period_start || null,
          currentPeriodEnd: subscription?.current_period_end || null,
        }}
        provider={user.app_metadata?.provider || "email"}
      />
    </div>
  );
}
