"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";

const planLabels: Record<string, string> = {
  free: "Free",
  standard: "Standard",
  premium: "Premium",
};

const planPrices: Record<string, string> = {
  free: "¥0",
  standard: "¥980/月",
  premium: "¥2,980/月",
};

const features = [
  "プレミアム動画の視聴",
  "限定ライブ配信へのアクセス",
  "高画質ストリーミング（1080p）",
  "広告なしの視聴体験",
  "オフラインダウンロード",
  "優先カスタマーサポート",
];

interface CancelFormProps {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
}

export default function CancelForm({
  plan,
  status,
  currentPeriodEnd,
}: CancelFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Customer Portalの作成に失敗しました");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Portal URLが返されなかった場合はデモ用トースト
      showToast(
        "解約処理を受け付けました。現在の請求期間終了後にプランが変更されます。",
        "success"
      );
      router.push("/dashboard");
    } catch {
      // デモ用: APIが設定されていない場合のフォールバック
      showToast(
        "解約処理を受け付けました（デモ）。現在の請求期間終了後にプランが変更されます。",
        "success"
      );
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  // Freeプランの場合は解約不要
  if (plan === "free") {
    return (
      <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-display text-xl font-bold text-text-primary">
          解約の必要はありません
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          現在Freeプランをご利用中のため、解約手続きは不要です。
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          ダッシュボードに戻る
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 見出し */}
      <div className="mb-6">
        <Link
          href="/settings"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          設定に戻る
        </Link>
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          サブスクリプションの解約
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          解約手続きはいつでも簡単に行えます
        </p>
      </div>

      {/* 現在のプラン */}
      <div className="mb-6 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
          現在のプラン
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-text-primary">
            {planLabels[plan] || plan}
          </span>
          <span className="text-sm text-text-muted">
            {planPrices[plan] || ""}
          </span>
        </div>
        {status === "active" && (
          <span className="mt-2 inline-block rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
            有効
          </span>
        )}
        {currentPeriodEnd && (
          <p className="mt-2 text-xs text-text-muted">
            次回更新日:{" "}
            {new Date(currentPeriodEnd).toLocaleDateString("ja-JP")}
          </p>
        )}
      </div>

      {/* 機能喪失の警告 */}
      <div className="mb-6 rounded-xl border border-error/20 bg-error/5 p-5">
        <h2 className="text-sm font-semibold text-text-primary">
          解約すると以下の機能が使えなくなります
        </h2>
        <ul className="mt-3 space-y-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-text-secondary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0 text-error/70"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* 確認チェックボックス */}
      <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-text-muted/30">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span className="text-sm text-text-secondary">
          上記の内容を確認しました。本当に解約します。
        </span>
      </label>

      {/* ボタン */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          やっぱり続ける
        </Link>
        <button
          onClick={handleCancel}
          disabled={!confirmed || isLoading}
          className="inline-flex items-center justify-center rounded-lg border border-error/40 px-6 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "処理中..." : "解約する"}
        </button>
      </div>

      {/* 補足 */}
      <p className="mt-6 text-center text-xs text-text-muted">
        解約後も現在の請求期間が終了するまでは全機能をご利用いただけます。
        <br />
        再度加入したい場合は、いつでも料金プランページから手続きできます。
      </p>
    </div>
  );
}
