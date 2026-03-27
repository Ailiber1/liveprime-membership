"use client";

import { useEffect, useRef } from "react";

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
      { threshold: 0.2 }
    );

    const els = section.querySelectorAll(".testimonial-fade");
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 sm:py-32"
      style={{ background: "#0a0a0f" }}
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
        {/* 引用テスティモニアル */}
        <blockquote className="testimonial-fade opacity-0">
          <p className="font-body text-lg font-light leading-relaxed text-[#c8c8d4] italic sm:text-xl">
            &ldquo;YouTubeだけでは届かないコアなファンに向けた限定コンテンツを配信しています。会員限定のライブ料理教室は毎回満員です。&rdquo;
          </p>
          <footer className="mt-6">
            <cite className="not-italic text-sm text-[#8b8ba3]">
              山本 健太 — 料理研究家
            </cite>
          </footer>
        </blockquote>

        {/* 社会的証明: 1行 */}
        <p className="testimonial-fade opacity-0 mt-16 text-sm text-[#5a5a72]">
          10,000人以上のクリエイターが利用中
        </p>
      </div>
    </section>
  );
}
