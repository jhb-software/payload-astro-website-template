import type { Block, CollectionConfig } from "payload";

const hero: Block = {
  slug: "hero",
  fields: [
    { name: "eyebrow", type: "text", localized: true },
    { name: "heading", type: "text", localized: true, required: true },
    { name: "text", type: "textarea", localized: true },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};

const richText: Block = {
  slug: "richText",
  fields: [{ name: "content", type: "richText", localized: true, required: true }],
};

const gallery: Block = {
  slug: "gallery",
  fields: [
    {
      name: "images",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
  ],
};

const embed: Block = {
  slug: "embed",
  fields: [
    { name: "label", type: "text", localized: true },
    { name: "url", type: "text", required: true },
  ],
};

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", localized: true, required: true, index: true },
    {
      name: "layout",
      type: "blocks",
      blocks: [hero, richText, gallery, embed],
      localized: true,
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
