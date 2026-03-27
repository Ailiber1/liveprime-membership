import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const faqs = [
  {
    question: "無料トライアルはありますか？",
    answer:
      "はい、14日間の無料トライアルをご用意しています。クレジットカード不要でお試しいただけます。",
  },
  {
    question: "プランの変更はいつでもできますか？",
    answer:
      "はい、いつでもアップグレード・ダウングレードが可能です。変更は次の請求サイクルから適用されます。",
  },
  {
    question: "支払い方法は何がありますか？",
    answer:
      "クレジットカード（Visa, Mastercard, JCB, American Express）でのお支払いに対応しています。",
  },
  {
    question: "解約はどうすればいいですか？",
    answer:
      "設定画面のサブスクリプションタブからいつでも解約できます。解約後も期間終了まではサービスをご利用いただけます。",
  },
  {
    question: "動画はダウンロードできますか？",
    answer:
      "Premiumプランをご利用の場合、対象の動画をオフラインで再生いただけます。",
  },
  {
    question: "複数のデバイスで視聴できますか？",
    answer:
      "はい、お持ちのデバイスからログインしてご視聴いただけます。同時視聴はプランによって異なります。",
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
          よくある質問
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          お探しの答えが見つからない場合は、お問い合わせページからご連絡ください。
        </p>

        <div className="mt-10 space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6"
            >
              <h2 className="text-sm font-semibold text-text-primary sm:text-base">
                {faq.question}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
