"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DISTRICTS } from "@/lib/districts";
import type { Dict, Lang } from "@/lib/i18n";
import { pDistrict } from "@/lib/format";
import { SchematicMap } from "./SchematicMap";

type Entry = { slug: string; name: string; year: string; district: string; stand: string };

/** Mapbox dark map with a glowing light per district, sized by how many people were lost there. */
export function PunjabMap({ entries, lang, t, token }: { entries: Entry[]; lang: Lang; t: Dict; token?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const counts: Record<string, number> = {};
  entries.forEach((e) => (counts[e.district] = (counts[e.district] || 0) + 1));
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [sel, setSel] = useState<string | null>(ranked[0]?.[0] ?? null);

  useEffect(() => {
    if (!token || !box.current) return;
    let cancelled = false;
    import("mapbox-gl").then(({ default: mapboxgl }) => {
      if (cancelled || !box.current) return;
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: box.current, style: "mapbox://styles/mapbox/dark-v11",
        bounds: [[73.8, 29.5], [77.0, 32.55]], fitBoundsOptions: { padding: 40 }, cooperativeGestures: true, attributionControl: true,
      });
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      Object.entries(counts).forEach(([d, c]) => {
        const info = DISTRICTS[d];
        if (!info) return;
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", `${d}: ${c}`);
        const s = 18 + c * 8;
        el.style.cssText = `width:${s}px;height:${s}px;border-radius:999px;background:radial-gradient(circle,#fff6dc 0 18%,#ffd58f 30%,rgba(242,179,90,.55) 55%,rgba(242,179,90,0) 72%);border:0;cursor:pointer;filter:drop-shadow(0 0 14px rgba(242,179,90,.8))`;
        el.addEventListener("click", () => setSel(d));
        new mapboxgl.Marker({ element: el }).setLngLat([info.lng, info.lat]).addTo(map);
      });
    });
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const info = sel ? DISTRICTS[sel] : null;
    if (info && mapRef.current) mapRef.current.flyTo({ center: [info.lng, info.lat], zoom: 8.2, speed: 0.6, essential: true });
  }, [sel]);

  const people = entries.filter((e) => e.district === sel);

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.45fr_1fr]">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-night-2">
        {token ? (
          <div ref={box} className="h-[520px] w-full sm:h-[640px]" role="region" aria-label={t.map_title} />
        ) : (
          <div className="flex flex-col gap-4 p-6 sm:p-10">
            <div className="mx-auto w-full max-w-[560px]"><SchematicMap counts={counts} focus={sel ?? undefined} lang={lang} label={t.map_note} /></div>
            <p className="mx-auto max-w-[46ch] text-center text-[12.5px] leading-relaxed text-smoke">{t.map_legend}</p>
          </div>
        )}
        {token && <p className="label absolute bottom-4 left-5 z-10 max-w-[44ch] text-[10px] normal-case tracking-normal text-smoke">{t.map_legend}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {ranked.map(([d, c]) => (
            <button key={d} type="button" aria-pressed={sel === d} onClick={() => setSel(d)}
              className={`rounded-full border px-4 py-2 text-[14px] transition ${sel === d ? "border-candle bg-candle text-night" : "border-white/10 text-bone/80 hover:border-white/30"}`}>
              {pDistrict(d, lang)} <span className="ml-1 tabular-nums opacity-70">{c}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {sel && (
            <motion.div key={sel} className="panel flex flex-1 flex-col gap-6 p-7"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div>
                <p className="kicker">{t.district}</p>
                <h2 className="display-s mt-2">{pDistrict(sel, lang)}</h2>
                <p className="mt-1 text-smoke">{people.length} {people.length === 1 ? t.people_one : t.people_many}</p>
              </div>
              <ul className="flex flex-col divide-y divide-white/[0.07]">
                {people.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/${lang}/people/${e.slug}`} className="group flex items-start justify-between gap-4 py-4">
                      <span className="flex flex-col gap-1">
                        <span className="font-display text-[26px] leading-tight transition group-hover:text-candle">{e.name}</span>
                        <span className="text-[14px] text-smoke">{e.stand}</span>
                      </span>
                      <span className="label shrink-0 pt-2 text-[10.5px] text-smoke">{e.year}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
