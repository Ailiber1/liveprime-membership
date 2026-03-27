import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* ブランド */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="font-display text-xl font-bold text-primary">
                LIVE
              </span>
              <span className="font-display text-xl font-bold text-text-primary">
                PRIME
              </span>
            </div>
            <p className="text-sm leading-relaxed text-text-muted">
              プレミアムなライブ体験を提供する
              <br />
              会員制プラットフォーム
            </p>
          </div>

          {/* サービス */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              サービス
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  特徴
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  料金プラン
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  ユーザーの声
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              サポート
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  よくある質問
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              法的情報
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/30 pt-6">
          <p className="text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} LIVE PRIME. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
