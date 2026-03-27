"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export default function WelcomeToast() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    const success = searchParams.get("success");
    if (success === "true") {
      shown.current = true;
      showToast(
        "サブスクリプションの登録が完了しました！ようこそ LIVE PRIME へ。",
        "success"
      );
      // URLパラメータを消す（ブラウザ履歴を汚さない）
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams, showToast]);

  return null;
}
