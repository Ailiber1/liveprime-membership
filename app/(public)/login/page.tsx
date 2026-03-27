"use client";

import { useState } from "react";
import Link from "next/link";
import { login, loginWithGoogle } from "./actions";

export default function LoginPage() {
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validateForm(email: string, password: string): boolean {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "正しいメールアドレスの形式で入力してください。";
    }

    if (!password) {
      newErrors.password = "パスワードを入力してください。";
    } else if (password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください。";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!validateForm(email, password)) return;

    setLoading(true);
    setErrors({});
    const result = await login(formData);
    if (result?.error) {
      setErrors({ general: result.error });
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    if (result?.error) {
      setErrors({ general: result.error });
    }
    setGoogleLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
              <span className="text-primary">LIVE</span>{" "}
              <span className="text-text-primary">PRIME</span>
            </h1>
          </Link>
          <p className="text-text-secondary">アカウントにログイン</p>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
          {errors.general && (
            <div className="mb-5 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
              {errors.general}
            </div>
          )}

          {/* Google OAuthボタン */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="google-btn mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "接続中..." : "Googleで続ける"}
          </button>

          <div className="auth-separator mb-5">または</div>

          <form action={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text-secondary"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`w-full rounded-lg border bg-bg-input px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
                placeholder="mail@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text-secondary"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`w-full rounded-lg border bg-bg-input px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:outline-none focus:ring-1 ${
                  errors.password
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
                placeholder="8文字以上"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-error">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            アカウントをお持ちでない方は{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
