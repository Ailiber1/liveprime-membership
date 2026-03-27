"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "山本 健太",
    role: "料理研究家 / YouTube 登録者 48万人",
    rating: 5,
    review:
      "LIVE PRIMEで限定の料理教室を始めてから、コアなファンとの距離がぐっと縮まりました。会員限定のライブ配信は毎回満員で、「ここでしか見れない」という特別感がリピーターを生んでいます。",
  },
  {
    name: "佐藤 美咲",
    role: "ゲーム実況者 / Twitch パートナー",
    rating: 5,
    review:
      "4K画質に切り替えてから、視聴者の反応が目に見えて変わりました。OBS設定の講座動画も何度も見返しています。配信のクオリティを上げたい人には間違いなくおすすめです。",
  },
  {
    name: "田中 裕也",
    role: "音楽配信者 / 作曲家",
    rating: 5,
    review:
      "月額980円でこの内容は正直破格です。収益化ガイドを実践して、初月から配信の売上が2倍に。独学では絶対にたどり着けなかった知識が詰まっていて、投資対効果が半端ないです。",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
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
      className="relative py-24 sm:py-32 bg-bg-deep"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="text-center">
          <p className="testimonial-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
            Testimonials
          </p>
          <h2 className="testimonial-fade opacity-0 mt-3 font-body text-2xl font-bold text-text-primary sm:text-4xl">
            利用者の声
          </h2>
        </div>

        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-fade opacity-0 rounded-2xl border border-border bg-bg-card p-6 sm:p-7 flex flex-col"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* 星評価 */}
              <StarRating count={t.rating} />

              {/* レビュー文 */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">
                {t.review}
              </p>

              {/* 著者 */}
              <div className="mt-6 pt-4 border-t border-border">
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

        <p className="testimonial-fade opacity-0 mt-12 text-center text-sm text-text-muted">
          10,000人以上のクリエイターが利用中
        </p>
      </div>
    </section>
  );
}
