"use client";

import { useState, useMemo } from "react";

interface UserRow {
  id: string;
  displayName: string;
  email: string;
  plan: string;
  status: string;
  role: string;
  createdAt: string;
}

const planLabels: Record<string, string> = {
  free: "Free",
  standard: "Standard",
  premium: "Premium",
};

const planColors: Record<string, string> = {
  free: "bg-border text-text-secondary",
  standard: "bg-primary/10 text-primary",
  premium: "bg-accent/10 text-accent",
};

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: "有効", className: "text-success" },
  canceled: { label: "解約済", className: "text-error" },
  past_due: { label: "遅延", className: "text-accent" },
};

type PlanFilter = "all" | "free" | "standard" | "premium";

const planFilterButtons: { id: PlanFilter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "free", label: "Free" },
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
];

export default function UsersTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");

  const filtered = useMemo(() => {
    let result = users;
    if (planFilter !== "all") {
      result = result.filter((u) => u.plan === planFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, search, planFilter]);

  return (
    <div>
      {/* 検索バー */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="名前またはメールで検索"
            className="w-full rounded-lg border border-border bg-bg-input py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:outline-none"
          />
        </div>
        <span className="text-xs text-text-muted">
          {filtered.length} / {users.length} 件
        </span>
      </div>

      {/* プラン別フィルタ */}
      <div className="mb-4 flex flex-wrap gap-2">
        {planFilterButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setPlanFilter(btn.id)}
            className={`min-h-[44px] border-b-2 px-4 py-2 text-xs font-medium transition-all sm:min-h-0 sm:px-3 sm:py-1.5 ${
              planFilter === btn.id
                ? "border-text-primary text-text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">ユーザー</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-text-muted sm:table-cell">メール</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">プラン</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-text-muted md:table-cell">登録日</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">状態</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((u) => {
                const statusInfo = statusLabels[u.status] || statusLabels.active;
                return (
                  <tr
                    key={u.id}
                    className="border-b border-[rgba(255,255,255,0.04)] last:border-0 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                          {u.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text-primary">
                            {u.displayName}
                          </p>
                          <p className="truncate text-xs text-text-muted sm:hidden">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary sm:table-cell">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${planColors[u.plan] || planColors.free}`}>
                        {planLabels[u.plan] || u.plan}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-text-muted md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-muted">
                  該当するユーザーが見つかりません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
