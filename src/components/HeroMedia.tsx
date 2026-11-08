"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Img = { src: string; alt: string } | null;

/**
 * Hero background. Priority: uploaded video, then the hero photograph (slow Ken Burns + scroll parallax),
 * then a drawn dawn over wheat fields.
 */
export function HeroMedia({ videoUrl, posterUrl, image, placeholderLabel, imageLabel }: { videoUrl?: string | null; posterUrl?: string | null; image?: Img; placeholderLabel: string; imageLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 180]);
  const fade = useTransform(scrollY, [0, 700], [1, 0.35]);

  return (
    <motion.div ref={ref} className="absolute inset-0 overflow-hidden" style={{ y, opacity: fade }}>
      {videoUrl ? (
        <video className="absolute inset-0 h-full w-full object-cover" src={videoUrl} poster={posterUrl || image?.src} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      ) : image ? (
        <div className="kenburns absolute inset-0">
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      ) : (
        <>
          <DawnCanvas className="absolute inset-0 h-full w-full" />
          <span className="placeholder-tag !top-24">{placeholderLabel}</span>
        </>
      )}
    </motion.div>
  );
}

export function DawnCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stalks = Array.from({ length: 320 }, () => ({ x: Math.random(), row: Math.random() ** 0.7, ph: Math.random() * 6.28 }));
    let raf = 0;
    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, r.width * d); cv.height = Math.max(1, r.height * d); cx.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    addEventListener("resize", size);
    const t0 = performance.now();
    const frame = (now: number) => {
      const W = cv.clientWidth, H = cv.clientHeight, tt = (now - t0) / 1000;
      const rise = reduce ? 0.55 : Math.min(1, tt / 45);
      const sky = cx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#07090d"); sky.addColorStop(0.42, "#141a26");
      sky.addColorStop(0.66, `rgb(${120 + 70 * rise},${62 + 45 * rise},${40 + 12 * rise})`); sky.addColorStop(0.74, "#e6a058");
      sky.addColorStop(1, "#1a120c");
      cx.fillStyle = sky; cx.fillRect(0, 0, W, H);
      const sunX = W * 0.66, sunY = H * (0.75 - 0.08 * rise);
      const sg = cx.createRadialGradient(sunX, sunY, 0, sunX, sunY, H * 0.7);
      sg.addColorStop(0, "rgba(255,226,170,.9)"); sg.addColorStop(0.05, "rgba(255,196,120,.6)"); sg.addColorStop(0.3, "rgba(242,150,70,.12)"); sg.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = sg; cx.fillRect(0, 0, W, H);
      const horizon = H * 0.74;
      const ground = cx.createLinearGradient(0, horizon, 0, H);
      ground.addColorStop(0, "#3a2414"); ground.addColorStop(1, "#0a0806");
      cx.fillStyle = ground; cx.fillRect(0, horizon, W, H - horizon);
      for (const s of stalks) {
        const y = horizon + s.row * (H - horizon) * 1.05, x = s.x * W, len = 8 + s.row * 46;
        const sway = reduce ? 0 : Math.sin(tt * 0.8 + s.ph + x / 140) * (1.5 + s.row * 5);
        const lightness = 30 + (1 - Math.abs(x - sunX) / W) * 35 * (1 - s.row * 0.6);
        cx.strokeStyle = `hsla(36,70%,${lightness}%,${0.35 + (1 - s.row) * 0.4})`; cx.lineWidth = 0.8 + s.row * 1.2;
        cx.beginPath(); cx.moveTo(x, y); cx.quadraticCurveTo(x + sway * 0.4, y - len * 0.6, x + sway, y - len); cx.stroke();
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
