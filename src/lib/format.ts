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
    date: "2026-10-15",
    place: "Mari Pannuan, Gurdaspur",
    what: "Nishan Singh and Gurmukh Singh were attacked with sharp weapons alongside Bikramjit Singh and survived. They were treated at the Bham community health centre.",
    source: "The Tribune, 17 Oct 2026",
    url: "https://www.tribuneindia.com/news/punjab/anti-drug-activist-murdered-in-batala/",
  },
  {
    date: "2025-06-03",
    place: "Bhai Bakhtaur, Bathinda",
    what: "Ranveer Singh, a former Army man on the village anti-drug committee, was beaten until both his legs were broken. His village answered by putting up a poster offering the whole village for sale.",
    source: "The Tribune, 3 Jun 2025",
    url: "https://www.tribuneindia.com/news/punjab/village-for-sale-residents-put-up-poster-in-protest-against-drug-trade",
  },
  {
    date: "2025-02-25",
    place: "Narangwal Kalan, Ludhiana",
    what: "Manjinder Singh, sarpanch and head of the village Nasha Virodhi Committee, was threatened by name after handing the police recordings of threat calls. No case was registered against those he named.",
    source: "The Tribune, 26 Feb 2025",
    url: "https://www.tribuneindia.com/news/punjab/narangwal-kalan-residents-support-village-sarpanch-after-threat-from-drug-traders",
  },
  {
    date: "2019-12-19",
    place: "Ghagga, Sri Muktsar Sahib",
    what: "Two anti-drug committee members were attacked and hospitalised. The Tribune counted three more attacks on committees in the same district that year, at Ghagga, Shamkhera and Kotli Ablu.",
    source: "The Tribune, 21 Dec 2019",
    url: "https://www.tribuneindia.com/news/punjab/no-let-up-in-attacks-on-anti-drug-panels-14857",
  },
];

/** Attacks whose target survived and whose village answered publicly. Hope belongs on this page too. */
export const STOOD_UP: { place: string; what: string; source: string; url: string }[] = [
  {
    place: "Narangwal Kalan, Ludhiana",
    what: "When their sarpanch was threatened for stopping drugs at the village edge, residents met across party lines and said publicly that they stood with him, and that they would take the fight to its end.",
    source: "The Tribune, 26 Feb 2025",
    url: "https://www.tribuneindia.com/news/punjab/narangwal-kalan-residents-support-village-sarpanch-after-threat-from-drug-traders",
  },
  {
    place: "Bhai Bakhtaur, Bathinda",
    what: "After a committee member's legs were broken, the village hung a hand-painted poster declaring itself for sale, rather than live beside the trade in silence.",
    source: "The Tribune, 3 Jun 2025",
    url: "https://www.tribuneindia.com/news/punjab/village-for-sale-residents-put-up-poster-in-protest-against-drug-trade",
  },
  {
    place: "Attari, Amritsar",
    what: "Harpreet Singh, sarpanch of a village on the border itself, named the people he says bring heroin across and sell it, on camera, after surviving a third attempt on his life.",
    source: "The Tribune",
    url: "https://www.tribuneindia.com/news/top-headlines/attari-sarpanch-fighting-cross-border-drug-mafia-alleges-third-attempt-on-life/",
  },
  {
    place: "Dhilwan Khurd, Faridkot",
    what: "The Nasha Roko Committee that Harbhagwan Singh died for is still standing, and his photograph hangs where it meets.",
    source: "The Tribune",
    url: "https://www.tribuneindia.com/news/punjab/standing-up-against-drugs-in-punjab-545079",
  },
];

/** Deaths this memorial deliberately leaves off the wall, and why. Named so the choice can be checked. */
export const EXCLUDED: { who: string; what: string }[] = [
  {
    who: "Three sarpanches killed in Tarn Taran and Moga, 2026",
    what: "Jarmal Singh, Harbinder Singh and Harwinder Singh Happy were killed within ten weeks of each other. Reporting attributes these to extortion, a gang claim and a personal dispute, not to the drug trade.",
  },
  {
    who: "Six police ASIs shot in the border districts, 2026",
    what: "Four of them died. Police attribute the shootings to handlers abroad, a gangster network and one inter-gang rivalry. None of the reporting establishes a narcotics link.",
  },
  {
    who: "Bystanders killed by peddlers' bullets and vehicles",
    what: "People such as Gurjit Singh of Rasulpur, killed by a fleeing peddler's shot in June 2025, were not opposing anyone. They are the drug trade's dead, but this wall is for those who stood up to it.",
  },
];
