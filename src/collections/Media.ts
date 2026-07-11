import path from "node:path";

import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [{ name: "alt", type: "text", localized: true }],
  upload: {
    staticDir: path.resolve(process.cwd(), "public/media"),
    imageSizes: [
      { name: "thumb", width: 320 },
      { name: "og", width: 1200, height: 630, crop: "center" },
    ],
  },
};
