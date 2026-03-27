"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import { updateProfile, updatePassword } from "./actions";

interface SettingsTabsProps {
  userId: string;
  email: string;
  profile: {
    displayName: string;
    avatarUrl: string;
    bio: string;
  };
  subscription: {
    plan: string;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
  };
  provider: string;
}

type TabId = "profile" | "subscription" | "security";

const tabs: { id: TabId; label: string }[] = [
  { id: "profile", label: "プロフィール" },
  { id: "subscription", label: "サブスクリプション" },
  { id: "security", label: "セキュリティ" },
];

// モック請求履歴
const billingHistory = [
  { id: "inv_001", date: "2026-03-01", amount: 980, status: "支払済" },
  { id: "inv_002", date: "2026-02-01", amount: 980, status: "支払済" },
  { id: "inv_003", date: "2026-01-01", amount: 980, status: "支払済" },
  { id: "inv_004", date: "2025-12-01", amount: 980, status: "支払済" },
];

const planLabels: Record<string, string> = {
  free: "Free",
  standard: "Standard",
  premium: "Premium",
};

export default function SettingsTabs({
  email,
  profile,
  subscription,
  provider,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  // パスワード変更用
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = () => {
    startTransition(async () => {
      const result = await updateProfile({ displayName, bio });
      if (result.success) {
        showToast("プロフィールを更新しました", "success");
      } else {
        showToast(result.error || "更新に失敗しました", "error");
      }
    });
  };

  const handlePasswordChange = () => {
    if (!currentPassword) {
      showToast("現在のパスワードを入力してください", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("パスワードは8文字以上で入力してください", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("新しいパスワードが一致しません", "error");
      return;
    }
    startTransition(async () => {
      const result = await updatePassword(currentPassword, newPassword);
      if (result.success) {
        showToast("パスワードを変更しました", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(result.error || "パスワードの変更に失敗しました", "error");
      }
    });
  };

  const handlePlanChange = () => {
    showToast("プラン変更ページへリダイレクトします（デモ）", "info");
  };

  const handleCancel = () => {
    showToast("解約手続きを開始します（デモ）", "info");
  };

  // サブスク期間の進捗
  const periodProgress = (() => {
    if (!subscription.currentPeriodStart || !subscription.currentPeriodEnd) return 0;
    const start = new Date(subscription.currentPeriodStart).getTime();
    const end = new Date(subscription.currentPeriodEnd).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  })();

  return (
    <div>
      {/* タブ切り替え */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* プロフィールタブ */}
      {activeTab === "profile" && (
        <div className="max-w-xl space-y-6">
          {/* アバター */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
              {displayName?.charAt(0)?.toUpperCase() || email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">プロフィール画像</p>
              <p className="text-xs text-text-muted">JPGまたはPNG、最大2MB</p>
            </div>
          </div>

          {/* 表示名 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              表示名
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示名を入力"
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:outline-none"
            />
          </div>

          {/* メール（読み取り専用） */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-border bg-bg-input/50 px-3 py-2.5 text-sm text-text-muted"
            />
            <p className="mt-1 text-xs text-text-muted">メールアドレスは変更できません</p>
          </div>

          {/* 自己紹介 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              自己紹介
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="自己紹介を入力"
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:outline-none"
            />
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleProfileSave}
            disabled={isPending}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {isPending ? "保存中..." : "変更を保存"}
          </button>
        </div>
      )}

      {/* サブスクリプションタブ */}
      {activeTab === "subscription" && (
        <div className="max-w-xl space-y-6">
          {/* 現在のプラン */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">現在のプラン</p>
                <p className="mt-1 font-display text-xl font-bold text-text-primary">
                  {planLabels[subscription.plan] || subscription.plan}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                subscription.status === "active" ? "bg-success/10 text-success" : "bg-error/10 text-error"
              }`}>
                {subscription.status === "active" ? "有効" : "無効"}
              </span>
            </div>

            {/* 期間進捗バー */}
            {subscription.currentPeriodEnd && (
              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
                  <span>現在の請求期間</span>
                  <span>{periodProgress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${periodProgress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  次回更新日: {new Date(subscription.currentPeriodEnd).toLocaleDateString("ja-JP")}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handlePlanChange}
                className="rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                プランを変更
              </button>
              {subscription.plan !== "free" && (
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-error/50 hover:text-error"
                >
                  解約する
                </button>
              )}
            </div>
          </div>

          {/* 請求履歴 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">請求履歴</h3>
            <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-text-muted">請求日</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-text-muted">金額</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-text-muted">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0">
                      <td className="px-4 py-2.5 text-text-secondary">
                        {new Date(item.date).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-text-primary">
                        &yen;{item.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs text-success">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* セキュリティタブ */}
      {activeTab === "security" && (
        <div className="max-w-xl space-y-6">
          {/* パスワード変更 */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">パスワード変更</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-text-secondary">現在のパスワード</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text-primary focus:border-primary/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-secondary">新しいパスワード</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text-primary focus:border-primary/50 focus:outline-none"
                />
                <p className="mt-1 text-xs text-text-muted">8文字以上</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-secondary">パスワード確認</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text-primary focus:border-primary/50 focus:outline-none"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={isPending}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {isPending ? "変更中..." : "パスワードを変更"}
              </button>
            </div>
          </div>

          {/* 連携アカウント */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">連携アカウント</h3>
            <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-text-primary">Google</p>
                  <p className="text-xs text-text-muted">
                    {provider === "google" ? "連携済み" : "未連携"}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  provider === "google"
                    ? "bg-success/10 text-success"
                    : "bg-border text-text-muted"
                }`}
              >
                {provider === "google" ? "接続済み" : "未接続"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
