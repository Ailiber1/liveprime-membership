"use client";

import { useEffect, useRef } from "react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initial: string;
}

const testimonials: Testimonial[] = [
  {
    name: "田中 裕也",
    role: "フリーランス映像クリエイター",
    content:
      "4K配信の品質に驚きました。以前使っていたプラットフォームとは比較にならないほどクリアで、視聴者からの評価も格段に上がりました。収益化ツールも使いやすく、月収が3倍になりました。",
    initial: "田",
  },
  {
    name: "佐藤 美咲",
    role: "ヨガインストラクター",
    content:
      "オンラインレッスンの会員制サイトとして利用しています。生徒さんとのコミュニケーション機能が充実していて、対面に近い親密さを保てています。サポートの対応も丁寧で安心です。",
    initial: "佐",
  },
  {
    name: "山本 健太",
    role: "料理研究家・YouTuber",
    content:
      "YouTubeだけでは届かないコアなファンに向けた限定コンテンツを配信しています。会員限定のライブ料理教室は毎回満員。プラットフォームの安定性も抜群で、配信中に落ちたことは一度もありません。",
    initial: "山",
  },
];

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

    const cards = section.querySelectorAll(".testimonial-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-primary">
            TESTIMONIALS
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
            ユーザーの声
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            実際にLIVE PRIMEを活用しているクリエイターの体験談
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card opacity-0 flex flex-col rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, si) => (
                  <svg
                    key={si}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="#f5b731"
                  >
                    <path d="M8 1l2 4.5 5 .7-3.6 3.5.9 5L8 12.4 3.7 14.7l.9-5L1 6.2l5-.7L8 1z" />
                  </svg>
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-text-secondary">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <div className="mt-5 flex items-center gap-3 border-t border-border/30 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
