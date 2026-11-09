"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export type Lamp = { slug: string; name: string; pa: string; year: string; district: string };

/** Pre-rendered glow sprite. Drawing one image per lamp is far cheaper than a gradient per lamp per frame. */
function sprite(core: number, warmth: string) {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, `rgba(255,255,255,${core})`);
  g.addColorStop(0.035, `rgba(255,236,196,${core * 0.9})`);
  g.addColorStop(0.09, warmth);
  g.addColorStop(0.2, "rgba(242,179,90,0.22)");
  g.addColorStop(0.45, "rgba(242,179,90,0.06)");
  g.addColorStop(1, "rgba(242,179,90,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  return c;
}

type Pt = { x: number; z: number; r: number; phase: number; speed: number; named: number };

/**
 * A field of lamps set out on dark ground, one bright for every name recorded and many
 * dim behind them for the deaths no one wrote down. Scrolling walks the length of it.
 */
export function FieldOfLamps({ people, lang, title, sub, unnamed }: {
  people: Lamp[]; lang: "en" | "pa"; title: string; sub: string; unnamed: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const names = useRef<(HTMLDivElement | null)[]>([]);
  const tail = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = cv.current, host = wrap.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const SPACING = 7.2, START = 9;
    const lastZ = START + (people.length - 1) * SPACING;
    const endZ = lastZ + 9;

    // Deterministic scatter, so the field looks the same on every visit.
    let seed = 20261109;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

    const pts: Pt[] = [];
    people.forEach((_, i) => {
      pts.push({ x: (i % 2 ? 1 : -1) * (1.5 + rnd() * 0.5), z: START + i * SPACING, r: 1, phase: rnd() * 6.28, speed: 0.7 + rnd() * 0.5, named: i + 1 });
    });
    // Fewer ambient lamps on a small screen: the field still reads as a crowd,
    // and a budget phone keeps its frame rate.
    const AMBIENT = window.innerWidth < 520 ? 320 : 620;
    for (let i = 0; i < AMBIENT; i++) {
      const z = 3 + rnd() * (endZ + 46);
      const x = (rnd() - 0.5) * 54;
      if (Math.abs(x) < 3.2) continue; // keep the walked path clear
      pts.push({ x, z, r: 0.45 + rnd() * 0.5, phase: rnd() * 6.28, speed: 0.5 + rnd() * 0.8, named: 0 });
    }
    pts.sort((a, b) => b.z - a.z);

    const dim = sprite(0.5, "rgba(242,179,90,0.55)");
    const bright = sprite(0.95, "rgba(255,206,130,0.85)");

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let live = true, raf = 0, running = false;
    const io = new IntersectionObserver(([e]) => { live = e.isIntersecting; }, { rootMargin: "120px" });
    io.observe(host);

    const CAM_Y = 1.3;
    const ease = (t: number) => t * t * (3 - 2 * t);

    const frame = (ms: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!live || !w) return;

      const box = host.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 0;
      const camZ = p * endZ;
      const t = ms / 1000;

      const F = h * 0.78, cx = w / 2, cy = h * 0.46;
      ctx.fillStyle = "#070810";
      ctx.fillRect(0, 0, w, h);
      // haze sitting on the ground, so the lamps feel placed on something
      const sky = ctx.createLinearGradient(0, 0, 0, cy);
      sky.addColorStop(0, "#05060d");
      sky.addColorStop(1, "#0b0c18");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, cy);
      const ground = ctx.createLinearGradient(0, cy, 0, h);
      ground.addColorStop(0, "rgba(242,179,90,0)");
      ground.addColorStop(0.07, "rgba(242,179,90,0.10)");
      ground.addColorStop(0.22, "rgba(90,66,38,0.09)");
      ground.addColorStop(1, "rgba(5,6,13,0)");
      ctx.fillStyle = ground;
      ctx.fillRect(0, cy, w, h - cy);

      ctx.globalCompositeOperation = "lighter";
      let activeX = cx, activeY = cy, activeV = 0;
      for (const q of pts) {
        const dz = q.z - camZ;
        if (dz < 0.7 || dz > 62) continue;
        const s = F / dz;
        const sx = cx + q.x * s, sy = cy + CAM_Y * s;
        if (sx < -300 || sx > w + 300) continue;
        const flick = 0.82 + 0.18 * Math.sin(t * q.speed * 2.4 + q.phase) * Math.sin(t * q.speed * 1.1 + q.phase * 2);
        const near = dz < 2.4 ? dz / 2.4 : 1;
        const far = Math.min(1, 26 / dz);
        // the lamp you are level with swells and the rest step back, so the eye has a subject
        const focus = q.named ? Math.max(0, 1 - Math.abs(dz - 4) / 4.5) : 0;
        const a = q.r * flick * near * far * (q.named ? 1 : 0.42 - 0.18 * activeV);
        if (a <= 0.012) continue;
        const px = Math.min(h * 0.62, Math.max(5, q.r * s * 0.95) * (q.named ? 3.3 + focus * 1.6 : 2.5));
        if (focus > activeV) { activeV = focus; activeX = sx; activeY = sy; }
        ctx.globalAlpha = Math.min(1, a * (1 + focus * 0.5));
        ctx.drawImage(q.named ? bright : dim, sx - px / 2, sy - px / 2, px, px);
      }
      if (activeV > 0.02) {
        const rad = Math.max(150, w * 0.17);
        ctx.save();
        ctx.translate(activeX, activeY);
        ctx.scale(1, 2.6);
        const col = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
        col.addColorStop(0, `rgba(242,179,90,${0.16 * activeV})`);
        col.addColorStop(0.45, `rgba(242,179,90,${0.05 * activeV})`);
        col.addColorStop(1, "rgba(242,179,90,0)");
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // Each name holds the screen while its lamp is the one you are walking past.
      for (let i = 0; i < people.length; i++) {
        const el = names.current[i];
        if (!el) continue;
        const dz = START + i * SPACING - camZ;
        let v = 0;
        if (dz > 1.4 && dz < 6.8) v = dz < 3 ? ease((dz - 1.4) / 1.6) : dz > 5.4 ? ease((6.8 - dz) / 1.4) : 1;
        el.style.opacity = String(v);
        const gutter = Math.min(w * 0.04, 48);
        const lx = Math.max(0, Math.min(activeX - el.offsetWidth / 2, w - el.offsetWidth) - gutter);
        el.style.transform = `translate3d(${v ? lx : 0}px, ${(1 - v) * 16}px, 0)`;
        el.style.visibility = v < 0.01 ? "hidden" : "visible";
      }
      if (tail.current) {
        const v = p > 0.84 ? ease(Math.min(1, (p - 0.84) / 0.08)) : 0;
        tail.current.style.opacity = String(v);
      }
    };
    // The names are plain markup until the loop is actually running, so the section
    // still reads without JS, and a mid-session motion-preference change cannot strand it.
    const start = () => {
      if (running) return;
      running = true;
      host.dataset.anim = "on";
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      delete host.dataset.anim;
      for (const el of names.current) {
        if (!el) continue;
        el.style.opacity = ""; el.style.transform = ""; el.style.visibility = "";
      }
      if (tail.current) tail.current.style.opacity = "";
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (mq.matches ? stop() : start());
    mq.addEventListener("change", sync);
    sync();

    return () => { mq.removeEventListener("change", sync); cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [people]);

  return (
    <section ref={wrap} className="group/lamps relative bg-[#070810]" style={{ height: `${Math.max(300, people.length * 46 + 130)}vh` }} aria-labelledby="lamps-h">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <canvas ref={cv} className="absolute inset-0 hidden h-full w-full group-data-[anim=on]/lamps:block" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#070810] to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#070810] to-transparent" aria-hidden="true" />

        <div className="wrap relative z-10 pt-[clamp(104px,16vh,150px)]">
          <p className="kicker">{title}</p>
          <h2 id="lamps-h" className="display-m mt-2 max-w-[18ch]">{sub}</h2>
        </div>

        <div className="relative z-10 flex flex-1 items-end">
          <div className="wrap w-full pb-[clamp(40px,11vh,110px)]">
            {/* Static list first: it is the accessible record, and what shows without motion. */}
            <ul className="m-0 flex list-none flex-col gap-5 p-0 group-data-[anim=on]/lamps:gap-3">
              {people.map((p, i) => (
                <li key={p.slug} className="group-data-[anim=on]/lamps:absolute group-data-[anim=on]/lamps:bottom-[clamp(40px,11vh,110px)]">
                  <div
                    ref={(el) => { names.current[i] = el; }}
                    className="group-data-[anim=on]/lamps:[visibility:hidden] group-data-[anim=on]/lamps:opacity-0"
                  >
                    <Link href={`/${lang}/people/${p.slug}`} className="group block no-underline">
                      <p className="font-display text-[clamp(34px,7vw,76px)] leading-[1.03] text-bone group-hover:text-candle">
                        {lang === "pa" ? p.pa : p.name}
                      </p>
                      <p className="label mt-3 text-smoke">
                        {p.year} · {p.district}
                      </p>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <p ref={tail} className="relative mt-6 max-w-[42ch] text-[15px] leading-relaxed text-smoke group-data-[anim=on]/lamps:opacity-0">
              {unnamed}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
