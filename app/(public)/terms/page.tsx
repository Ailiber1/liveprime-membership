import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
          利用規約
        </h1>
        <p className="mt-2 text-xs text-text-muted">最終更新日: 2026年3月27日</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              第1条（適用）
            </h2>
            <p>
              本規約は、LIVE
              PRIME（以下「当サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意の上、当サービスをご利用ください。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              第2条（会員登録）
            </h2>
            <p>
              当サービスの利用には会員登録が必要です。登録情報は正確かつ最新の情報を提供してください。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              第3条（料金・支払い）
            </h2>
            <p>
              有料プランの料金は料金プランページに記載の通りです。支払いはクレジットカードにて行います。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              第4条（禁止事項）
            </h2>
            <p>
              当サービスの不正利用、コンテンツの無断複製・配布、他のユーザーへの迷惑行為を禁止します。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              第5条（免責事項）
            </h2>
            <p>
              当サービスは現状有姿で提供されます。サービスの中断・停止により生じた損害について、当社は責任を負いません。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
