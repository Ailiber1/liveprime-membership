import { stripe } from "./server";
import { PLANS, type PlanId, type BillingInterval } from "./config";

interface PriceIds {
  standard_monthly: string;
  standard_yearly: string;
  premium_monthly: string;
  premium_yearly: string;
}

/**
 * Stripe上に商品と料金プランが存在しなければ作成し、
 * 既存のものがあればそのIDを返す。
 *
 * メタデータ `app: "liveprime"` と `plan: "standard"|"premium"` で識別する。
 */
export async function ensureProducts(): Promise<PriceIds> {
  const result: Record<string, string> = {};

  for (const [planId, plan] of Object.entries(PLANS)) {
    // 既存の商品を検索
    const existing = await stripe.products.search({
      query: `metadata["app"]:"liveprime" AND metadata["plan"]:"${planId}"`,
    });

    let productId: string;

    if (existing.data.length > 0) {
      productId = existing.data[0].id;
    } else {
      // 商品を新規作成
      const product = await stripe.products.create({
        name: `LIVE PRIME ${plan.name}`,
        description: plan.description,
        metadata: {
          app: "liveprime",
          plan: planId,
        },
      });
      productId = product.id;
    }

    // 月額・年額の料金を確認/作成
    for (const interval of ["monthly", "yearly"] as const) {
      const billingInterval: BillingInterval =
        interval === "monthly" ? "month" : "year";
      const priceConfig = plan[interval];

      // 既存料金を検索
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        type: "recurring",
      });

      const existingPrice = prices.data.find(
        (p) =>
          p.recurring?.interval === billingInterval &&
          p.unit_amount === priceConfig.amount &&
          p.currency === priceConfig.currency
      );

      if (existingPrice) {
        result[`${planId}_${interval}`] = existingPrice.id;
      } else {
        const newPrice = await stripe.prices.create({
          product: productId,
          unit_amount: priceConfig.amount,
          currency: priceConfig.currency,
          recurring: {
            interval: billingInterval,
          },
          metadata: {
            app: "liveprime",
            plan: planId as PlanId,
            billing: interval,
          },
        });
        result[`${planId}_${interval}`] = newPrice.id;
      }
    }
  }

  return result as unknown as PriceIds;
}
