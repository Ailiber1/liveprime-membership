import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
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

    // プロフィールからstripe_customer_idを取得
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Stripeカスタマーが見つかりません。先に決済を完了してください。" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Customer Portal Session作成
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("Customer Portal session作成エラー:", err);
    return NextResponse.json(
      { error: "Customer Portalの作成に失敗しました" },
      { status: 500 }
    );
  }
}
