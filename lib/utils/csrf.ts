import { NextRequest, NextResponse } from "next/server";

/**
 * CSRF対策: Origin/Referer ヘッダーを検証し、自サイト以外からのリクエストを拒否する。
 * 検証失敗時は NextResponse を返し、成功時は null を返す。
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Origin ヘッダーがあればそれで検証
  if (origin) {
    if (origin === siteUrl || origin === new URL(siteUrl).origin) {
      return null; // OK
    }
    return NextResponse.json(
      { error: "不正なリクエスト元です" },
      { status: 403 }
    );
  }

  // Origin がない場合は Referer で検証
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      const allowedOrigin = new URL(siteUrl).origin;
      if (refererOrigin === allowedOrigin) {
        return null; // OK
      }
    } catch {
      // Referer のパースに失敗
    }
    return NextResponse.json(
      { error: "不正なリクエスト元です" },
      { status: 403 }
    );
  }

  // Origin も Referer もない場合は拒否
  return NextResponse.json(
    { error: "不正なリクエスト元です" },
    { status: 403 }
  );
}
