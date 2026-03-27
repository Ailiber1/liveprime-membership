"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { register, registerWithGoogle } from "./actions";

const PLAN_LABELS: Record<string, string> = {
  standard: "Standard",
  premium: "Premium",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </main>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const selectedInterval = searchParams.get("interval");
  const planLabel = selectedPlan ? PLAN_LABELS[selectedPlan] : null;

  function validateForm(
    email: string,
    password: string
  ): boolean {
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

    // プラン情報をhidden fieldとして追加
    if (selectedPlan) {
      formData.set("selectedPlan", selectedPlan);
    }
    if (selectedInterval) {
      formData.set("selectedInterval", selectedInterval);
    }

    const result = await register(formData);
    if (result?.error) {
      setErrors({ general: result.error });
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setInfo("Google認証はデモ版では利用できません。メールアドレスで登録してください。");
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* 左側: 画像 */}
      <div className="relative hidden lg:block">
        <Image
          src="/thumbnails/VTuber Portrait.jpg"
          alt="LIVE PRIME クリエイター"
          fill
          className="object-cover"
          priority
        />
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* オーバーレイテキスト */}
        <div className="absolute bottom-12 left-8 right-8">
          <p className="font-display text-sm font-medium tracking-[0.2em] text-white/60 uppercase mb-2">Creator Platform</p>
          <h2 className="font-display text-3xl font-bold text-white leading-tight">
            LIVE PRIME<br />クリエイター
          </h2>
        </div>
      </div>

      {/* モバイル用: 画像を上部に小さく表示 */}
      <div className="relative h-40 lg:hidden">
        <Image
          src="/thumbnails/VTuber Portrait.jpg"
          alt="LIVE PRIME クリエイター"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="font-display text-xs font-medium tracking-[0.2em] text-white/60 uppercase">Creator Platform</p>
          <h2 className="font-display text-lg font-bold text-white">LIVE PRIMEクリエイター</h2>
        </div>
      </div>

      {/* 右側: フォーム */}
      <div className="flex items-center justify-center bg-bg-deep px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
                <span className="text-primary">LIVE</span>{" "}
                <span className="text-text-primary">PRIME</span>
              </h1>
            </Link>
            <p className="text-text-secondary">新規アカウント登録</p>
          </div>

          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
            {/* 選択中プランのバナー */}
            {planLabel && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-primary">{planLabel}</span>プランを選択中
                  {selectedInterval === "yearly" ? "（年払い）" : "（月払い）"}
                </span>
              </div>
            )}

            {info && (
              <div className="mb-5 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-400">
                {info}
              </div>
            )}

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
                  htmlFor="displayName"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  表示名
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ユーザー名"
                />
              </div>

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
                  autoComplete="new-password"
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
                {loading
                  ? "登録中..."
                  : planLabel
                  ? `登録して${planLabel}プランに進む`
                  : "新規登録"
                }
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-text-muted">
              登録することで、
              <Link href="/terms" className="text-text-secondary hover:underline">
                利用規約
              </Link>
              と
              <Link href="/privacy" className="text-text-secondary hover:underline">
                プライバシーポリシー
              </Link>
              に同意したものとみなします。
            </p>

            <div className="mt-6 text-center text-sm text-text-secondary">
              既にアカウントをお持ちの方は{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
