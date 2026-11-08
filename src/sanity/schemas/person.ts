import { defineArrayMember, defineField, defineType } from "sanity";
import { DISTRICT_NAMES } from "../../lib/districts";

const imageWithCredit = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({ name: "alt", title: "Alt text (describe the photo for screen readers)", type: "string", validation: (r) => r.required() }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
      defineField({ name: "credit", title: "Credit / source", type: "string", description: "e.g. Courtesy of the family, or the newspaper and photographer" }),
      defineField({ name: "consent", title: "Family has consented to publishing this photo", type: "boolean", initialValue: false, validation: (r) => r.custom((v) => (v ? true : "Confirm consent before publishing")) }),
    ],
  });

export const person = defineType({
  name: "person",
  title: "Person remembered",
  type: "document",
  groups: [
    { name: "who", title: "Who", default: true },
    { name: "story", title: "Story" },
    { name: "media", title: "Photos & video" },
    { name: "sources", title: "Sources" },
  ],
  fields: [
    defineField({ name: "name", title: "Name (English)", type: "string", group: "who", validation: (r) => r.required() }),
    defineField({ name: "namePa", title: "Name (ਪੰਜਾਬੀ)", type: "string", group: "who" }),
    defineField({ name: "slug", title: "Link name", type: "slug", group: "who", options: { source: "name", maxLength: 80 }, validation: (r) => r.required() }),
    defineField({ name: "nickname", type: "string", group: "who" }),
    defineField({ name: "age", type: "number", group: "who" }),
    defineField({ name: "dateOfDeath", title: "Date of death", type: "date", group: "who", validation: (r) => r.required() }),
    defineField({ name: "village", title: "Village or town (English)", type: "string", group: "who", validation: (r) => r.required() }),
    defineField({ name: "villagePa", title: "Village or town (ਪੰਜਾਬੀ)", type: "string", group: "who" }),
    defineField({ name: "district", type: "string", group: "who", options: { list: DISTRICT_NAMES }, validation: (r) => r.required() }),
    defineField({
      name: "role", type: "string", group: "who", initialValue: "citizen",
      options: { list: [
        { title: "Activist", value: "activist" }, { title: "Village leader", value: "panchayat" }, { title: "Police officer", value: "police" },
        { title: "Citizen", value: "citizen" }, { title: "Family member", value: "family" }, { title: "Whistleblower", value: "whistleblower" },
      ] },
    }),
    defineField({
      name: "status", type: "string", group: "who", initialValue: "reported",
      description: "Disputed: police have given a different motive. Both accounts must be stated.",
      options: { list: [{ title: "Reported", value: "reported" }, { title: "Disputed", value: "disputed" }], layout: "radio" },
    }),
    defineField({ name: "stand", title: "Their stand, one line (English)", type: "string", group: "story", validation: (r) => r.required().max(160) }),
    defineField({ name: "standPa", title: "Their stand, one line (ਪੰਜਾਬੀ)", type: "string", group: "story" }),
    defineField({ name: "story", title: "Life story (English)", type: "text", rows: 8, group: "story", validation: (r) => r.required() }),
    defineField({ name: "storyPa", title: "Life story (ਪੰਜਾਬੀ)", type: "text", rows: 8, group: "story" }),
    defineField({ name: "disputedNote", title: "Other account (for disputed cases)", type: "text", rows: 3, group: "story" }),
    defineField({
      name: "familyQuotes", title: "Words from the family (only with consent)", type: "array", group: "story",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "quote", type: "text", rows: 3 }), defineField({ name: "quotePa", title: "Quote (ਪੰਜਾਬੀ)", type: "text", rows: 3 }), defineField({ name: "by", title: "Who said it", type: "string" }),
      ] })],
    }),
    { ...imageWithCredit("portrait", "Portrait"), group: "media" },
    defineField({ name: "gallery", type: "array", group: "media", of: [defineArrayMember({ ...imageWithCredit("photo", "Photo") })] }),
    defineField({
      name: "videos", title: "Video and news clips", type: "array", group: "media",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "url", title: "YouTube or news link", type: "url" }),
        defineField({ name: "file", title: "Or upload a video file", type: "file", options: { accept: "video/*" } }),
      ] })],
    }),
    defineField({
      name: "sources", type: "array", group: "sources", validation: (r) => r.required().min(1),
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "url", type: "url", validation: (r) => r.required() }),
      ] })],
    }),
  ],
  orderings: [{ title: "Date of death, newest", name: "dateDesc", by: [{ field: "dateOfDeath", direction: "desc" }] }],
  preview: { select: { title: "name", subtitle: "district", media: "portrait" } },
});
