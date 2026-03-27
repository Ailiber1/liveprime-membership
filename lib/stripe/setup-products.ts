/**
 * Stripe 商品・料金プランを自動作成するスクリプト
 *
 * 使い方:
 *   npx tsx lib/stripe/setup-products.ts
 *
 * 前提:
 *   - .env.local に STRIPE_SECRET_KEY が設定されていること
 *   - Stripeテストモードであること
 */

import "dotenv/config";
import Stripe from "stripe";
import { PLANS } from "./config";

async function main() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY が .env.local に設定されていません。");
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-04-30.basil" as Stripe.LatestApiVersion,
    typescript: true,
  });

  console.log("Stripe 商品・料金プラン自動作成を開始します...\n");

  for (const [planId, plan] of Object.entries(PLANS)) {
    console.log(`--- ${plan.name} プラン ---`);

    // 既存の商品を検索
    const existing = await stripe.products.search({
      query: `metadata["app"]:"liveprime" AND metadata["plan"]:"${planId}"`,
    });

    let productId: string;

    if (existing.data.length > 0) {
      productId = existing.data[0].id;
      console.log(`  商品: 既存 (${productId})`);
    } else {
      const product = await stripe.products.create({
        name: `LIVE PRIME ${plan.name}`,
        description: plan.description,
        metadata: {
          app: "liveprime",
          plan: planId,
        },
      });
      productId = product.id;
      console.log(`  商品: 新規作成 (${productId})`);
    }

    // 月額・年額の料金を作成
    for (const interval of ["monthly", "yearly"] as const) {
      const billingInterval = interval === "monthly" ? "month" : "year";
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
        console.log(
          `  ${interval}: 既存 (${existingPrice.id}) - ¥${priceConfig.amount}/${billingInterval}`
        );
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
            plan: planId,
            billing: interval,
          },
        });
        console.log(
          `  ${interval}: 新規作成 (${newPrice.id}) - ¥${priceConfig.amount}/${billingInterval}`
        );
      }
    }

    console.log("");
  }

  console.log("完了！ Stripe ダッシュボードで確認してください。");
  console.log("https://dashboard.stripe.com/test/products");
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
