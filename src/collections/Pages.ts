import type { CollectionConfig } from "payload";

import { pageBlocks } from "@/blocks";
import { previewURL } from "@/lib/preview";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: { read: () => true },
  admin: {
    defaultColumns: ["title", "pageType", "slug", "_status"],
    livePreview: { url: ({ data, locale }) => previewURL("pages", data.slug as string, locale) },
    preview: (data, { locale }) => previewURL("pages", data.slug as string, locale),
    useAsTitle: "title",
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", localized: true, required: true, index: true },
    {
      name: "pageType",
      type: "select",
      required: true,
      unique: true,
      options: [
        "home",
        "accommodation",
        "rooms",
        "business",
        "surroundings",
        "availability",
        "aboutContact",
        "privacy",
      ],
    },
    { name: "layout", type: "blocks", blocks: pageBlocks, localized: true },
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
