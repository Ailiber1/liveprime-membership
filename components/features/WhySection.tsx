"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const features = [
  {
    number: "4K",
    numericValue: 4,
    suffix: "K",
    label: "高画質配信",
    description: "映画品質の映像体験。配信者の表現力をそのまま届ける。",
  },
  {
    number: "10,000+",
    numericValue: 10000,
    suffix: "+",
    label: "クリエイター",
    description: "ジャンルを超えた多彩な配信者が日々コンテンツを発信中。",
  },
  {
    number: "24/7",
    numericValue: 24,
    suffix: "/7",
    label: "いつでも視聴可能",
    description: "見逃した配信もアーカイブで。好きな時間に、好きなだけ。",
  },
];

function formatNumber(value: number, target: { numericValue: number; suffix: string }) {
  if (target.numericValue === 10000) {
    return value.toLocaleString() + target.suffix;
  }
  return value + target.suffix;
}

function CountUpNumber({ feature, shouldAnimate }: { feature: typeof features[0]; shouldAnimate: boolean }) {
  const [displayValue, setDisplayValue] = useState("0" + feature.suffix);

  useEffect(() => {
    if (!shouldAnimate) return;

    const target = feature.numericValue;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * target);
      setDisplayValue(formatNumber(current, feature));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [shouldAnimate, feature]);

  return (
    <span className="font-display text-[3.5rem] sm:text-[4.5rem] md:text-[5rem] font-extrabold leading-none bg-gradient-to-b from-[#f59e0b] via-[#fbbf24] to-[#d97706] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]">
      {displayValue}
    </span>
  );
}

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // カウントアップ開始トリガー
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // フェードイン
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

    const els = section.querySelectorAll(".why-fade");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 sm:py-40 overflow-hidden bg-transparent"
    >
      <div className="relative mx-auto max-w-5xl px-5 sm:px-6">
        <div className="text-center">
          <p className="why-fade opacity-0 text-sm font-medium text-[#f59e0b] tracking-widest uppercase">
            Why LIVE PRIME
          </p>
          <h2 className="why-fade opacity-0 mt-3 font-body text-2xl font-bold text-text-primary sm:text-4xl">
            なぜ LIVE PRIME なのか
          </h2>
        </div>

        <div className="mt-20 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-14 sm:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="why-fade opacity-0 text-center"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <CountUpNumber feature={f} shouldAnimate={shouldAnimate} />
              <p className="mt-4 text-lg font-semibold text-text-primary">
                {f.label}
              </p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
