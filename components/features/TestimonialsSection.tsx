"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const testimonials = [
  {
    name: "山本 健太",
    role: "料理研究家 / YouTube 登録者 48万人",
    rating: 5,
    review:
      "LIVE PRIMEで限定の料理教室を始めてから、コアなファンとの距離がぐっと縮まりました。会員限定のライブ配信は毎回満員で、リピーターが増え続けています。",
  },
  {
    name: "佐藤 美咲",
    role: "ゲーム実況者 / Twitch パートナー",
    rating: 5,
    review:
      "4K画質に切り替えてから、視聴者の反応が目に見えて変わりました。配信のクオリティを上げたい人には間違いなくおすすめです。",
  },
  {
    name: "田中 裕也",
    role: "音楽配信者 / 作曲家",
    rating: 5,
    review:
      "月額980円でこの内容は正直破格です。収益化ガイドを実践して、初月から配信の売上が2倍になりました。",
  },
  {
    name: "鈴木 あかり",
    role: "VTuber / フォロワー 12万人",
    rating: 5,
    review:
      "VTuberとしてデビューする前にここで学べたのが大きかったです。3Dモデルの準備からOBS設定まで、全部カバーされていて安心でした。",
  },
  {
    name: "高橋 大輔",
    role: "ビジネス系YouTuber / コンサルタント",
    rating: 5,
    review:
      "管理画面が直感的で使いやすい。コンテンツの公開もワンクリック。運営側としてもストレスがないのが嬉しいです。",
  },
  {
    name: "中村 あかり",
    role: "ASMR配信者 / 登録者 8万人",
    rating: 5,
    review:
      "毎晩の睡眠導入配信が会員限定で大好評。ファンとの距離が近くなり、スーパーチャットよりも安定した収入源になっています。",
  },
];

// 無限ループ用に3倍に
const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="#f59e0b"
          className="shrink-0"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.26l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  // ドラッグ/スワイプ操作
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    el.style.animationPlayState = "paused";
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.animationPlayState = "running";
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const els = section.querySelectorAll(".testimonial-fade");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-transparent overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="text-center">
          <p className="testimonial-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
            Testimonials
          </p>
          <h2 className="testimonial-fade opacity-0 mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">
            利用者の声
          </h2>
        </div>
      </div>

      {/* 自動スライド */}
      <div className="testimonial-fade opacity-0 mt-14 sm:mt-16 relative">
        {/* 左右フェード */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent" />

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`flex testimonial-scroll gap-5 pl-5 overflow-x-auto scrollbar-hide touch-pan-x ${isDragging ? "cursor-grabbing [animation-play-state:paused]" : "cursor-grab"}`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {loopedTestimonials.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="flex-shrink-0 w-[320px] sm:w-[360px] rounded-2xl border border-border bg-gradient-to-b from-bg-card to-[rgba(245,158,11,0.03)] p-6 flex flex-col transition-transform duration-300 hover:-translate-y-1"
            >
              <StarRating count={t.rating} />

              <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">
                {t.review}
              </p>

              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-sm font-medium text-text-primary">
                  {t.name}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="testimonial-fade opacity-0 mt-12 text-center text-sm text-text-muted">
        10,000人以上のクリエイターが利用中
      </p>
    </section>
  );
}
