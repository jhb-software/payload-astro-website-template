import type { Block, Field } from "payload";

const linkFields = (required = false): Field[] => [
  { name: "label", type: "text", localized: true, required },
  { name: "page", type: "relationship", relationTo: "pages" },
  {
    name: "url",
    type: "text",
    validate: (value: unknown) =>
      !value || (typeof value === "string" && /^(https?:\/\/|mailto:|tel:|\/)/.test(value))
        ? true
        : "Use an absolute URL or a path beginning with /.",
  },
];

export const hero: Block = {
  slug: "hero",
  fields: [
    { name: "eyebrow", type: "text", localized: true },
    { name: "heading", type: "text", localized: true, required: true },
    { name: "text", type: "textarea", localized: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "primaryLink", type: "group", fields: linkFields() },
  ],
};

export const richText: Block = {
  slug: "richText",
  fields: [{ name: "content", type: "richText", localized: true, required: true }],
};

export const imageText: Block = {
  slug: "imageText",
  fields: [
    { name: "heading", type: "text", localized: true, required: true },
    { name: "text", type: "richText", localized: true, required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "imagePosition",
      type: "select",
      defaultValue: "left",
      options: ["left", "right"],
      required: true,
    },
  ],
};

export const gallery: Block = {
  slug: "gallery",
  fields: [
    {
      name: "images",
      type: "array",
      minRows: 1,
      required: true,
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
  ],
};

export const featureGrid: Block = {
  slug: "featureGrid",
  fields: [
    { name: "heading", type: "text", localized: true },
    {
      name: "features",
      type: "array",
      minRows: 1,
      required: true,
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        { name: "text", type: "textarea", localized: true },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "icon", type: "text", localized: true },
      ],
    },
  ],
};

export const roomList: Block = {
  slug: "roomList",
  fields: [
    { name: "heading", type: "text", localized: true },
    { name: "text", type: "textarea", localized: true },
  ],
};

export const cta: Block = {
  slug: "cta",
  fields: [
    { name: "heading", type: "text", localized: true, required: true },
    { name: "text", type: "textarea", localized: true },
    ...linkFields(true),
  ],
};

export const embed: Block = {
  slug: "embed",
  fields: [
    { name: "label", type: "text", localized: true, required: true },
    {
      name: "url",
      type: "text",
      required: true,
      validate: (value: unknown) =>
        typeof value === "string" && value.startsWith("https://")
          ? true
          : "Use a secure https:// URL.",
    },
  ],
};

export const pageBlocks = [hero, richText, imageText, gallery, featureGrid, roomList, cta, embed];
