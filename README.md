# LIVE PRIME - 有料会員サイト

ライブ配信事業向け有料会員プラットフォームのポートフォリオプロジェクトです。

## デモサイト

https://liveprime-membership.vercel.app

## 技術スタック

| 技術 | 用途 |
|------|------|
| Next.js 15 (App Router) | フロントエンド + API Routes |
| TypeScript | 型安全な開発 |
| Tailwind CSS v4 | UIスタイリング |
| Supabase | 認証・DB (PostgreSQL)・RLS |
| Stripe (テストモード) | 決済フロー (Checkout / Webhook / Customer Portal) |
| Vercel | ホスティング・デプロイ |

## 主な機能

- **LP / マーケティングページ**: ヒーローセクション、特徴紹介、口コミ、料金プラン
- **認証**: メール+パスワード / Google OAuth (Supabase Auth)
- **会員エリア**: ダッシュボード、動画一覧・詳細、視聴履歴、設定
- **料金プラン**: Free / Standard / Premium の3プラン (月額・年額切替)
- **決済**: Stripe Checkout (テストモード) → Webhook → サブスクリプション管理
- **管理画面**: KPIダッシュボード、ユーザー管理、コンテンツ管理、売上管理
- **セキュリティ**: RLS (全テーブル)、CSP、CSRF対策、Webhook署名検証、ミドルウェア認証

## ディレクトリ構成

```
app/
  (public)/     ... 未ログインでアクセス可能なページ (LP, login, register, pricing等)
  (member)/     ... 認証必須の会員エリア (dashboard, videos, settings)
  admin/        ... adminロール必須の管理画面
  api/          ... API Routes (checkout, portal, webhooks)
components/     ... UIコンポーネント (layout, features, ui)
lib/            ... ユーティリティ (supabase, stripe, csrf)
supabase/       ... マイグレーションSQL
public/         ... 静的アセット
```

## セットアップ

### 前提条件

- Node.js 18+
- Supabase プロジェクト
- Stripe アカウント (テストモード)

### 手順

1. リポジトリをクローン
   ```bash
   git clone https://github.com/Ailiber1/liveprime-membership.git
   cd liveprime-membership
   ```

2. 依存パッケージをインストール
   ```bash
   npm install
   ```

3. 環境変数を設定
   ```bash
   cp .env.local.example .env.local
   # .env.local を編集して各キーを設定
   ```

4. Supabase マイグレーションを実行
   ```bash
   npx supabase db push
   ```

5. 開発サーバーを起動
   ```bash
   npm run dev
   ```

### 環境変数

`.env.local.example` を参照してください。以下のキーが必要です:

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロールキー |
| `NEXT_PUBLIC_SITE_URL` | サイトURL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 公開キー (テストモード) |
| `STRIPE_SECRET_KEY` | Stripe シークレットキー (テストモード) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook シークレット |

## セキュリティ

- 全テーブルに Row Level Security (RLS) を設定
- Content Security Policy (CSP) ヘッダーを設定
- CSRF対策 (Origin/Referer検証)
- Stripe Webhook 署名検証
- ミドルウェアによるルートレベルのアクセス制御
- 管理画面はadminロール保持者のみアクセス可能

## ライセンス

ポートフォリオプロジェクトのため、ライセンスは設定していません。
