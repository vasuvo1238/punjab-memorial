import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPeople, getPerson } from "@/lib/people";
import { fmtDate } from "@/lib/format";

export const runtime = "nodejs";
export const revalidate = 3600;

const font = (p: string) => readFile(path.join(process.cwd(), "node_modules", p));

/** Share preview: candle-lit card with the person's name in the memorial's display serif. `/og/home` is the site card. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [serif, serifItalic, sans] = await Promise.all([
    font("@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff"),
    font("@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff"),
    font("@fontsource/mukta-mahee/files/mukta-mahee-latin-500-normal.woff"),
  ]);
  const home = slug === "home";
  const p = home ? null : await getPerson(slug);
  const count = home ? (await getPeople()).length : 0;

  const title = home ? "They stood up so Punjab’s children could grow up free." : p ? p.name : "Punjab Anti-Drug Memorial";
  const sub = home ? `${count} people remembered` : p ? `${p.village} · ${p.district} · ${fmtDate(p.dateOfDeath, "en")}` : "";
  const line = home ? "A memorial to those killed for standing against the drug trade" : p?.stand || "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0a0c10", color: "#f3eee4", fontFamily: "Sans" }}>
        <div style={{ position: "absolute", left: -120, bottom: -260, width: 900, height: 700, borderRadius: 9999, background: "radial-gradient(circle, rgba(242,179,90,.32), rgba(242,179,90,0) 65%)", display: "flex" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#f2b35a" }}>
            <svg width="34" height="38" viewBox="0 0 18 20"><path d="M9 1c3 4.5 4.5 7 4.5 9a4.5 4.5 0 0 1-9 0c0-2 1.5-4.5 4.5-9z" fill="#ffd58f" /><path d="M1 13h16c-.6 3.6-3.9 6-8 6s-7.4-2.4-8-6z" fill="#b85a33" /></svg>
            In memory · Punjab
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontFamily: "Serif", fontSize: home ? 84 : p && p.name.length > 18 ? 104 : 124, lineHeight: 0.95, letterSpacing: -2, maxWidth: 1000, display: "flex", flexWrap: "wrap" }}>
              {title}
              {p?.nickname ? <span style={{ fontFamily: "SerifItalic", color: "#f2b35a", marginLeft: 22 }}>“{p.nickname}”</span> : null}
            </div>
            <div style={{ fontSize: 26, color: "#8d8a84", letterSpacing: 1 }}>{sub}</div>
            <div style={{ fontFamily: "SerifItalic", fontSize: 36, color: "#e9e2d4", maxWidth: 980 }}>{line}</div>
          </div>
          <div style={{ display: "flex", height: 10, width: "100%", background: "#6e1d1f", borderTop: "2px solid #f2b35a" }} />
        </div>
      </div>
    ),
    {
      width: 1200, height: 630,
      fonts: [
        { name: "Serif", data: serif, style: "normal", weight: 400 },
        { name: "SerifItalic", data: serifItalic, style: "italic", weight: 400 },
        { name: "Sans", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
