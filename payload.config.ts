import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "@/collections/Media";
import { Pages } from "@/collections/Pages";
import { Rooms } from "@/collections/Rooms";
import { Users } from "@/collections/Users";
import { SiteSettings } from "@/globals/SiteSettings";

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(root, "src");

export default buildConfig({
  admin: {
    importMap: {
      baseDir: src,
      importMapFile: path.resolve(src, "app/(payload)/admin/importMap.js"),
    },
    user: Users.slug,
  },
  collections: [Pages, Rooms, Media, Users],
  globals: [SiteSettings],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./payload.db",
    },
  }),
  editor: lexicalEditor(),
  localization: {
    defaultLocale: "nl",
    fallback: true,
    locales: ["nl", "en", "de"],
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  secret: process.env.PAYLOAD_SECRET || "dev-secret",
  sharp,
  typescript: {
    outputFile: path.resolve(src, "payload-types.ts"),
  },
});
