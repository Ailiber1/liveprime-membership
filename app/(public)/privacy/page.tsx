import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
          プライバシーポリシー
        </h1>
        <p className="mt-2 text-xs text-text-muted">最終更新日: 2026年3月27日</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              1. 収集する情報
            </h2>
            <p>
              当サービスでは、会員登録時にメールアドレス、表示名等の情報を収集します。また、サービス利用時にアクセスログ、視聴履歴等を自動的に収集します。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              2. 情報の利用目的
            </h2>
            <p>
              収集した情報は、サービスの提供・改善、ユーザーサポート、お知らせの配信に利用します。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              3. 情報の第三者提供
            </h2>
            <p>
              法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              4. セキュリティ
            </h2>
            <p>
              個人情報の漏洩・紛失・毀損を防止するため、適切なセキュリティ対策を実施しています。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              5. お問い合わせ
            </h2>
            <p>
              プライバシーに関するお問い合わせは、お問い合わせページよりご連絡ください。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
