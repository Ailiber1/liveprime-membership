"use client";

import Link from "next/link";

interface PaywallGateProps {
  videoTitle: string;
  requiredPlan: string;
}

export default function PaywallGate({ videoTitle, requiredPlan }: PaywallGateProps) {
  const planLabel = requiredPlan === "premium" ? "Premium" : "Standard";
  const planPrice = requiredPlan === "premium" ? "2,980" : "980";

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-bg-card">
      {/* ブラーオーバーレイ付きサムネイル領域 */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #ff005420 0%, #07070e 50%, #6c5ce710 100%)",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-bg-deep/60" />

        <div className="relative z-10 mx-auto max-w-md px-6 text-center">
          {/* ロックアイコン */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>

          <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
            {planLabel}プラン限定コンテンツ
          </h3>
          <p className="mb-1 text-sm text-text-secondary">
            「{videoTitle}」は{planLabel}プラン以上でご覧いただけます。
          </p>
          <p className="mb-6 text-xs text-text-muted">
            月額 &yen;{planPrice} から
          </p>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            プランに加入する
          </Link>
        </div>
      </div>
    </div>
  );
}
