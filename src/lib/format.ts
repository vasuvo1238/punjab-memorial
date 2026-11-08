import { DISTRICTS } from "./districts";
import type { Lang } from "./i18n";
import type { Person } from "./types";

export const pName = (p: Person, l: Lang) => (l === "pa" && p.namePa ? p.namePa : p.name);
export const pVillage = (p: Person, l: Lang) => (l === "pa" && p.villagePa ? p.villagePa : p.village);
export const pDistrict = (d: string, l: Lang) => (l === "pa" && DISTRICTS[d] ? DISTRICTS[d].pa : d);
export const pStand = (p: Person, l: Lang) => (l === "pa" && p.standPa ? p.standPa : p.stand);
export const year = (p: Person) => p.dateOfDeath.slice(0, 4);
export const fmtDate = (d: string, l: Lang, month: "long" | "short" = "long") =>
  new Date(d + "T00:00:00").toLocaleDateString(l === "pa" ? "pa-IN" : "en-IN", { day: "numeric", month, year: "numeric" });

export const SITE_NAME = "Punjab Anti-Drug Memorial";
export const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

/** Heroin seized in Punjab, kg. Punjab Police data reported by The Tribune, 17 Sep 2023. 2023 is up to 15 September. */
export const SEIZURES: [string, number][] = [["2002", 2.32], ["2007", 134.93], ["2012", 301.39], ["2020", 759.82], ["2022", 593.68], ["2023*", 950]];
