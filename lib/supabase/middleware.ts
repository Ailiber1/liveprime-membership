import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // (member)ルートは認証必須
  const memberRoutes = ["/dashboard", "/videos", "/settings"];
  const isMemberRoute = memberRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // (admin)ルートはadminロール必須
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // 未ログインでmemberルートにアクセス → /loginにリダイレクト
  // ただし /dashboard/success でsession_idがある場合はStripe Checkout完了後なのでスキップ
  const isSuccessWithSession =
    pathname === "/dashboard/success" &&
    request.nextUrl.searchParams.has("session_id");

  if (!user && isMemberRoute && !isSuccessWithSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // 未ログインでadminルートにアクセス → /loginにリダイレクト
  if (!user && isAdminRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // adminルートはadminロールが必要
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // ログイン済みで/login, /registerにアクセス → /dashboardにリダイレクト
  if (user && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
