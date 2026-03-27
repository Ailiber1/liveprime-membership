"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const testimonials = [
  {
    quote: "YouTubeだけでは届かないコアなファンに向けた限定コンテンツを配信しています。会員限定のライブ料理教室は毎回満員です。",
    name: "山本 健太",
    role: "料理研究家 / YouTube 登録者 48万人",
  },
  {
    quote: "配信の質が一気に上がりました。4K画質で視聴者からの評価が目に見えて変わった。OBS講座は何度も見返しています。",
    name: "佐藤 美咲",
    role: "ゲーム実況者 / Twitch パートナー",
  },
  {
    quote: "月額980円でこの内容は正直破格。収益化ガイドを実践して、初月から配信の売上が2倍になりました。",
    name: "田中 裕也",
    role: "音楽配信者 / 作曲家",
  },
  {
    quote: "海外視聴者へのリーチが課題だったけど、ここで学んだ戦略で英語圏のフォロワーが3倍に。コミュニティの仲間にも感謝。",
    name: "鈴木 あかり",
    role: "トラベル Vlogger / Instagram 12万フォロワー",
  },
  {
    quote: "他のプラットフォームと比べて圧倒的に使いやすい。管理画面が直感的で、コンテンツの公開もワンクリックです。",
    name: "高橋 大輔",
    role: "ビジネス系 YouTuber / コンサルタント",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length);
  }, [current, goTo]);

  // 自動スライド（5秒間隔）
  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  // フェードインアニメーション
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
      { threshold: 0.2 }
    );

    const els = section.querySelectorAll(".testimonial-fade");
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 sm:py-32"
      style={{ background: "#0a0a0f" }}
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <blockquote className="testimonial-fade opacity-0">
          {/* 引用テキスト */}
          <div className="relative min-h-[120px] sm:min-h-[100px]">
            <p
              className={`font-body text-lg font-light leading-relaxed text-[#c8c8d4] italic sm:text-xl transition-opacity duration-300 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
          </div>

          {/* クリエイター情報 */}
          <footer
            className={`mt-6 transition-opacity duration-300 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            <cite className="not-italic">
              <span className="text-sm font-medium text-text-primary">{t.name}</span>
              <span className="mx-2 text-text-muted">—</span>
              <span className="text-sm text-[#8b8ba3]">{t.role}</span>
            </cite>
          </footer>
        </blockquote>

        {/* ドットインジケーター */}
        <div className="testimonial-fade opacity-0 mt-10 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                goTo(i);
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(next, 5000);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-[#f59e0b]"
                  : "w-1.5 bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.3)]"
              }`}
              aria-label={`テスティモニアル ${i + 1}`}
            />
          ))}
        </div>

        {/* 社会的証明 */}
        <p className="testimonial-fade opacity-0 mt-16 text-sm text-[#5a5a72]">
          10,000人以上のクリエイターが利用中
        </p>
      </div>
    </section>
  );
}
