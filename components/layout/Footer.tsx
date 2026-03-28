import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-deep">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* ロゴ */}
          <div className="flex items-center gap-1.5">
            <span className="font-display text-lg font-bold text-[#f59e0b]">
              LIVE
            </span>
            <span className="font-display text-lg font-bold text-text-primary">
              PRIME
            </span>
          </div>

          {/* リンク */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/creator"
              prefetch={true}
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              クリエイター
            </Link>
            <Link
              href="/pricing"
              prefetch={true}
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              料金プラン
            </Link>
            <Link
              href="/terms"
              prefetch={true}
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              prefetch={true}
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              プライバシー
            </Link>
            <Link
              href="/legal"
              prefetch={true}
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              特商法表記
            </Link>
            <Link
              href="/settings/cancel"
              prefetch={true}
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              解約手続き
            </Link>
          </nav>
        </div>

        <p className="mt-8 text-center text-[10px] text-text-muted/60">
          &copy; {new Date().getFullYear()} LIVE PRIME. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
