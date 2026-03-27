"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number; // 前フレームのz（トレイル描画用）
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const speedRef = useRef(0.5);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = section.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // 星の初期化
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 400 : 800;
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      const z = Math.random() * 1000;
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z,
        pz: z,
      });
    }
    starsRef.current = stars;

    // マウス追従
    const handlePointer = (cx: number, cy: number) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: (cx - rect.left) / rect.width,
        y: (cy - rect.top) / rect.height,
      };
    };
    const onMouse = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handlePointer(t.clientX, t.clientY);
    };

    section.addEventListener("mousemove", onMouse, { passive: true });
    section.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    // 描画ループ
    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2 + (mouseRef.current.x - 0.5) * 200;
      const cy = h / 2 + (mouseRef.current.y - 0.5) * 200;
      const speed = speedRef.current;

      for (const star of starsRef.current) {
        star.pz = star.z;
        star.z -= speed * 8;

        if (star.z <= 0.5) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 1000;
          star.pz = 1000;
          continue;
        }

        // 現在位置をスクリーン座標に変換
        const sx = (star.x / star.z) * 300 + cx;
        const sy = (star.y / star.z) * 300 + cy;

        // 前フレーム位置（トレイル）
        const px = (star.x / star.pz) * 300 + cx;
        const py = (star.y / star.pz) * 300 + cy;

        // 画面外チェック
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;

        // 距離に応じたサイズと明るさ
        const depth = 1 - star.z / 1000;
        const size = depth * 2.5;
        const alpha = depth * 0.9;

        // 下部フェードアウト
        const yRatio = sy / h;
        const fade = yRatio < 0.75 ? 1 : Math.max(0, 1 - (yRatio - 0.75) / 0.25);
        const finalAlpha = alpha * fade;

        if (finalAlpha <= 0.01) continue;

        // トレイル（線）を描画
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.lineWidth = size * 0.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha * 0.5})`;
        ctx.stroke();

        // 星（点）を描画
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      section.removeEventListener("mousemove", onMouse);
      section.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      const els = section.querySelectorAll(".hero-fade");
      els.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = "0";
        htmlEl.style.transform = "translateY(20px)";
        setTimeout(() => {
          htmlEl.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          htmlEl.style.opacity = "1";
          htmlEl.style.transform = "translateY(0)";
        }, 200 + i * 150);
      });
    }

    const cleanup = initCanvas();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initCanvas]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-bg-deep"
    >
      {/* ダークモード: 星空キャンバス / ライトモード: 温かみグラデーション */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 dark-only-canvas"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 light-only-bg"
        aria-hidden="true"
        style={{
          background: "linear-gradient(180deg, #f8f6f1 0%, #fef3e2 40%, #fde8c8 70%, #f8f6f1 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-32 text-center sm:px-6">
        <h1 className="hero-fade font-body text-[2.5rem] font-bold leading-[1.15] tracking-tight text-text-primary sm:text-[3.5rem] md:text-[4rem]">
          ライブの熱量を、
          <br />
          そのままあなたへ。
        </h1>

        <p className="hero-fade mx-auto mt-8 max-w-md text-base font-light leading-relaxed text-text-secondary sm:text-lg">
          限定配信、4K高画質、クリエイターとの直接交流。
          <br className="hidden sm:block" />
          月額980円から見放題。
        </p>

        <div className="hero-fade mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
          <Link
            href="/register"
            prefetch={true}
            className="inline-block rounded-lg bg-[#f59e0b] px-8 py-4 text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:bg-[#d97706] hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]"
          >
            無料で始める
          </Link>
          <Link
            href="/pricing"
            prefetch={true}
            className="inline-block rounded-lg border border-border px-8 py-4 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-text-muted hover:text-text-primary"
          >
            料金プランを見る
          </Link>
        </div>
        <p className="hero-fade mt-5 text-center text-xs text-text-muted">
          14日間無料 ・ クレジットカード不要
        </p>
      </div>
    </section>
  );
}
