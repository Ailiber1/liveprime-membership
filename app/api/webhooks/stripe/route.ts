import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createServerClient } from "@supabase/ssr";
import Stripe from "stripe";

// Supabase Admin クライアント（service_role_key不要: anon keyでRLSバイパスせず更新）
// Webhookではユーザーのcookieが無いため、service_role_keyが理想だが、
// 無料枠の制約内でanon keyを使用し、RLSポリシーで対応する
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // 署名検証
  if (!webhookSecret) {
    // 開発環境の場合のみ警告を出して通す
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "STRIPE_WEBHOOK_SECRET が未設定のため署名検証をスキップします（開発環境）"
      );
      try {
        event = JSON.parse(body) as Stripe.Event;
      } catch {
        return NextResponse.json(
          { error: "リクエストボディの解析に失敗しました" },
          { status: 400 }
        );
      }
    } else {
      console.error("STRIPE_WEBHOOK_SECRET が未設定です。リクエストを拒否します。");
      return NextResponse.json(
        { error: "Webhook設定エラー" },
        { status: 500 }
      );
    }
  } else if (!signature) {
    return NextResponse.json(
      { error: "stripe-signatureヘッダーがありません" },
      { status: 400 }
    );
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook署名検証失敗:", err);
      return NextResponse.json(
        { error: "署名検証に失敗しました" },
        { status: 400 }
      );
    }
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }
      default:
        console.log(`未処理のイベントタイプ: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhookイベント処理エラー:", err);
    return NextResponse.json(
      { error: "Webhookイベントの処理に失敗しました" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.supabase_user_id;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    console.error("メタデータにsupabase_user_idまたはplanがありません");
    return;
  }

  // サブスクリプション詳細を取得
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Stripe SDK v21+: items.data[0]からperiodを取得
  const firstItem = subscription.items?.data?.[0];
  const periodStart = firstItem?.current_period_start
    ?? (subscription as unknown as Record<string, number>).current_period_start;
  const periodEnd = firstItem?.current_period_end
    ?? (subscription as unknown as Record<string, number>).current_period_end;

  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan: plan,
        status: "active",
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: session.customer as string,
        current_period_start: periodStart
          ? new Date(periodStart * 1000).toISOString()
          : new Date().toISOString(),
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("subscriptions更新エラー:", error);
  }

  // profiles.stripe_customer_id も更新
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: session.customer as string })
    .eq("id", userId);
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) {
    console.error("メタデータにsupabase_user_idがありません");
    return;
  }

  const plan = subscription.metadata?.plan || "standard";
  const status = subscription.status === "active" ? "active" : "canceled";

  // Stripe SDK v21+: items.data[0]からperiodを取得
  const firstItem = subscription.items?.data?.[0];
  const periodStart = firstItem?.current_period_start
    ?? (subscription as unknown as Record<string, number>).current_period_start;
  const periodEnd = firstItem?.current_period_end
    ?? (subscription as unknown as Record<string, number>).current_period_end;

  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan: plan,
        status: status,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        current_period_start: periodStart
          ? new Date(periodStart * 1000).toISOString()
          : new Date().toISOString(),
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("subscriptions更新エラー:", error);
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) {
    console.error("メタデータにsupabase_user_idがありません");
    return;
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      plan: "free",
    })
    .eq("user_id", userId);

  if (error) {
    console.error("subscriptions更新エラー:", error);
  }
}
