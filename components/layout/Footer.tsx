import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)]" style={{ background: "#0a0a0f" }}>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* ロゴ */}
          <div className="flex items-center gap-1.5">
            <span className="font-display text-lg font-bold text-[#f59e0b]">
              LIVE
            </span>
            <span className="font-display text-lg font-bold text-white">
              PRIME
            </span>
          </div>

          {/* リンク */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/pricing"
              prefetch={true}
              className="text-xs text-[#5a5a72] transition-colors hover:text-[#8b8ba3]"
            >
              料金プラン
            </Link>
            <Link
              href="/terms"
              prefetch={true}
              className="text-xs text-[#5a5a72] transition-colors hover:text-[#8b8ba3]"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              prefetch={true}
              className="text-xs text-[#5a5a72] transition-colors hover:text-[#8b8ba3]"
            >
              プライバシー
            </Link>
            <Link
              href="/legal"
              prefetch={true}
              className="text-xs text-[#5a5a72] transition-colors hover:text-[#8b8ba3]"
            >
              特商法表記
            </Link>
          </nav>
        </div>

        <p className="mt-8 text-center text-[10px] text-[#3a3a4a]">
          &copy; {new Date().getFullYear()} LIVE PRIME. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
