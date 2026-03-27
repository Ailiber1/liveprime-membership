"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CTASection() {
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

    const el = section.querySelector(".cta-fade");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32"
      style={{ background: "#0a0a0f" }}
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <div className="cta-fade opacity-0">
          <Link
            href="/register"
            prefetch={true}
            className="inline-block rounded-lg bg-[#f59e0b] px-8 py-4 text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:bg-[#d97706] hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]"
          >
            14日間無料で試す
          </Link>
          <p className="mt-4 text-xs text-[#5a5a72]">
            クレジットカード不要
          </p>
        </div>
      </div>
    </section>
  );
}
