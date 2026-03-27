import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIVE PRIME | 有料会員サイト",
  description: "ライブ配信事業向け有料会員プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@300;400;500;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-deep text-text-primary font-body antialiased min-h-screen">
        <noscript>
          <style>{`.content-fade, .testimonial-fade, .cta-fade, .hero-fade { opacity: 1 !important; }`}</style>
        </noscript>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
