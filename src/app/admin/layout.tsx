import "@fontsource/instrument-serif/400.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "../globals.css";

export const metadata = { title: "Moderation · Punjab Anti-Drug Memorial", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="on-bone min-h-screen !bg-bone !text-ink">{children}</body>
    </html>
  );
}
