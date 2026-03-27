import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { ensureProducts } from "@/lib/stripe/ensure-products";
import { validateCsrf } from "@/lib/utils/csrf";

export async function POST(request: NextRequest) {
  // CSRF対策: Origin/Referer検証
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    // 認証チェック
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, interval } = body as {
      planId: "standard" | "premium";
      interval: "monthly" | "yearly";
    };

    if (!planId || !interval) {
      return NextResponse.json(
        { error: "planIdとintervalは必須です" },
        { status: 400 }
      );
    }

    const priceKey = `${planId}_${interval}` as keyof Awaited<
      ReturnType<typeof ensureProducts>
    >;

    // Stripe商品・料金を確保
    const priceIds = await ensureProducts();
    const priceId = priceIds[priceKey];

    if (!priceId) {
      return NextResponse.json(
        { error: "該当する料金プランが見つかりません" },
        { status: 400 }
      );
    }

    // プロフィールからstripe_customer_idを取得
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Stripeカスタマーが未作成なら新規作成
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // profilesテーブルに保存
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Checkout Session作成
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan: planId,
        },
      },
      metadata: {
        supabase_user_id: user.id,
        plan: planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session作成エラー:", err);
    return NextResponse.json(
      { error: "Checkout sessionの作成に失敗しました" },
      { status: 500 }
    );
  }
}
