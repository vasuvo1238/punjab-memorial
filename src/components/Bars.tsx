"use client";
import { motion } from "framer-motion";

/** Horizontal bars on one scale, growing in when seen. Value printed at the end of each bar. */
export function Bars({ rows, format = "plain", onBone = false }: { rows: [string, number][]; format?: "plain" | "kg"; onBone?: boolean }) {
  const fmt = (v: number) => (format === "kg" ? v.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : String(v));
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="flex flex-col gap-3.5">
      {rows.map(([label, v], i) => (
        <div key={label} className="grid grid-cols-[minmax(0,92px)_minmax(0,1fr)_64px] items-center gap-3 text-[14px]">
          <span className={`truncate font-mono text-[12.5px] ${onBone ? "text-stone" : "text-smoke"}`}>{label}</span>
          <span className={`relative h-[10px] overflow-hidden rounded-full ${onBone ? "bg-ink/[0.07]" : "bg-white/[0.06]"}`}>
            <motion.span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ember to-candle-hi"
              initial={{ width: 0 }} whileInView={{ width: `${(v / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 * i }} />
          </span>
          <b className="text-right font-mono text-[13px] font-medium tabular-nums">{fmt(v)}</b>
        </div>
      ))}
    </div>
  );
}
