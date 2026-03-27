"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

const PLAN_LABELS: Record<string, string> = {
  standard: "Standard",
  premium: "Premium",
};

export default function WelcomeToast() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const shown = useRef(false);
  const [activatePlan, setActivatePlan] = useState<{
    plan: string;
    interval: string;
  } | null>(null);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (shown.current) return;

    const success = searchParams.get("success");
    if (success === "true") {
      shown.current = true;
      showToast(
        "サブスクリプションの登録が完了しました！ようこそ LIVE PRIME へ。",
        "success"
      );
      window.history.replaceState({}, "", "/dashboard");
      return;
    }

    const plan = searchParams.get("activate_plan");
    const interval = searchParams.get("interval") || "monthly";
    if (plan && PLAN_LABELS[plan]) {
      shown.current = true;
      setActivatePlan({ plan, interval });
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams, showToast]);

  async function handleActivate() {
    if (!activatePlan) return;
    setActivating(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: activatePlan.plan,
          interval: activatePlan.interval,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout sessionの作成に失敗しました");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "エラーが発生しました";
      showToast(message, "error");
      setActivating(false);
    }
  }

  if (!activatePlan) return null;

  const label = PLAN_LABELS[activatePlan.plan];
  const intervalLabel = activatePlan.interval === "yearly" ? "年払い" : "月払い";

  return (
    <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">
            {label}プラン（{intervalLabel}）を有効化しますか？
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            登録時に選択したプランです。決済画面へ進みます。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivatePlan(null)}
            className="rounded-lg border border-border px-4 py-2 text-xs text-text-muted transition-colors hover:border-text-muted"
          >
            あとで
          </button>
          <button
            onClick={handleActivate}
            disabled={activating}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {activating ? "処理中..." : "プランを有効化"}
          </button>
        </div>
      </div>
    </div>
  );
}
