"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

/** A gold thread that fills as the reader moves down the timeline. */
export function TimelineRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/[0.08] md:left-1/2" aria-hidden="true" />
      <motion.div className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-candle-hi via-candle to-ember shadow-[0_0_12px_rgba(242,179,90,.6)] md:left-1/2" style={{ scaleY }} aria-hidden="true" />
      {children}
    </div>
  );
}
