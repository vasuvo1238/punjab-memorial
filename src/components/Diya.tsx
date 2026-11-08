/** A clay diya. Unlit: a cold wick. Lit: a layered flame with a breathing halo. */
export function Diya({ lit = true, className = "h-16 w-16", id = "d" }: { lit?: boolean; className?: string; id?: string }) {
  return (
    <span className={`${lit ? "is-lit" : ""} relative inline-block ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`${id}-halo`} cx="50%" cy="42%" r="50%">
            <stop offset="0" stopColor="#ffd58f" stopOpacity=".55" />
            <stop offset=".45" stopColor="#f2b35a" stopOpacity=".18" />
            <stop offset="1" stopColor="#f2b35a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-flame`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6dc" />
            <stop offset=".35" stopColor="#ffd58f" />
            <stop offset=".75" stopColor="#f2963a" />
            <stop offset="1" stopColor="#c4521c" />
          </linearGradient>
          <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b85a33" />
            <stop offset="1" stopColor="#5e2412" />
          </linearGradient>
        </defs>
        <circle className="halo" cx="60" cy="50" r="58" fill={`url(#${id}-halo)`} style={{ opacity: lit ? 1 : 0, transition: "opacity 1.2s cubic-bezier(.16,1,.3,1)" }} />
        <g className="flame" style={{ opacity: lit ? 1 : 0, transition: "opacity .6s" }}>
          <path d="M60 22c9 14 14 22 14 30a14 14 0 0 1-28 0c0-8 5-16 14-30z" fill={`url(#${id}-flame)`} />
          <path d="M60 38c4 6 6 10 6 13a6 6 0 0 1-12 0c0-3 2-7 6-13z" fill="#fffaf0" opacity=".9" />
        </g>
        <path d="M60 60v6" stroke={lit ? "#2a1408" : "#6b6258"} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M16 70h88c-3 19-21 32-44 32S19 89 16 70z" fill={`url(#${id}-clay)`} />
        <path d="M16 70h88" stroke="#e8a35f" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <path d="M30 78q30 10 60 0" stroke="#f2b35a" strokeWidth="1.4" fill="none" opacity=".35" />
      </svg>
    </span>
  );
}
