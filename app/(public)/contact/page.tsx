import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
          お問い合わせ
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          ご質問やご要望がございましたら、以下のメールアドレスまでお気軽にお問い合わせください。
        </p>

        <div className="mt-10 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                メールでのお問い合わせ
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                support@liveprime.example.com
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                営業時間
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                平日 10:00 - 18:00（土日祝を除く）
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                回答までの目安
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                通常2営業日以内にご返信いたします。
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
