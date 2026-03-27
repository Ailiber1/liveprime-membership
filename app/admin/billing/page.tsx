import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

// 月別モックデータ
const monthlySummary = [
  { month: "2026年3月", revenue: 42600, newSubs: 8, cancels: 2 },
  { month: "2026年2月", revenue: 38900, newSubs: 12, cancels: 3 },
  { month: "2026年1月", revenue: 31400, newSubs: 10, cancels: 1 },
  { month: "2025年12月", revenue: 24200, newSubs: 7, cancels: 2 },
  { month: "2025年11月", revenue: 18600, newSubs: 9, cancels: 1 },
  { month: "2025年10月", revenue: 12800, newSubs: 6, cancels: 0 },
];

export default async function AdminBillingPage() {
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

  // MRR計算
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("status", "active")
    .in("plan", ["standard", "premium"]);

  let mrr = 0;
  let standardCount = 0;
  let premiumCount = 0;
  if (subs) {
    for (const s of subs) {
      if (s.plan === "standard") {
        mrr += 980;
        standardCount++;
      }
      if (s.plan === "premium") {
        mrr += 2980;
        premiumCount++;
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          課金管理
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          売上・サブスクリプションの状況を確認できます
        </p>
      </div>

      {/* MRR & プラン内訳 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            月間経常収益（MRR）
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-text-primary">
            &yen;{mrr.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Standard 会員
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-primary">
            {standardCount}
            <span className="ml-1 text-sm font-normal text-text-muted">人</span>
          </p>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Premium 会員
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-accent">
            {premiumCount}
            <span className="ml-1 text-sm font-normal text-text-muted">人</span>
          </p>
        </div>
      </div>

      {/* Stripeダッシュボードへの導線 */}
      <div className="mb-8 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Stripe ダッシュボード
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              詳細な売上分析・返金処理・顧客管理はStripeダッシュボードで行えます
            </p>
          </div>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#635BFF] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Stripeを開く（デモ）
          </a>
        </div>
      </div>

      {/* 月別サマリー */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-text-primary">
          月別サマリー
        </h2>

        {/* デスクトップ: テーブル表示 */}
        <div className="hidden overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)] sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                  月
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                  売上
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                  新規契約
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                  解約
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((row) => (
                <tr
                  key={row.month}
                  className="border-b border-[rgba(255,255,255,0.04)] last:border-0 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <td className="px-4 py-3 text-text-secondary">
                    {row.month}
                  </td>
                  <td className="px-4 py-3 font-mono text-text-primary">
                    &yen;{row.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-success">
                    +{row.newSubs}
                  </td>
                  <td className="px-4 py-3 text-error">
                    -{row.cancels}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* モバイル: カード型表示 */}
        <div className="space-y-3 sm:hidden">
          {monthlySummary.map((row) => (
            <div
              key={row.month}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
            >
              <p className="mb-2 text-sm font-medium text-text-primary">{row.month}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">売上</p>
                  <p className="font-mono text-sm font-semibold text-text-primary">
                    &yen;{(row.revenue / 1000).toFixed(1)}k
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">新規</p>
                  <p className="font-mono text-sm font-semibold text-success">+{row.newSubs}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">解約</p>
                  <p className="font-mono text-sm font-semibold text-error">-{row.cancels}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
