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

/**
 * Enforcement in Punjab, two five-year windows compared.
 * Punjab Police figures quoted by DGP Gaurav Yadav, reported by The Tribune, 24 Apr 2026.
 * The later window runs from 2022 to the date of that report.
 */
export const ENFORCEMENT: { label: string; earlier: number; later: number; unit?: "kg" }[] = [
  { label: "NDPS cases", earlier: 52255, later: 73541 },
  { label: "Arrests", earlier: 68064, later: 98596 },
  { label: "Heroin seized", earlier: 2412, later: 5979, unit: "kg" },
];

/** The state's Yudh Nashian Virudh drive, running since 1 March 2025. Figures reported 1 Nov 2026. */
export const CAMPAIGN: [string, string][] = [["90,091", "people arrested"], ["69,101", "FIRs registered"], ["4,464 kg", "heroin recovered"]];

/**
 * Attacks on people doing anti-drug work that the person survived. Kept separate from the memorial itself:
 * these are living people, so each entry carries only what national media has already reported.
 */
export const ATTACKS: { date: string; place: string; what: string; source: string; url: string }[] = [
  {
    date: "2026-11-07",
    place: "Kaleke, Barnala",
    what: "Amandeep Singh, 27, a village anti-drug committee member, was shot in the thigh at his home. Police say he is stable and that four local people have been identified.",
    source: "ETV Bharat, 8 Nov 2026",
    url: "https://www.etvbharat.com/en/state/punjab-village-anti-drug-committee-member-shot-in-barnala-injured-enn26110801296",
  },
  {
    date: "2019-12-19",
    place: "Ghagga, Sri Muktsar Sahib",
    what: "Two anti-drug committee members were attacked and hospitalised. The Tribune counted three more attacks on committees in the same district that year, at Ghagga, Shamkhera and Kotli Ablu.",
    source: "The Tribune, 21 Dec 2019",
    url: "https://www.tribuneindia.com/news/punjab/no-let-up-in-attacks-on-anti-drug-panels-14857",
  },
];
