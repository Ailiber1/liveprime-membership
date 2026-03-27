import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
          特定商取引法に基づく表記
        </h1>

        <div className="mt-8 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="font-semibold text-text-primary">販売業者</dt>
              <dd className="mt-1 text-text-secondary">LIVE PRIME 運営事務局</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-primary">
                運営責任者
              </dt>
              <dd className="mt-1 text-text-secondary">（ポートフォリオ用デモのため省略）</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-primary">所在地</dt>
              <dd className="mt-1 text-text-secondary">（ポートフォリオ用デモのため省略）</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-primary">
                お問い合わせ
              </dt>
              <dd className="mt-1 text-text-secondary">
                support@liveprime.example.com
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-text-primary">販売価格</dt>
              <dd className="mt-1 text-text-secondary">
                各プランの料金ページに記載の通り（税込）
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-text-primary">
                支払い方法
              </dt>
              <dd className="mt-1 text-text-secondary">クレジットカード決済</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-primary">
                サービス提供時期
              </dt>
              <dd className="mt-1 text-text-secondary">
                決済完了後、即時ご利用いただけます
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-text-primary">
                キャンセル・返金
              </dt>
              <dd className="mt-1 text-text-secondary">
                いつでも解約可能です。年払いプランは残期間分を日割り返金いたします。
              </dd>
            </div>
          </dl>
        </div>
      </main>
      <Footer />
    </>
  );
}
