# LIVE PRIME — 有料会員サイト ポートフォリオ

## プロジェクト概要
ライブ配信事業向け有料会員サイトのポートフォリオ。
実務で100〜200万円以上の案件を受注できるレベルの品質を目指す。

**重要: このプロジェクトは全て無料枠で構築する。有料プラン・従量課金は使用しない。**

## 技術スタック
| 技術 | 用途 | プラン |
|------|------|--------|
| Next.js 15 (App Router) | フロントエンド + APIルート | — |
| TypeScript | 型安全 | — |
| Supabase | 認証・DB・Storage・RLS | Free (Spark) |
| Tailwind CSS v4 | UIスタイリング | — |
| Vercel | ホスティング・デプロイ | Hobby (無料) |
| GitHub Pages | 静的ポートフォリオ版 | Free |

## Supabase接続情報
- プロジェクトID: `zrfjxeuercupdalotwon`
- ダッシュボード: https://supabase.com/dashboard/project/zrfjxeuercupdalotwon
- APIキーは `.env.local` に配置（gitにコミットしない）

## ディレクトリ構成
```
liveprime-membership/
├── app/
│   ├── (public)/           # 未ログインページ
│   │   ├── page.tsx        # LP/トップ
│   │   ├── login/
│   │   └── register/
│   ├── (member)/           # 会員専用エリア（認証必須）
│   │   ├── dashboard/
│   │   ├── videos/
│   │   └── settings/
│   ├── (admin)/            # 管理画面（adminロール必須）
│   │   ├── users/
│   │   ├── billing/
│   │   └── content/
│   ├── api/
│   │   ├── webhooks/stripe/
│   │   └── auth/
│   └── layout.tsx
├── components/
│   ├── ui/                 # 共通UIコンポーネント
│   ├── layout/             # Header, Footer, Sidebar
│   └── features/           # 機能別コンポーネント
├── lib/
│   ├── supabase/           # Supabaseクライアント
│   └── utils/
├── supabase/
│   └── migrations/
├── public/
├── tests/
│   └── e2e/
└── docs/                   # 静的ポートフォリオ版（GitHub Pages用）
```

## 命名規則
- コンポーネント: PascalCase (`VideoPlayer.tsx`)
- ユーティリティ: camelCase (`formatDate.ts`)
- API Route: kebab-case (`/api/webhooks/stripe`)
- DB テーブル: snake_case (`watch_history`)
- CSS: Tailwind ユーティリティ優先、カスタムは CSS Variables

## デザインシステム
- ブランド名: **LIVE PRIME**
- プライマリカラー: `#ff0054` (Crimson Magenta)
- セカンダリ: `#6c5ce7` (Indigo)
- アクセント: `#f5b731` (Gold — Premiumを表現)
- 背景: `#07070e` (Deep Dark)
- フォント: Outfit (Display) + Noto Sans JP (Body) + JetBrains Mono (Code/Numbers)
- **AIスロップ排除**: 紫グラデ、定番ヒーローセクション、過度な角丸、意味のないアイコン羅列は禁止

## 決済（ポートフォリオ用デモ）
- Stripe Checkout UIはモック実装（テストモードの画面遷移デモ）
- 実際の課金処理は行わない
- プラン: Free (¥0), Standard (¥980/月), Premium (¥2,980/月)

## セキュリティ
- RLS（Row Level Security）必須 — 全テーブルに設定
- Supabase Auth のセッション検証を middleware.ts で実施
- APIエンドポイントにはレート制限を検討
- `.env.local` は `.gitignore` に含める
- Supabase クライアントAPIキー（`anon key`）のみコード内に記載可

## エージェントハーネス構成
- **規模**: 大規模（3エージェント構成）
- **Planner**: メインエージェント
- **Generator**: Agentツールのサブエージェント（Phase単位で新規起動）
- **Evaluator**: Generatorとは別のサブエージェント（自己評価バイアス防止）
- **スコアリング**: 115点満点（セキュリティ15点含む）
- **合格ライン**: 92点以上（80%）

---

## スプリントコントラクト

### Phase 1: 基盤構築（Next.js + Supabase Auth + DB設計）

#### 実装する機能
- [ ] Next.js App Router プロジェクト生成 + TypeScript + Tailwind CSS
- [ ] Supabase マイグレーション（profiles, subscriptions, videos, watch_history）
- [ ] RLS ポリシー設定（会員は自分のデータのみ、adminは全データ）
- [ ] Supabase Auth（メール+パスワード、Google OAuth）
- [ ] middleware.ts（セッション検証、(member)/は認証必須、(admin)/はadmin必須）
- [ ] Supabase クライアント（server.ts / client.ts）

#### 完了条件
1. `npm run dev` でエラーなく起動する
2. Supabaseダッシュボードにテーブル4つが作成されている
3. RLSが全テーブルで有効化されている
4. `/login` にアクセスするとログインページが表示される
5. メール+パスワードで登録 → ログインができる
6. 未ログインで `/dashboard` にアクセスすると `/login` にリダイレクトされる
7. コンソールにエラーが出ない
8. モバイル表示でレイアウトが崩れない

#### Playwright検証項目
- browser_navigate → http://localhost:3000
- browser_navigate → http://localhost:3000/dashboard → /login にリダイレクト確認
- browser_fill_form → 登録フォーム入力
- browser_click → 「登録」ボタン
- 期待結果: ダッシュボードに遷移

---

### Phase 2: LP + 認証UI + 共通コンポーネント

#### 実装する機能
- [ ] LP: ヒーロー（アニメーション背景）、特徴セクション、口コミ、CTA、フッター
- [ ] ログインページ（フォームバリデーション、Google OAuth、エラー日本語表示）
- [ ] 会員登録ページ（同上）
- [ ] 共通ヘッダー（ログイン状態で表示切替）
- [ ] 共通フッター
- [ ] サイドバーナビゲーション（会員/管理者エリア用）
- [ ] レスポンシブ対応（PC/タブレット/スマホ）

#### 完了条件
1. LP にアクセスするとヒーロー・特徴・口コミ・CTAが表示される
2. スクロールアニメーションが動作する
3. ログインページでバリデーション（メール形式、パスワード8文字以上）が動作する
4. エラーメッセージが日本語で表示される
5. Google OAuth ボタンが表示される（クリックでSupabase OAuth開始）
6. ログイン成功後、ヘッダーがユーザーアイコン表示に切り替わる
7. 375px幅でレイアウトが崩れない
8. コンソールにエラーが出ない
9. AIスロップパターン（紫グラデ、定番ヒーロー等）を使用していない

#### Playwright検証項目
- browser_navigate → http://localhost:3000 → LP表示確認
- browser_resize(375, 812) → スマホ表示確認
- browser_navigate → /login → フォーム表示確認
- browser_fill_form → 不正なメール入力 → バリデーションエラー確認
- browser_fill_form → 正しい情報 → ログイン → ダッシュボードに遷移

---

### Phase 3: 会員エリア（ダッシュボード・動画一覧・動画詳細）

#### 実装する機能
- [ ] 会員ダッシュボード（サブスク状態、最近の動画、KPIカード、アクティビティ）
- [ ] 動画一覧（グリッド表示、検索、フィルタ: 全て/無料/プレミアム/ライブ）
- [ ] 動画詳細（プレーヤー領域、説明、クリエイター情報、関連動画）
- [ ] ペイウォールゲート（未契約ユーザーへの「プランに加入」CTA）
- [ ] 視聴履歴の記録（Supabase watch_history テーブル更新）

#### 完了条件
1. ログイン後 `/dashboard` にKPIカード・続きを見る・アクティビティが表示される
2. `/videos` で動画一覧がグリッド表示される
3. 検索で動画タイトルが絞り込まれる
4. フィルタ（無料/プレミアム）で表示が切り替わる
5. 動画カードクリックで詳細ページに遷移する
6. プレミアム動画に未契約でアクセスするとペイウォールが表示される
7. コンソールにエラーが出ない
8. 375px幅でレイアウトが崩れない

---

### Phase 4: 料金プラン・設定・管理画面

#### 実装する機能
- [ ] 料金プラン選択ページ（月払い/年払いトグル、3プランカード）
- [ ] 決済ボタン → デモ用トースト表示（「Stripe Checkoutへリダイレクト（デモ）」）
- [ ] 設定ページ: プロフィールタブ（表示名、アバター、メール）
- [ ] 設定ページ: サブスクリプションタブ（プラン情報、請求履歴）
- [ ] 設定ページ: セキュリティタブ（パスワード変更、連携アカウント）
- [ ] 管理ダッシュボード（KPIカード: 総ユーザー/MRR/有料会員/解約率）
- [ ] 管理画面: 売上推移チャート（SVG）
- [ ] 管理画面: ユーザー管理テーブル（検索、フィルタ、ページネーション）
- [ ] 管理画面: コンテンツ管理（動画一覧、公開/非公開切替）

#### 完了条件
1. `/pricing` で3プランが表示され、月払い/年払いトグルで価格が切り替わる
2. 決済ボタンでトースト通知が表示される
3. `/settings` でプロフィール・サブスク・セキュリティの3タブが動作する
4. プロフィール保存でトースト通知が表示される
5. `/admin` にKPIカードと売上チャートが表示される
6. ユーザー管理テーブルに検索・フィルタが動作する
7. adminロール以外は `/admin` にアクセスできない
8. コンソールにエラーが出ない
9. 375px幅でレイアウトが崩れない

---

### Phase 5: 統合テスト・セキュリティ・デプロイ

#### 実装する機能
- [ ] Playwright E2Eテスト（認証フロー、ページ遷移、アクセス制御）
- [ ] Semgrep 静的解析 → HIGH/CRITICAL指摘ゼロ
- [ ] npm audit → high/critical ゼロ
- [ ] GitLeaks → シークレット漏洩ゼロ
- [ ] CSP ヘッダー設定
- [ ] Vercel デプロイ + 環境変数設定
- [ ] GitHub Pages 用静的ポートフォリオ版

#### 完了条件
1. Playwright テストが全パス
2. Semgrep で HIGH/CRITICAL 指摘がゼロ
3. npm audit で high/critical がゼロ
4. GitLeaks で検出ゼロ
5. Vercel にデプロイされ、公開URLでアクセス可能
6. GitHub Pages で静的版が閲覧可能

---

## スコア記録

### Phase 1: 94点/115点（81.7%）→ 合格
- 機能28/エラー18/デザイン16/独創性12/レスポンシブ12/セキュリティ8
- 指摘事項（Phase 2で対応）:
  1. Google OAuth redirectTo のURL構築ロジック修正
  2. 不要ファイル（html, png）のリポジトリ除外
  3. Google OAuthボタンのUI配置
  4. components/ ディレクトリ整理

### Phase 2: 82点 → 修正後93点/115点（80.9%）→ 合格
- 機能28/エラー18/デザイン18/独創性12/レスポンシブ13/セキュリティ4
- 修正済み: resizeリスナークリーンアップ、統計カウンター375px対応、JS無効フォールバック、モバイルサイドバー
- 残存事項（Phase 3以降で対応）:
  1. globals.cssの.noscript-visibleクラス削除（死コード）
  2. デスクトップ/モバイルナビの統一
  3. フッターのリンク先ページ作成
  4. ダッシュボードの仮テキスト置き換え

### Phase 3: 89点 → 修正後93点/115点（80.9%）→ 合格
- 機能25/エラー17/デザイン17/独創性11/レスポンシブ13/セキュリティ10
- 修正済み: 視聴履歴記録、続きを見るセクション、select("*")制限、Header二重ナビ解消
- 残存事項（Phase 4以降で対応）:
  1. select("*")が4箇所残存（videos/page.tsx, dashboard, 関連動画）
  2. videoUrl取得後未使用（ESLint Warning）
  3. PlayButtonが再生を開始しない
  4. お気に入りがDB保存されない
  5. フッターのリンク先ページ未作成

### Phase 4: 86点 → 修正後98点/115点（85.2%）→ 合格
- 機能27/エラー18/デザイン17/独創性11/レスポンシブ13/セキュリティ12
- 修正済み: currentPassword検証、プラン別フィルタ、/admin/billing作成、モバイルナビ、adminロール確認
- 残存事項（Phase 5で対応）:
  1. select("*")が一部残存
  2. videoUrl未使用Warning
  3. ユーザー管理ページネーション未実装
  4. PlayButtonが再生を開始しない
