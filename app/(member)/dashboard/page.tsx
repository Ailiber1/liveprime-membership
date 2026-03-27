import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          ダッシュボード
        </h1>
        <LogoutButton />
      </div>

      <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-3">
          ようこそ
        </h2>
        <p className="text-text-secondary">
          {user.user_metadata?.display_name || user.email} さん、おかえりなさい。
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Phase 2: LP・認証UI・共通コンポーネント実装完了。
        </p>
      </div>
    </div>
  );
}
