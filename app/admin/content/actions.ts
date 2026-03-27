"use server";

import { createClient } from "@/lib/supabase/server";

export async function togglePublish(videoId: string, newValue: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "認証されていません" };
  }

  // adminロール確認
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, error: "管理者権限が必要です" };
  }

  const { error } = await supabase
    .from("videos")
    .update({ is_published: newValue })
    .eq("id", videoId);

  if (error) {
    return { success: false, error: "更新に失敗しました" };
  }

  return { success: true };
}
