"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/layout/Header";
// StarBackground削除 — 料金プランでは不要

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
        return;
      }
      window.location.href = "/register";
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

  const isPremium = (id: string) => id === "premium";

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "いつでもキャンセルできますか？",
      a: "はい、いつでもワンクリックで解約できます。日割り返金にも対応しています。",
    },
    {
      q: "無料トライアルはありますか？",
      a: "はい、14日間の無料トライアルをご用意しています。クレジットカード不要で始められます。",
    },
    {
      q: "プランの変更はできますか？",
      a: "はい、いつでもアップグレード・ダウングレードが可能です。変更は即時反映されます。",
    },
    {
      q: "支払い方法は？",
      a: "クレジットカード（Visa, Mastercard, AMEX, JCB）に対応しています。",
    },
    {
      q: "契約期間の縛りはありますか？",
      a: "いいえ、最低利用期間はありません。月払いなら1ヶ月単位、年払いでもいつでも解約可能です。",
    },
  ];

  return (
    <div className="relative min-h-screen bg-bg-deep">
      {/* 星空背景なし — 購買判断に集中させる */}
      <Header />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-28">
        {/* キャンセル時のバナー */}
        {canceled === "true" && (
          <div className="mb-8 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/5 px-4 py-3 text-center text-sm text-[#f59e0b]">
            決済がキャンセルされました。いつでもプランを選択できます。
          </div>
        )}

        {/* タイトル */}
        <div className="mb-10 text-center sm:mb-16">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            あなたの配信スタイルに
            <br />
            <span className="text-[#f59e0b]">合ったプラン</span>を
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
            14日間の無料トライアルで、すべての機能をお試しいただけます。
            <br className="hidden sm:block" />
            いつでもプラン変更・解約OK。まずは気軽にはじめましょう。
          </p>
        </div>

        {/* 月払い/年払いトグル */}
        <div className="mb-12 flex flex-col items-center gap-3 sm:mb-16">
          <div className="inline-flex items-center rounded-full border border-border bg-[rgba(255,255,255,0.03)] p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                !isYearly
                  ? "bg-[#f59e0b] text-[#0a0a0f] shadow-sm shadow-[#f59e0b]/20"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              月払い
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                isYearly
                  ? "bg-[#f59e0b] text-[#0a0a0f] shadow-sm shadow-[#f59e0b]/20"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              年払い
            </button>
          </div>
          {isYearly && (
            <span className="text-xs font-medium text-[#f59e0b]/80">
              年払いで最大30%お得
            </span>
          )}
        </div>

        {/* プランカード */}
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isPopular = plan.popular;
            const isFree = plan.id === "free";
            const isLoading = loadingPlan === plan.id || loadingPlan === `${plan.id}_redirecting`;
            const isRedirecting = loadingPlan === `${plan.id}_redirecting`;
            const isCurrent = authChecked && isLoggedIn && currentPlan === plan.id;
            const btnInfo = getButtonLabel(plan.id, currentPlan, isLoggedIn && authChecked);

            return (
              <div
                key={plan.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-xl border-2 p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-white/50 hover:bg-[rgba(255,255,255,0.06)] hover:shadow-[0_0_20px_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.03)] ${
                  isCurrent
                    ? "border-[rgba(245,158,11,0.5)] bg-[rgba(255,255,255,0.04)]"
                    : isPopular
                    ? "border-[rgba(245,158,11,0.3)] bg-[rgba(255,255,255,0.05)]"
                    : isPremium(plan.id)
                    ? "border-[rgba(245,158,11,0.15)] bg-[rgba(255,255,255,0.03)]"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]"
                }`}
                style={
                  isPopular && !isCurrent
                    ? { boxShadow: "0 0 24px 2px rgba(245, 158, 11, 0.10), 0 0 48px 4px rgba(245, 158, 11, 0.05)" }
                    : undefined
                }
              >
                {/* 現在のプランバッジ */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 left-0 flex justify-center">
                    <span className="rounded-b-lg bg-[rgba(245,158,11,0.15)] px-4 py-1.5 text-xs font-medium tracking-wide text-[#f59e0b]">
                      現在のプラン
                    </span>
                  </div>
                )}

                {/* 推奨プランバッジ */}
                {isPopular && !isCurrent && (
                  <div className="absolute top-0 right-0 left-0 flex justify-center">
                    <span className="rounded-b-lg bg-[#f59e0b] px-5 py-1.5 text-[11px] font-bold tracking-wider text-[#0a0a0f] uppercase">
                      おすすめ
                    </span>
                  </div>
                )}

                {/* プラン名 + 説明 */}
                <div className="mb-6 mt-7">
                  <div className="flex items-center gap-2.5">
                    <h3 className={`font-display text-xl font-bold tracking-tight ${
                      plan.id === "premium" ? "text-[#f59e0b]" : plan.id === "standard" ? "text-[#2ed573]" : "text-text-primary"
                    }`}>
                      {plan.nameJa}
                    </h3>
                    {isYearly && plan.yearlyDiscount && (
                      <span className="rounded-full bg-[#f59e0b]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#f59e0b]">
                        {plan.yearlyDiscount}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                    {plan.description}
                  </p>
                </div>

                {/* 価格 */}
                <div className="mb-8">
                  <div className="price-transition flex items-end gap-1">
                    {isFree ? (
                      <span className="font-mono text-5xl font-extrabold tracking-tight text-text-primary">
                        <span className="text-2xl font-bold">¥</span>0
                      </span>
                    ) : (
                      <>
                        <span className="font-mono text-5xl font-extrabold tracking-tight text-text-primary">
                          <span className="text-2xl font-bold">¥</span>{formatPrice(price)}
                        </span>
                        <span className="mb-1.5 text-sm text-text-muted">
                          /{isYearly ? "年" : "月"}
                        </span>
                      </>
                    )}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="mt-2.5 text-[13px] text-text-muted">
                      月あたり <span className="font-medium text-text-secondary">&yen;{formatPrice(Math.round(price / 12))}</span>
                    </p>
                  )}
                  {isFree && (
                    <p className="mt-2.5 text-[13px] text-text-secondary">
                      クレジットカード不要
                    </p>
                  )}
                </div>

                {/* 区切り線 */}
                <div className={`mb-8 h-px ${
                  isPopular
                    ? "bg-[rgba(245,158,11,0.15)]"
                    : "bg-[rgba(255,255,255,0.06)]"
                }`} />

                {/* 機能リスト */}
                <ul className="mb-10 flex-1 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 shrink-0 text-[#2ed573]"
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
                          strokeLinecap="round"
                          className="mt-0.5 shrink-0 text-text-muted/30"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                      <span
                        className={`text-[13px] leading-relaxed ${
                          feature.included ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTAボタン */}
                {btnInfo.type === "current" ? (
                  <div className="w-full rounded-xl border border-[rgba(245,158,11,0.3)] py-4 text-center text-sm font-medium text-[#f59e0b]/70">
                    現在のプラン
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading}
                    className="group/plan relative w-full overflow-hidden rounded-xl py-4 text-sm font-semibold tracking-wide bg-white/80 text-[#0a0a0f] transition-all duration-[600ms] ease-out hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.99] active:bg-white/70 active:duration-150 disabled:opacity-60"
                  >
                    {/* シャインエフェクト */}
                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[1000ms] ease-out group-hover/plan:translate-x-full pointer-events-none" />
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                        </svg>
                        {isRedirecting ? "決済画面に移動中..." : "準備中..."}
                      </span>
                    ) : (
                      <span className="relative">{btnInfo.label}</span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 注釈 */}
        <p className="mt-14 text-center text-xs leading-relaxed text-text-muted">
          すべてのプランは即時キャンセル可能です。年払いプランは残期間分を日割り返金いたします。
        </p>

        {/* プラン比較表 */}
        <section className="mt-20 sm:mt-28">
          <h2 className="font-display mb-10 text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            プラン比較
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="border-b border-border bg-[rgba(255,255,255,0.03)]">
                  <th className="px-4 py-4 text-left font-medium text-text-secondary sm:px-6">機能</th>
                  <th className="px-4 py-4 text-center font-medium text-text-secondary sm:px-6">Free</th>
                  <th className="px-4 py-4 text-center font-bold text-[#f59e0b] sm:px-6">Standard</th>
                  <th className="px-4 py-4 text-center font-medium text-text-secondary sm:px-6">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { label: "コンテンツ視聴", free: "無料のみ", standard: "全コンテンツ", premium: "全コンテンツ" },
                  { label: "画質", free: "480p", standard: "1080p", premium: "4K" },
                  { label: "視聴数制限", free: "月5本", standard: "無制限", premium: "無制限" },
                  { label: "ライブ配信視聴", free: false, standard: true, premium: true },
                  { label: "オフライン再生", free: false, standard: false, premium: true },
                  { label: "優先サポート", free: false, standard: false, premium: true },
                  { label: "個別コンサル", free: false, standard: false, premium: true },
                ].map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="px-4 py-3.5 text-text-primary sm:px-6">{row.label}</td>
                    {(["free", "standard", "premium"] as const).map((plan) => {
                      const val = row[plan];
                      return (
                        <td key={plan} className="px-4 py-3.5 text-center sm:px-6">
                          {typeof val === "string" ? (
                            <span className={`text-[13px] ${plan === "standard" ? "font-medium text-text-primary" : "text-text-secondary"}`}>{val}</span>
                          ) : val ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[#2ed573]">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto text-text-muted/30">
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* よくある質問 */}
        <section className="mt-20 sm:mt-28">
          <h2 className="font-display mb-10 text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            よくある質問
          </h2>
          <div className="mx-auto max-w-2xl divide-y divide-[rgba(255,255,255,0.06)]">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-text-primary"
                  >
                    <span className="text-sm font-medium text-text-primary sm:text-base">
                      {faq.q}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-200 ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-text-secondary">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 会員専用機能 */}
        <section className="mt-20 sm:mt-28">
          <h2 className="font-display mb-10 text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            会員専用機能
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {[
              {
                title: "4K高画質配信",
                desc: "Premiumプランなら全コンテンツを4K画質で視聴可能。細部まで鮮明な映像体験をお楽しみいただけます。",
                img: "/thumbnails/hero-bg-1.png",
              },
              {
                title: "限定ライブ配信",
                desc: "会員限定のライブ配信イベントにリアルタイムで参加。チャットやQ&Aでクリエイターと直接交流できます。",
                img: "/thumbnails/hero-bg-2.png",
              },
              {
                title: "クリエイターコミュニティ",
                desc: "同じ志を持つ仲間と繋がれる会員専用コミュニティ。情報交換やコラボレーションの場として活用できます。",
                img: "/thumbnails/hero-bg-3.png",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-xl border border-[rgba(255,255,255,0.15)] bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,255,255,0.25)] hover:shadow-lg hover:shadow-black/20"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="h-full w-full object-cover brightness-125 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-base font-bold tracking-tight text-text-primary sm:text-lg">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
