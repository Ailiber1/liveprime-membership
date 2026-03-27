import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { stripe } from "@/lib/stripe/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/dashboard");
  }

  // Stripe Sessionからプラン情報を取得
  let planName = "Standard";
  let isPremium = false;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const plan = session.metadata?.plan;
    if (plan === "premium") {
      planName = "Premium";
      isPremium = true;
    } else {
      planName = "Standard";
    }
  } catch {
    // session取得失敗時はデフォルト値を使用
  }

  // ログイン状態の確認
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインの場合はログインを促す
  if (!user) {
    return <SuccessWithLoginPrompt planName={planName} />;
  }

  // ユーザーのメールアドレスを取得（マスク表示用）
  const userEmail = user.email || "";
  const maskedEmail = maskEmail(userEmail);

  const features = [
    { label: "全コンテンツ見放題", available: true },
    { label: "HD/4K画質", available: true },
    { label: "ライブ配信参加", available: true },
    { label: "コミュニティ参加", available: true },
    { label: "個別コンサル", available: isPremium },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Confetti */}
      <div className="confetti-container" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
              backgroundColor: ["#f0f0f5", "#8b8ba3", "#5a5a72", "#f59e0b", "#f0f0f5"][i % 5],
              width: `${6 + Math.random() * 6}px`,
              height: `${6 + Math.random() * 6}px`,
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* チェックマークアイコン */}
        <div className="success-check-container mx-auto mb-6">
          <div className="success-check-circle">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="success-check-icon text-text-primary"
            >
              <polyline points="6 12 10 16 18 8" />
            </svg>
          </div>
        </div>

        {/* 見出し */}
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
          決済が完了しました!
        </h1>

        <p className="mt-3 text-base text-text-secondary sm:text-lg">
          <span className="font-semibold text-text-primary">{planName}プラン</span>が有効化されました
        </p>

        {/* 機能リスト */}
        <div className="mt-8 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 text-left">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-text-muted">
            利用可能な機能
          </p>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.label} className="flex items-center gap-3">
                {feature.available ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-text-secondary"
                  >
                    <polyline points="6 12 10 16 18 8" />
                  </svg>
                ) : (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-text-muted"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                )}
                <span
                  className={`text-sm ${
                    feature.available ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {feature.label}
                </span>
                {!feature.available && (
                  <span className="ml-auto text-[10px] text-text-muted">
                    Premium限定
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* メール送信通知セクション */}
        <div className="mt-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-muted"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4l-10 8L2 4" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">
                決済完了通知を送信しました
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                {maskedEmail} 宛に確認メールをお届けしています
              </p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] leading-relaxed text-text-muted">
            ※ デモ環境のため、実際のメール送信は行われません。本番環境ではStripe領収書メールが自動送信されます。
          </p>
        </div>

        {/* テスト環境バナー */}
        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[11px] font-medium text-text-muted">
            テスト環境 — 実際の課金は発生していません
          </span>
        </div>

        {/* ダッシュボードへボタン */}
        <Link
          href="/dashboard"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          ダッシュボードへ
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
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        <p className="mt-4 text-xs text-text-muted">
          プランの管理は設定ページから行えます
        </p>
      </div>

      <style>{`
        .confetti-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          opacity: 0;
          animation: confetti-fall linear forwards;
        }
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(calc(100vh + 40px)) rotate(720deg);
          }
        }

        .success-check-container {
          width: 80px;
          height: 80px;
          animation: check-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
          transform: scale(0.3);
        }
        @keyframes check-appear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .success-check-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-check-icon {
          animation: check-draw 0.4s ease-out 0.4s forwards;
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
        }
        @keyframes check-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

/** メールアドレスをマスク表示する（例: ai****@gmail.com） */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "****@****.***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(4, local.length - 2))}@${domain}`;
}

function SuccessWithLoginPrompt({ planName }: { planName: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-primary"
          >
            <polyline points="6 12 10 16 18 8" />
          </svg>
        </div>

        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          決済が完了しました!
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {planName}プランが有効化されました。
          <br />
          ログインしてダッシュボードにアクセスしてください。
        </p>

        <Link
          href="/login?redirectTo=/dashboard"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          ログインしてダッシュボードへ
        </Link>
      </div>
    </div>
  );
}
