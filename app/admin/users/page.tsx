import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import UsersTable from "./users-table";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // profiles + subscriptions をJOINして取得
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, email, role, created_at, subscriptions(plan, status)")
    .order("created_at", { ascending: false });

  const users = (profiles || []).map((p) => {
    const sub = Array.isArray(p.subscriptions) ? p.subscriptions[0] : p.subscriptions;
    return {
      id: p.id,
      displayName: p.display_name || "—",
      email: p.email || "—",
      plan: sub?.plan || "free",
      status: sub?.status || "active",
      role: p.role || "member",
      createdAt: p.created_at,
    };
  });

  return (
    <div className="p-4 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          ユーザー管理
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          登録ユーザーの管理と検索
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
