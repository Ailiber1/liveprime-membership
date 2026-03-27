"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

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

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (planName: string) => {
    if (planName === "Free") {
      showToast("Freeプランは登録するだけでご利用いただけます", "info");
    } else {
      showToast(`Stripe Checkoutへリダイレクトします（デモ）`, "info");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(price);
  };

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* ヘッダー */}
      <header className="border-b border-border/50 bg-bg-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-display text-xl font-bold tracking-tight text-primary">LIVE</span>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">PRIME</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
              ログイン
            </Link>
            <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
              新規登録
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* タイトル */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            あなたに合ったプランを選ぶ
          </h1>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            すべてのプランで基本機能をご利用いただけます。いつでもアップグレード・ダウングレードが可能です。
          </p>
        </div>

        {/* 月払い/年払いトグル */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className={`text-sm ${!isYearly ? "text-text-primary font-medium" : "text-text-muted"}`}>
            月払い
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative h-7 w-12 rounded-full bg-border transition-colors"
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

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-6 transition-colors ${
                  isPopular
                    ? "border-primary/40 bg-primary/[0.03]"
                    : isPremium
                    ? "border-accent/30 bg-accent/[0.02]"
                    : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                {/* 人気バッジ */}
                {isPopular && (
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
                <button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    isPopular
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : isPremium
                      ? "bg-accent text-bg-deep hover:bg-accent/90"
                      : "border border-border bg-transparent text-text-primary hover:border-text-muted"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "無料で始める" : "今すぐ始める"}
                </button>
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
