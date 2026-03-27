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
  nameJa: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  accent?: string;
  yearlyDiscount?: string;
}

const PLAN_ORDER = { free: 0, standard: 1, premium: 2 } as const;

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    nameJa: "無料プラン",
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
    nameJa: "スタンダード",
    monthlyPrice: 980,
    yearlyPrice: 8160,
    yearlyDiscount: "2ヶ月分お得",
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
    nameJa: "プレミアム",
    monthlyPrice: 2980,
    yearlyPrice: 24800,
    yearlyDiscount: "30%OFF",
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
        // Stripe Checkoutへリダイレクト（ローディング状態を「決済画面に移動中...」に変更）
        setLoadingPlan(`${planId}_redirecting`);
        window.location.href = data.url;
        return; // リダイレクト後はfinallyでリセットしない
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "エラーが発生しました";
      showToast(message, "error");
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(price);
  };

  return (
    <div className="min-h-screen bg-bg-deep">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-24">
        {/* キャンセル時のバナー */}
        {canceled === "true" && (
          <div className="mb-8 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-center text-sm text-accent">
            決済がキャンセルされました。いつでもプランを選択できます。
          </div>
        )}

        {/* タイトル */}
        <div className="mb-10 text-center sm:mb-14">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            あなたに合ったプランを選ぶ
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
            すべてのプランで基本機能をご利用いただけます。
            <br className="hidden sm:block" />
            いつでもアップグレード・ダウングレードが可能です。
          </p>
        </div>

        {/* 月払い/年払いトグル */}
        <div className="mb-12 flex flex-col items-center gap-3 sm:mb-14">
          <div className="inline-flex items-center rounded-full border border-border bg-[rgba(255,255,255,0.03)] p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                !isYearly
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              月払い
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                isYearly
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              年払い
            </button>
          </div>
          {isYearly && (
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold tracking-wide text-accent">
              年払いで最大30%お得
            </span>
          )}
        </div>

        {/* プランカード */}
        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isPopular = plan.popular;
            const isPremium = plan.id === "premium";
            const isFree = plan.id === "free";
            const isLoading = loadingPlan === plan.id || loadingPlan === `${plan.id}_redirecting`;
            const isRedirecting = loadingPlan === `${plan.id}_redirecting`;
            const isCurrent = authChecked && isLoggedIn && currentPlan === plan.id;
            const btnInfo = getButtonLabel(plan.id, currentPlan, isLoggedIn && authChecked);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl transition-all duration-300 ${
                  isPopular
                    ? "card-popular lg:-mt-4 lg:mb-4"
                    : isPremium
                    ? "card-premium"
                    : ""
                }`}
              >
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-7 ${
                    isCurrent
                      ? "border border-emerald-500/50 bg-emerald-500/[0.04]"
                      : isPopular
                      ? "bg-[rgba(255,0,84,0.04)]"
                      : isPremium
                      ? "bg-[rgba(245,183,49,0.03)]"
                      : "border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  {/* 現在のプランバッジ */}
                  {isCurrent && (
                    <div className="absolute top-0 right-0 left-0 flex justify-center">
                      <span className="rounded-b-lg border-x border-b border-emerald-500/40 bg-emerald-500/15 px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-400">
                        現在のプラン
                      </span>
                    </div>
                  )}

                  {/* 人気No.1バッジ（推奨プラン） */}
                  {isPopular && !isCurrent && (
                    <div className="absolute top-0 right-0 left-0 flex justify-center">
                      <span className="rounded-b-lg bg-primary px-5 py-1.5 text-xs font-bold tracking-wider text-white shadow-md shadow-primary/30">
                        人気 No.1
                      </span>
                    </div>
                  )}

                  {/* プラン名 + 説明 */}
                  <div className={`mb-6 ${isCurrent || (isPopular && !isCurrent) ? "mt-6" : "mt-0"}`}>
                    <div className="flex items-center gap-2.5">
                      <h3
                        className={`font-display text-xl font-bold tracking-tight ${
                          isPremium ? "text-accent" : isPopular ? "text-primary" : "text-text-primary"
                        }`}
                      >
                        {plan.nameJa}
                      </h3>
                      {/* 年払い割引バッジ */}
                      {isYearly && plan.yearlyDiscount && (
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                            isPremium
                              ? "bg-accent/20 text-accent"
                              : "bg-primary/15 text-primary"
                          }`}
                        >
                          {plan.yearlyDiscount}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                      {plan.description}
                    </p>
                  </div>

                  {/* 価格 */}
                  <div className="mb-7">
                    <div className="price-transition flex items-end gap-1.5">
                      {isFree ? (
                        <span className="font-mono text-5xl font-extrabold tracking-tight text-text-primary">
                          &yen;0
                        </span>
                      ) : (
                        <>
                          <span className="font-mono text-5xl font-extrabold tracking-tight text-text-primary">
                            &yen;{formatPrice(price)}
                          </span>
                          <span className="mb-1.5 text-sm text-text-muted">
                            /{isYearly ? "年" : "月"}
                          </span>
                        </>
                      )}
                    </div>
                    {isYearly && price > 0 && (
                      <p className="mt-2 text-[13px] text-text-muted">
                        月あたり <span className="font-medium text-text-secondary">&yen;{formatPrice(Math.round(price / 12))}</span>
                      </p>
                    )}
                    {isFree && (
                      <p className="mt-2 text-[13px] text-text-muted">
                        クレジットカード不要
                      </p>
                    )}
                  </div>

                  {/* 区切り線 */}
                  <div
                    className={`mb-6 h-px ${
                      isPremium
                        ? "bg-accent/15"
                        : isPopular
                        ? "bg-primary/15"
                        : "bg-[rgba(255,255,255,0.06)]"
                    }`}
                  />

                  {/* 機能リスト */}
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <span
                            className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                              isPremium
                                ? "bg-accent/15"
                                : isPopular
                                ? "bg-primary/15"
                                : "bg-success/15"
                            }`}
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`${
                                isPremium ? "text-accent" : isPopular ? "text-primary" : "text-success"
                              }`}
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        ) : (
                          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.04)]">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              className="text-text-muted/30"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </span>
                        )}
                        <span
                          className={`text-[13px] leading-snug ${
                            feature.included ? "text-text-secondary" : "text-text-muted/50"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAボタン */}
                  {btnInfo.type === "current" ? (
                    <div className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3.5 text-center text-sm font-semibold text-emerald-400">
                      現在のプラン
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading}
                      className={`w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-60 ${
                        btnInfo.type === "downgrade"
                          ? "border border-border bg-transparent text-text-muted hover:border-text-muted hover:text-text-secondary"
                          : isPopular
                          ? "bg-text-primary text-bg-deep shadow-lg shadow-white/10 hover:bg-white hover:shadow-white/20"
                          : isPremium
                          ? "bg-gradient-to-r from-accent to-[#d4a020] text-bg-deep shadow-lg shadow-accent/20 hover:shadow-accent/30"
                          : isFree
                          ? "border border-[rgba(255,255,255,0.12)] bg-transparent text-text-primary hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.04)]"
                          : "border border-border bg-transparent text-text-primary hover:border-text-muted"
                      }`}
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                          </svg>
                          {isRedirecting ? "決済画面に移動中..." : "準備中..."}
                        </span>
                      ) : (
                        btnInfo.label
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 注釈 */}
        <p className="mt-12 text-center text-xs leading-relaxed text-text-muted">
          すべてのプランは即時キャンセル可能です。年払いプランは残期間分を日割り返金いたします。
        </p>
      </main>
    </div>
  );
}
