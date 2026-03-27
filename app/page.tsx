import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="font-display text-4xl font-bold tracking-tight mb-4">
        <span className="text-primary">LIVE</span>{" "}
        <span className="text-text-primary">PRIME</span>
      </h1>
      <p className="text-text-secondary text-lg mb-8">
        有料会員プラットフォーム
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
        >
          ログイン
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
        >
          新規登録
        </Link>
      </div>
    </main>
  );
}
