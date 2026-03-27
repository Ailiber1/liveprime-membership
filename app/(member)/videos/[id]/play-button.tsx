"use client";

import { createClient } from "@/lib/supabase/client";

interface PlayButtonProps {
  videoId: string;
  userId: string;
}

export default function PlayButton({ videoId, userId }: PlayButtonProps) {
  async function handlePlay() {
    const supabase = createClient();
    await supabase.from("watch_history").upsert(
      {
        user_id: userId,
        video_id: videoId,
        watched_seconds: 0,
        completed: false,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: "user_id,video_id" }
    );
  }

  return (
    <button
      onClick={handlePlay}
      className="group flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="ml-1 text-white"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </button>
  );
}
