export type Role = "activist" | "panchayat" | "police" | "citizen" | "family" | "whistleblower";
export type Status = "reported" | "disputed";

/** An image either from Sanity (url already resolved) or absent (placeholder is drawn). */
export type Img = { url: string; alt?: string; caption?: string; credit?: string; width?: number; height?: number };

export type Video = { title: string; url?: string; fileUrl?: string };

export type Person = {
  slug: string;
  name: string;
  namePa?: string;
  nickname?: string | null;
  age?: number | null;
  dateOfDeath: string; // YYYY-MM-DD
  village: string;
  villagePa?: string;
  district: string;
  role: Role;
  status: Status;
  stand: string;
  standPa?: string;
  story: string;
  storyPa?: string | null;
  disputedNote?: string | null;
  portrait?: Img | null;
  gallery: Img[];
  videos: Video[];
  familyQuotes: { quote: string; quotePa?: string; by?: string }[];
  sources: { title: string; url: string }[];
};

export type SiteSettings = {
  heroVideoUrl?: string | null;
  heroPosterUrl?: string | null;
  documentaryUrl?: string | null; // a hosted file or a YouTube link
};
