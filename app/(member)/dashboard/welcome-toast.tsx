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

    const plan = searchParams.get("activate_plan");
    const interval = searchParams.get("interval") || "monthly";
    if (plan && PLAN_LABELS[plan]) {
      shown.current = true;
      setActivatePlan({ plan, interval });
      window.history.replaceState({}, "", "/dashboard");
      // 自動でStripe Checkoutに遷移
      autoActivate(plan, interval);
    }
  }, [searchParams, showToast]);

  async function autoActivate(plan: string, interval: string) {
    setActivating(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan, interval }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Checkout sessionの作成に失敗しました");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "エラーが発生しました";
      showToast(message, "error");
      setActivating(false);
    }
  }

  async function handleActivate() {
    if (!activatePlan) return;
    autoActivate(activatePlan.plan, activatePlan.interval);
  }

  if (!activatePlan) return null;

  const label = PLAN_LABELS[activatePlan.plan];
  const intervalLabel = activatePlan.interval === "yearly" ? "年払い" : "月払い";

  return (
    <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div>
            <p className="text-sm font-medium text-text-primary">
              {label}プラン（{intervalLabel}）の決済画面に移動中...
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              しばらくお待ちください。自動で決済画面に遷移します。
            </p>
          </div>
        </div>
        {!activating && (
          <button
            onClick={handleActivate}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
          >
            決済画面へ
          </button>
        )}
      </div>
    </div>
  );
}
