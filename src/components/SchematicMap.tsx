import type { ReactNode } from "react";
import { DISTRICTS } from "@/lib/districts";
import type { Lang } from "@/lib/i18n";

// Simplified outline of Punjab, used when no Mapbox token is set and for the small profile pin.
const OUTLINE: [number, number][] = [[75.55,32.55],[75.95,32.2],[76.35,31.75],[76.8,31.4],[76.65,31.0],[76.9,30.85],[76.55,30.4],[76.2,30.1],[75.9,29.9],[75.6,29.75],[75.2,29.55],[74.6,29.55],[74.4,29.9],[73.9,30.15],[73.9,30.4],[74.1,30.75],[74.55,30.95],[74.55,31.15],[74.6,31.5],[74.8,31.85],[75.05,32.1],[75.3,32.35]];

export function SchematicMap({ counts, focus, lang, label, compact = false, onBone = false }: { counts: Record<string, number>; focus?: string; lang: Lang; label: string; compact?: boolean; onBone?: boolean }) {
  const W = 400, H = 460, lon0 = 73.75, lon1 = 77.05, lat0 = 29.45, lat1 = 32.65;
  const X = (lon: number) => 14 + ((lon - lon0) / (lon1 - lon0)) * (W - 28);
  const Y = (lat: number) => 14 + ((lat1 - lat) / (lat1 - lat0)) * (H - 28);
  const ink = onBone ? "#16181d" : "#f3eee4";
  const muted = onBone ? "#5e5b55" : "#8d8a84";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      <defs>
        <radialGradient id="mglow"><stop offset="0" stopColor="#ffd58f" stopOpacity=".9" /><stop offset=".35" stopColor="#f2b35a" stopOpacity=".35" /><stop offset="1" stopColor="#f2b35a" stopOpacity="0" /></radialGradient>
        <pattern id="mgrid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill={muted} opacity=".35" /></pattern>
        <clipPath id="mclip"><polygon points={OUTLINE.map(([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join(" ")} /></clipPath>
      </defs>
      <polygon points={OUTLINE.map(([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join(" ")} fill={onBone ? "#e9e2d4" : "#11141b"} stroke={onBone ? "#9a4a14" : "#f2b35a"} strokeOpacity=".55" strokeWidth="1.2" />
      <rect width={W} height={H} fill="url(#mgrid)" clipPath="url(#mclip)" />
      {(() => {
        // Labels are placed greedily: lit districts first, then quiet ones, skipping any that would collide.
        const boxes: [number, number, number, number][] = [];
        const hits = (b: [number, number, number, number]) =>
          boxes.some(([x1, y1, x2, y2]) => !(b[2] < x1 || b[0] > x2 || b[3] < y1 || b[1] > y2));
        const ch = lang === "pa" ? 6.2 : 6.4;
        const entries = Object.entries(DISTRICTS);
        const lit = entries.filter(([n]) => (compact ? focus === n : (counts[n] || 0) > 0));
        const quiet = entries.filter(([n]) => !(compact ? focus === n : (counts[n] || 0) > 0));
        const nodes: ReactNode[] = [];

        for (const [name, d] of lit) {
          const x = X(d.lng), y = Y(d.lat), c = counts[name] || 0;
          const r = compact ? 7 : 5 + c * 2.5;
          const text = `${lang === "pa" ? d.pa : name}${compact ? "" : ` · ${c}`}`;
          boxes.push([x - r, y - r, x + r + 7 + text.length * ch * 1.05, y + r]);
          nodes.push(
            <g key={name}>
              <circle cx={x} cy={y} r={r * 4.2} fill="url(#mglow)" />
              <circle cx={x} cy={y} r={r} fill="#ffd58f" stroke={focus === name ? ink : "none"} strokeWidth="1.5" />
              <text x={x + r + 7} y={y + 4} fontSize="12" fill={ink} fontFamily="var(--font-sans)" fontWeight="500">{text}</text>
            </g>,
          );
        }
        for (const [name, d] of quiet) {
          const x = X(d.lng), y = Y(d.lat);
          const text = lang === "pa" ? d.pa : name;
          const box: [number, number, number, number] = [x - 2, y - 6, x + 5 + text.length * 5.3, y + 6];
          const show = !compact && !hits(box);
          if (show) boxes.push(box);
          nodes.push(
            <g key={name}>
              <circle cx={x} cy={y} r="2.2" fill={muted} opacity=".55" />
              {show && <text x={x + 5} y={y + 3.5} fontSize="9.5" fill={muted} opacity=".8" fontFamily="var(--font-mono)">{text}</text>}
            </g>,
          );
        }
        return nodes;
      })()}
    </svg>
  );
}
