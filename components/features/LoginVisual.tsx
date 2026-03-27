"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/thumbnails/VTuber Portrait.jpg",
  "/thumbnails/login-visual-2.jpg",
  "/thumbnails/login-visual-3.png",
];

const creators = [
  "VTuber クリエイター",
  "ミュージシャン クリエイター",
  "VTuber クリエイター",
];

export default function LoginVisual() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* PC: 左半分 */}
      <div className="relative hidden lg:block">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={creators[i]}
            fill
            className={`object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-8 right-8">
          <p className="font-display text-sm font-medium tracking-[0.2em] text-white/60 uppercase mb-2">
            Creator Platform
          </p>
          <h2 className={`font-display text-3xl font-bold text-white leading-tight transition-opacity duration-1000`}>
            LIVE PRIME<br />{creators[current]}
          </h2>
        </div>
        {/* ドットインジケーター */}
        <div className="absolute bottom-5 left-8 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/30"
              }`}
              aria-label={`画像 ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* モバイル: 上部に小さく */}
      <div className="relative h-48 lg:hidden">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={creators[i]}
            fill
            className={`object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="font-display text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
            Creator Platform
          </p>
          <h2 className="font-display text-lg font-bold text-white">
            LIVE PRIME
          </h2>
        </div>
      </div>
    </>
  );
}
