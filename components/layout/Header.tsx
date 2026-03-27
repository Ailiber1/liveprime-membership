"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-bg-deep/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-xl font-bold tracking-tight text-primary">
            LIVE
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-text-primary">
            PRIME
          </span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                ダッシュボード
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                新規登録
              </Link>
            </>
          )}
        </nav>

        {/* モバイルハンバーガー */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          aria-label="メニュー"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-text-primary"
          >
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M3 7h18M3 12h18M3 17h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="border-t border-border/50 bg-bg-deep/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  ダッシュボード
                </Link>
                <Link
                  href="/videos"
                  className="rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  動画コンテンツ
                </Link>
                <Link
                  href="/settings"
                  className="rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  設定
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="mt-1 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                  onClick={() => setMenuOpen(false)}
                >
                  新規登録
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
