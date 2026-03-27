"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(data: { displayName: string; bio: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "認証されていません" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: data.displayName,
      bio: data.bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: "プロフィールの更新に失敗しました" };
  }

  return { success: true };
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "認証されていません" };
  }

  if (!user.email) {
    return { success: false, error: "メールアドレスが取得できません" };
  }

  // 現在のパスワードを検証
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: "現在のパスワードが正しくありません" };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
