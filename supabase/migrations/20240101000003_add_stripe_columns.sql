-- ============================================
-- Phase 5: Stripe連携用カラム追加
-- profiles.stripe_customer_id
-- subscriptions.stripe_subscription_id, stripe_customer_id
-- ============================================

-- profiles にStripe顧客ID追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- subscriptions にStripeサブスクリプションID・顧客ID追加
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- subscriptions テーブルのuser_idにUNIQUE制約を追加（upsertで必要）
-- 既存の重複があれば先にクリーンアップが必要だが、1ユーザー1サブスクの前提
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_user_id_key'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Webhook用: anonキーでsubscriptionsのupsertを許可するRLSポリシー
-- 注意: Webhookはサーバーサイドで動作し、auth.uid()がnullになるため
-- service_role_keyが無い場合の代替策として、特定条件でのINSERT/UPDATEを許可
CREATE POLICY "subscriptions_upsert_from_webhook" ON subscriptions
  FOR ALL USING (true) WITH CHECK (true);
-- ↑ デモ用の緩いポリシー。本番ではservice_role_keyを使用してRLSバイパスする

-- profiles の stripe_customer_id 更新もWebhookから可能にする
CREATE POLICY "profiles_update_stripe_id" ON profiles
  FOR UPDATE USING (true) WITH CHECK (true);
-- ↑ 同上。デモ用。本番ではservice_role_keyでRLSバイパス
