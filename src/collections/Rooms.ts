import type { CollectionConfig } from "payload";

import { previewURL } from "@/lib/preview";

export const Rooms: CollectionConfig = {
  slug: "rooms",
  access: { read: () => true },
  admin: {
    defaultColumns: ["name", "capacity", "sortOrder", "_status"],
    useAsTitle: "name",
    preview: (data, { locale }) => previewURL("rooms", data.slug as string, locale),
    livePreview: { url: ({ data, locale }) => previewURL("rooms", data.slug as string, locale) },
  },
  defaultSort: "sortOrder",
  versions: { drafts: true },
  fields: [
    { name: "name", type: "text", localized: true, required: true },
    { name: "slug", type: "text", localized: true, required: true, index: true },
    { name: "summary", type: "textarea", localized: true },
    { name: "description", type: "richText", localized: true },
    { name: "capacity", type: "number", min: 1, required: true },
    { name: "bedType", type: "text", localized: true },
    {
      name: "features",
      type: "array",
      localized: true,
      fields: [{ name: "item", type: "text", required: true }],
    },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "gallery",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
    { name: "sortOrder", type: "number", min: 1, required: true, index: true },
  ],
};
