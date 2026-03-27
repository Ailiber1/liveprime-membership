/**
 * Stripe 料金プラン設定
 * Stripe APIで商品・料金を自動作成するための定義
 */

export const PLANS = {
  standard: {
    name: "Standard",
    description: "本格的に学びたい方へ — HD画質・無制限視聴",
    monthly: {
      amount: 980,
      currency: "jpy",
      interval: "month" as const,
    },
    yearly: {
      amount: 8160,
      currency: "jpy",
      interval: "year" as const,
    },
  },
  premium: {
    name: "Premium",
    description: "すべての機能を解放 — 4K画質・優先サポート",
    monthly: {
      amount: 2980,
      currency: "jpy",
      interval: "month" as const,
    },
    yearly: {
      amount: 24800,
      currency: "jpy",
      interval: "year" as const,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type BillingInterval = "month" | "year";
