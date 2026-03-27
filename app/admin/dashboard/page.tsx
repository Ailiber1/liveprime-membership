import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./admin-dashboard-client";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // adminロール確認
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // 総ユーザー数
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  // 有料会員数
  const { count: paidUsers } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .in("plan", ["standard", "premium"])
    .eq("status", "active");

  // 解約数
  const { count: canceledUsers } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "canceled");

  const total = totalUsers || 0;
  const paid = paidUsers || 0;
  const canceled = canceledUsers || 0;
  const churnRate = total > 0 ? ((canceled / total) * 100).toFixed(1) : "0.0";

  // MRR計算（モック: standard=980, premium=2980）
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("status", "active")
    .in("plan", ["standard", "premium"]);

  let mrr = 0;
  if (subs) {
    for (const s of subs) {
      if (s.plan === "standard") mrr += 980;
      if (s.plan === "premium") mrr += 2980;
    }
  }

  return (
    <AdminDashboardClient
      totalUsers={total}
      mrr={mrr}
      paidUsers={paid}
      churnRate={churnRate}
    />
  );
}
