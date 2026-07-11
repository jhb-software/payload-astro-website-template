import type { GlobalConfig } from "payload";

const navigation = (name: "navigation" | "footerNavigation") => ({
  name,
  type: "array" as const,
  fields: [
    { name: "label", type: "text" as const, localized: true, required: true },
    { name: "page", type: "relationship" as const, relationTo: "pages" as const, required: true },
  ],
});

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  access: { read: () => true },
  fields: [
    { name: "siteName", type: "text", required: true, defaultValue: "De Fryhof" },
    {
      name: "defaultSeo",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    navigation("navigation"),
    navigation("footerNavigation"),
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "email", type: "email" },
        { name: "phone", type: "text" },
        {
          name: "addressLines",
          type: "array",
          localized: true,
          fields: [{ name: "line", type: "text", required: true }],
        },
        { name: "googleMapsUrl", type: "text" },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "availabilityEmbed",
      type: "group",
      fields: [
        { name: "providerLabel", type: "text", localized: true },
        { name: "embedUrl", type: "text" },
        { name: "fallbackUrl", type: "text" },
      ],
    },
  ],
};
