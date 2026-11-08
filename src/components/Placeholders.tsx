/* Drawn placeholder art, always labelled, so nothing on the site is mistaken for a real photo of a real person. */

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function PortraitPlaceholder({ seed, initials, label }: { seed: string; initials: string; label: string }) {
  const h = hash(seed);
  const hue = [210, 220, 200, 230][h % 4];
  return (
    <svg viewBox="0 0 400 500" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <radialGradient id={`pg${h}`} cx="50%" cy="78%" r="70%">
          <stop offset="0" stopColor="#e8a33d" stopOpacity=".5" />
          <stop offset=".55" stopColor={`hsl(${hue},40%,22%)`} />
          <stop offset="1" stopColor="#121c30" />
        </radialGradient>
        <pattern id={`pp${h}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M13 3l10 10-10 10L3 13z" fill="none" stroke="#e8a33d" strokeOpacity=".12" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill={`url(#pg${h})`} />
      <rect width="400" height="500" fill={`url(#pp${h})`} />
      <circle cx="200" cy="200" r="74" fill="#0d1526" fillOpacity=".55" />
      <path d="M76 500c8-110 62-170 124-170s116 60 124 170z" fill="#0d1526" fillOpacity=".55" />
      <text x="200" y="222" textAnchor="middle" fontFamily="Georgia, serif" fontSize="64" fill="#f6d39a" fillOpacity=".9">{initials}</text>
    </svg>
  );
}

export const SCENE_CAPTIONS = ["Wheat fields at dawn", "A village lane", "Diyas lit in remembrance", "A candle march"];

export function ScenePlaceholder({ index, label }: { index: number; label: string }) {
  const k = index % 4;
  const id = `sky${index}`;
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2943" /><stop offset=".6" stopColor="#b8724a" /><stop offset="1" stopColor="#f3c784" />
        </linearGradient>
      </defs>
      {k === 2 ? <rect width="400" height="300" fill="#121c30" /> : <rect width="400" height="300" fill={`url(#${id})`} />}
      {k === 0 && (
        <>
          <circle cx="290" cy="170" r="34" fill="#f6c46e" fillOpacity=".9" />
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M0 ${185 + i * 18} Q 100 ${175 + i * 18} 200 ${185 + i * 18} T 400 ${185 + i * 18} V300 H0z`} fill={`hsl(${38 - i * 3},${55 - i * 4}%,${42 - i * 4}%)`} />
          ))}
        </>
      )}
      {k === 1 && (
        <>
          <path d="M0 300 L170 160 L230 160 L400 300z" fill="#6b5137" />
          <rect x="20" y="120" width="120" height="120" fill="#8a6a4b" /><rect x="270" y="110" width="120" height="130" fill="#7d5f43" />
          <rect x="60" y="170" width="26" height="40" fill="#2b2117" /><rect x="310" y="160" width="26" height="40" fill="#2b2117" />
          <circle cx="200" cy="120" r="22" fill="#f6c46e" fillOpacity=".8" />
        </>
      )}
      {k === 2 &&
        [80, 160, 240, 320].map((x) => (
          <g key={x}>
            <circle cx={x} cy="180" r="46" fill="#e8a33d" fillOpacity=".14" />
            <path d={`M${x} 142c8 12 11 18 11 24a11 11 0 0 1-22 0c0-6 3-12 11-24z`} fill="#f6c46e" />
            <path d={`M${x - 30} 190h60c-3 18-15 28-30 28s-27-10-30-28z`} fill="#c4553f" />
          </g>
        ))}
      {k === 3 &&
        Array.from({ length: 14 }, (_, i) => {
          const x = 20 + i * 27, y = 190 + (i % 3) * 10;
          return (
            <g key={i}>
              <circle cx={x} cy={y - 34} r="11" fill="#1a2438" />
              <path d={`M${x - 14} 300 v-70 a14 14 0 0 1 28 0 v70z`} fill="#1a2438" />
              <circle cx={x + 9} cy={y - 16} r="4" fill="#f6c46e" />
            </g>
          );
        })}
    </svg>
  );
}

export const initialsOf = (name: string) =>
  name.replace(/^(Lambardar|Sarpanch|ASI) /, "").split(" ").map((w) => w[0]).join("").slice(0, 2);
