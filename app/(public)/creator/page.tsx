import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const features = [
  {
    title: "収益化",
    description: "サブスク収益を直接受け取る。手数料は業界最安水準。",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="12" />
        <path d="M16 10v12M12 14c0-1.5 1.5-2.5 4-2.5s4 1 4 2.5-1.5 2-4 2.5-4 1.5-4 3 1.5 2.5 4 2.5 4-1 4-2.5" />
      </svg>
    ),
  },
  {
    title: "ファンとの距離",
    description: "会員限定配信で、コアなファンとの絆を深める。",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 28s-10-6.5-10-14a7 7 0 0 1 13-3.5h0A7 7 0 0 1 26 14c0 7.5-10 14-10 14z" />
      </svg>
    ),
  },
  {
    title: "ツール",
    description: "4K配信、アーカイブ、分析ダッシュボード。すべて無料。",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="7" width="22" height="16" rx="2" />
        <path d="M10 27h12M13 23v4M19 23v4" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10,000+", label: "クリエイター" },
  { value: "\u00A52.5M+", label: "月間クリエイター収益" },
  { value: "98%", label: "満足度" },
];

export default function CreatorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-deep">
        {/* ヒーロー */}
        <section className="flex min-h-[80svh] items-center justify-center px-5 pt-32 pb-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-[2.2rem] font-bold leading-[1.15] tracking-[0.02em] text-text-primary sm:text-[3.2rem] md:text-[4rem]">
              あなたのライブ配信を、
              <br />
              次のステージへ。
            </h1>
            <p className="mx-auto mt-8 max-w-md text-base font-light leading-relaxed text-text-secondary sm:text-lg tracking-wide">
              LIVE PRIMEで配信を始めて、ファンと直接つながろう。
            </p>
            <div className="mt-12">
              <Link
                href="/register"
                className="inline-block rounded-lg bg-[#f59e0b] px-10 py-4 text-sm font-semibold text-[#0a0a0f] transition-colors hover:bg-[#d97706]"
              >
                クリエイター登録
              </Link>
            </div>
          </div>
        </section>

        {/* 3つの特徴 */}
        <section className="px-5 py-24 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-bg-deep p-8 transition-colors hover:border-white/10"
              >
                <div className="mb-6 text-[#f59e0b]">{f.icon}</div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 数字で見る実績 */}
        <section className="px-5 py-24 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-2xl font-bold text-text-primary sm:text-3xl">
              数字で見る実績
            </h2>
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-[2.5rem] font-bold tracking-tight text-[#f59e0b] sm:text-[3rem]">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-28 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              クリエイターとして始めよう
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              登録は無料。数分で配信を始められます。
            </p>
            <div className="mt-10 flex flex-col items-center gap-4">
              <Link
                href="/register"
                className="inline-block rounded-lg bg-[#f59e0b] px-10 py-4 text-sm font-semibold text-[#0a0a0f] transition-colors hover:bg-[#d97706]"
              >
                今すぐクリエイター登録
              </Link>
              <Link
                href="/login"
                className="text-xs text-text-muted transition-colors hover:text-text-secondary"
              >
                すでにアカウントをお持ちの方はログイン
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
