"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { person } from "./src/sanity/schemas/person";
import { siteSettings } from "./src/sanity/schemas/siteSettings";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "replace-me";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "punjab-memorial",
  title: "Punjab Anti-Drug Memorial",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: [person, siteSettings] },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title("Memorial").items([
          S.listItem().title("Site settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
          S.divider(),
          S.documentTypeListItem("person").title("People remembered"),
        ]),
    }),
    visionTool(),
  ],
});
