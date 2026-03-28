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
    <html lang="ja" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("liveprime-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","dark")}}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
          }}
        />
        <link rel="preload" as="image" href="/thumbnails/hero-bg-1.png" fetchPriority="high" />
        <link rel="preload" as="image" href="/thumbnails/hero-bg-2.png" />
        <link rel="preload" as="image" href="/thumbnails/hero-bg-3.png" />
        <link rel="preload" as="image" href="/thumbnails/VTuber Portrait.jpg" />
        <link rel="preload" as="image" href="/thumbnails/login-visual-2.jpg" />
        <link rel="preload" as="image" href="/thumbnails/login-visual-3.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;500;600;700&display=swap"
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
