"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください。" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "メールアドレスまたはパスワードが正しくありません。" };
  }

  redirect("/dashboard");
}

export async function loginWithGoogle() {
  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      // Google Providerが未設定の場合のエラーハンドリング
      if (
        error.message.includes("provider") ||
        error.message.includes("not enabled") ||
        error.message.includes("unsupported")
      ) {
        return {
          error:
            "Google認証は現在設定中です。メールアドレスでのログインをご利用ください。",
        };
      }
      return { error: "Google認証に失敗しました。しばらくしてからお試しください。" };
    }

    if (data.url) {
      redirect(data.url);
    }
  } catch (e) {
    // redirect()はエラーをスローするので、それを再スローする
    if (e instanceof Error && e.message === "NEXT_REDIRECT") {
      throw e;
    }
    return {
      error:
        "Google認証は現在設定中です。メールアドレスでのログインをご利用ください。",
    };
  }
}
