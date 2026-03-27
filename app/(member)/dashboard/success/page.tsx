import { createClient } from "@/lib/supabase/server";
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
              backgroundColor: ["#ff0054", "#f5b731", "#6c5ce7", "#2ed573", "#fff"][i % 5],
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
              className="success-check-icon text-white"
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
          <span className="font-semibold text-accent">{planName}プラン</span>が有効化されました
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
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-success"
                    >
                      <polyline points="6 12 10 16 18 8" />
                    </svg>
                  </div>
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
                  <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    Premium限定
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ダッシュボードへボタン */}
        <Link
          href="/dashboard"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
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
          background: linear-gradient(135deg, #2ed573, #1e9e50);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px rgba(46, 213, 115, 0.3);
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

function SuccessWithLoginPrompt({ planName }: { planName: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success"
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
