"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください。" };
  }

  if (password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください。" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split("@")[0],
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "このメールアドレスは既に登録されています。" };
    }
    return { error: "登録に失敗しました。もう一度お試しください。" };
  }

  redirect("/dashboard");
}

export async function registerWithGoogle() {
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
      if (
        error.message.includes("provider") ||
        error.message.includes("not enabled") ||
        error.message.includes("unsupported")
      ) {
        return {
          error:
            "Google認証は現在設定中です。メールアドレスでの登録をご利用ください。",
        };
      }
      return { error: "Google認証に失敗しました。しばらくしてからお試しください。" };
    }

    if (data.url) {
      redirect(data.url);
    }
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") {
      throw e;
    }
    return {
      error:
        "Google認証は現在設定中です。メールアドレスでの登録をご利用ください。",
    };
  }
}
