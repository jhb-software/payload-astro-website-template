export type Locale = "nl" | "en" | "de";

export const locales: Locale[] = ["nl", "en", "de"];

export function parsePath(path: string[] = []): { locale: Locale; segments: string[] } {
  const locale = locales.includes(path[0] as Locale) ? (path[0] as Locale) : "nl";
  return { locale, segments: locale === "nl" && path[0] !== "nl" ? path : path.slice(1) };
}

export function previewURL(collection: "pages" | "rooms", slug: string, locale?: unknown) {
  const code =
    typeof locale === "string" ? locale : (locale as { code?: string } | undefined)?.code;
  const query = new URLSearchParams({
    collection,
    locale: locales.includes(code as Locale) ? code! : "nl",
    secret: process.env.PREVIEW_SECRET || "dev-preview-secret",
    slug: slug || "",
  });
  return `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/api/preview?${query}`;
}
