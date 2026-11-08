import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "heroVideo", title: "Home page background video", type: "file", options: { accept: "video/mp4,video/webm" }, description: "Slow and silent, 10 to 20 seconds, under 8 MB. Fields at dawn, a lit diya or a village lane." }),
    defineField({ name: "heroPoster", title: "Still image shown while the video loads", type: "image" }),
    defineField({ name: "documentaryFile", title: "Documentary film (upload)", type: "file", options: { accept: "video/*" } }),
    defineField({ name: "documentaryLink", title: "Or documentary YouTube link", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
