"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "ダッシュボード" },
  { href: "/admin/users", label: "ユーザー管理" },
  { href: "/admin/content", label: "コンテンツ管理" },
  { href: "/admin/billing", label: "課金管理" },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* ハンバーガーボタン + 現在のページ名 */}
      <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-white/5"
          aria-label="メニューを開く"
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          )}
        </button>
        <span className="text-sm font-medium text-text-primary">
          管理メニュー
        </span>
      </div>

      {/* ドロップダウンナビ */}
      {isOpen && (
        <nav className="border-b border-[rgba(255,255,255,0.06)] bg-bg-deep px-3 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.06)] text-text-primary font-medium"
                    : "text-text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-text-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
