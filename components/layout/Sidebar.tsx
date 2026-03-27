"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const memberNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "ダッシュボード",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/videos",
    label: "動画一覧",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="16" height="12" rx="2" />
        <path d="M8 7.5l5 2.5-5 2.5V7.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "設定",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.4 3.4l1.4 1.4M15.2 15.2l1.4 1.4M3.4 16.6l1.4-1.4M15.2 4.8l1.4-1.4" />
      </svg>
    ),
  },
];

const adminNavItems: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "管理ダッシュボード",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 15V8l7-5 7 5v7a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
        <path d="M8 16v-5h4v5" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "ユーザー管理",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="6" r="3" />
        <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      </svg>
    ),
  },
  {
    href: "/admin/content",
    label: "コンテンツ管理",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="2" width="14" height="16" rx="2" />
        <path d="M7 6h6M7 10h6M7 14h3" />
      </svg>
    ),
  },
  {
    href: "/admin/billing",
    label: "課金管理",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="16" height="12" rx="2" />
        <line x1="2" y1="8" x2="18" y2="8" />
        <line x1="6" y1="12" x2="10" y2="12" />
      </svg>
    ),
  },
];

interface SidebarProps {
  variant?: "member" | "admin";
}

export default function Sidebar({ variant = "member" }: SidebarProps) {
  const pathname = usePathname();
  const navItems = variant === "admin" ? adminNavItems : memberNavItems;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-[rgba(255,255,255,0.06)] bg-bg-deep lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col py-6">
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.06)] text-text-primary"
                    : "text-text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-text-secondary"
                }`}
              >
                <span className={isActive ? "text-text-secondary" : "text-text-muted"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
