"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/layout/Header";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  accent?: string;
}

const PLAN_ORDER = { free: 0, standard: 1, premium: 2 } as const;

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "まずは無料でお試し",
    features: [
      { text: "無料コンテンツの視聴", included: true },
      { text: "月5本まで視聴", included: true },
      { text: "SD画質（480p）", included: true },
      { text: "Standard / Premiumコンテンツ", included: false },
      { text: "ライブ配信の視聴", included: false },
      { text: "オフライン再生", included: false },
      { text: "優先サポート", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    monthlyPrice: 980,
    yearlyPrice: 8160,
    description: "本格的に学びたい方へ",
    popular: true,
    features: [
      { text: "無料コンテンツの視聴", included: true },
      { text: "無制限視聴", included: true },
      { text: "HD画質（1080p）", included: true },
      { text: "Standardコンテンツ", included: true },
      { text: "ライブ配信の視聴", included: true },
      { text: "オフライン再生", included: false },
      { text: "優先サポート", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 2980,
    yearlyPrice: 24800,
    description: "すべての機能を解放",
    accent: "accent",
    features: [
      { text: "無料コンテンツの視聴", included: true },
      { text: "無制限視聴", included: true },
      { text: "4K画質（2160p）", included: true },
      { text: "全コンテンツアクセス", included: true },
      { text: "ライブ配信の視聴", included: true },
      { text: "オフライン再生", included: true },
      { text: "優先サポート", included: true },
    ],
  },
];

type PlanId = "free" | "standard" | "premium";

function getButtonLabel(
  planId: string,
  currentPlan: PlanId | null,
  isLoggedIn: boolean
): { label: string; type: "current" | "upgrade" | "downgrade" | "default" } {
  if (!isLoggedIn || !currentPlan) {
    if (planId === "free") return { label: "無料で始める", type: "default" };
    return { label: "今すぐ始める", type: "default" };
  }

  if (planId === currentPlan) {
    return { label: "現在のプラン", type: "current" };
  }

  const currentOrder = PLAN_ORDER[currentPlan];
  const targetOrder = PLAN_ORDER[planId as PlanId];

  if (targetOrder > currentOrder) {
    return { label: "アップグレード", type: "upgrade" };
  }
  return { label: "ダウングレード", type: "downgrade" };
}

export default function PricingContent() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanId | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  // 認証状態とサブスクリプション情報を取得
  useEffect(() => {
    async function fetchUserPlan() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (sub?.plan) {
          setCurrentPlan(sub.plan as PlanId);
        }
      }
      setAuthChecked(true);
    }
    fetchUserPlan();
  }, []);

  // キャンセル時のトースト表示
  const canceledShown = useRef(false);
  useEffect(() => {
    if (canceled === "true" && !canceledShown.current) {
      canceledShown.current = true;
      showToast("決済がキャンセルされました。いつでもプランを選択できます。", "info");
    }
  }, [canceled, showToast]);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      if (isLoggedIn && currentPlan === "free") {
        return; // 現在のプラン → 何もしない
      }
      showToast("Freeプランは登録するだけでご利用いただけます", "info");
      return;
    }

    // 現在のプランと同じなら何もしない
    if (isLoggedIn && planId === currentPlan) {
      return;
    }

    // ログイン状態を確認
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // 未ログイン: プラン情報付きで登録ページへリダイレクト
      const interval = isYearly ? "yearly" : "monthly";
      window.location.href = `/register?plan=${planId}&interval=${interval}`;
      return;
    }

    setLoadingPlan(planId);

    try {
      const interval = isYearly ? "yearly" : "monthly";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, interval }),
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
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(price);
  };

  return (
    <div className="min-h-screen bg-bg-deep">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-24">
        {/* キャンセル時のバナー */}
        {canceled === "true" && (
          <div className="mb-8 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-center text-sm text-accent">
            決済がキャンセルされました。いつでもプランを選択できます。
          </div>
        )}

        {/* タイトル */}
        <div className="mb-10 text-center sm:mb-12">
          <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            あなたに合ったプランを選ぶ
          </h1>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            すべてのプランで基本機能をご利用いただけます。いつでもアップグレード・ダウングレードが可能です。
          </p>
        </div>

        {/* 月払い/年払いトグル */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className={`text-sm ${!isYearly ? "text-text-primary font-medium" : "text-text-muted"}`}>
              月払い
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative h-7 w-12 shrink-0 rounded-full bg-border transition-colors"
              aria-label="年払いに切り替え"
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-primary transition-transform ${
                  isYearly ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? "text-text-primary font-medium" : "text-text-muted"}`}>
              年払い
            </span>
          </div>
          {isYearly && (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
              最大30%お得
            </span>
          )}
        </div>

        {/* プランカード */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isPopular = plan.popular;
            const isPremium = plan.id === "premium";
            const isLoading = loadingPlan === plan.id;
            const isCurrent = authChecked && isLoggedIn && currentPlan === plan.id;
            const btnInfo = getButtonLabel(plan.id, currentPlan, isLoggedIn && authChecked);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-5 transition-colors sm:p-6 ${
                  isCurrent
                    ? "border-emerald-500/50 bg-emerald-500/[0.04]"
                    : isPopular
                    ? "border-primary/40 bg-primary/[0.03]"
                    : isPremium
                    ? "border-accent/30 bg-accent/[0.02]"
                    : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                {/* 現在のプランバッジ */}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/60 bg-bg-deep px-4 py-1 text-xs font-bold text-emerald-400">
                    現在のプラン
                  </span>
                )}

                {/* 人気バッジ（現在のプランでない場合のみ表示） */}
                {isPopular && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">
                    人気
                  </span>
                )}

                {/* プラン名 */}
                <div className="mb-5">
                  <h3
                    className={`font-display text-lg font-bold ${
                      isPremium ? "text-accent" : isPopular ? "text-primary" : "text-text-primary"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">{plan.description}</p>
                </div>

                {/* 価格 */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-bold text-text-primary">
                      &yen;{formatPrice(price)}
                    </span>
                    {price > 0 && (
                      <span className="text-xs text-text-muted">
                        /{isYearly ? "年" : "月"}
                      </span>
                    )}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="mt-1 text-xs text-text-muted">
                      月あたり &yen;{formatPrice(Math.round(price / 12))}
                    </p>
                  )}
                </div>

                {/* 機能リスト */}
                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`mt-0.5 shrink-0 ${
                            isPremium ? "text-accent" : isPopular ? "text-primary" : "text-success"
                          }`}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="mt-0.5 shrink-0 text-text-muted/40"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-text-secondary" : "text-text-muted/60"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTAボタン */}
                {btnInfo.type === "current" ? (
                  <div className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-3 text-center text-sm font-medium text-emerald-400">
                    現在のプラン
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading}
                    className={`w-full rounded-lg py-3 text-sm font-medium transition-colors disabled:opacity-60 ${
                      btnInfo.type === "downgrade"
                        ? "border border-border bg-transparent text-text-muted hover:border-text-muted hover:text-text-secondary"
                        : isPopular
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : isPremium
                        ? "bg-accent text-bg-deep hover:bg-accent/90"
                        : "border border-border bg-transparent text-text-primary hover:border-text-muted"
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                        </svg>
                        処理中...
                      </span>
                    ) : (
                      btnInfo.label
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ的な注釈 */}
        <p className="mt-10 text-center text-xs text-text-muted">
          すべてのプランは即時キャンセル可能です。年払いプランは残期間分を日割り返金いたします。
        </p>
      </main>
    </div>
  );
}
