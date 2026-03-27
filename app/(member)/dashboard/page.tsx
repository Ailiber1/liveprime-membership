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
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-primary">LIVE</span>{" "}
            <span className="text-text-primary">PRIME</span>
          </h1>
          <LogoutButton />
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold mb-4">
            ダッシュボード
          </h2>
          <p className="text-text-secondary">
            ようこそ、{user.email} さん
          </p>
          <p className="text-text-muted text-sm mt-2">
            Phase 1: 認証基盤が正常に動作しています。
          </p>
        </div>
      </div>
    </main>
  );
}
