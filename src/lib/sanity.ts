import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-01-01";
export const sanityConfigured = Boolean(projectId);

export const sanityClient = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

const builder = sanityConfigured ? imageUrlBuilder({ projectId, dataset }) : null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder!.image(source);
