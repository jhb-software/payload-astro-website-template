import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import config from "@payload-config";

import type { Locale } from "@/lib/preview";
import { locales } from "@/lib/preview";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const collection = params.get("collection");
  const locale = params.get("locale") as Locale;
  const slug = params.get("slug");
  if (
    params.get("secret") !== (process.env.PREVIEW_SECRET || "dev-preview-secret") ||
    !slug ||
    !locales.includes(locale) ||
    (collection !== "pages" && collection !== "rooms")
  ) {
    return new Response("Invalid preview request", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  const prefix = locale === "nl" ? "" : `/${locale}`;
  if (collection === "rooms") {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "pages",
      locale,
      limit: 1,
      where: { pageType: { equals: "rooms" } },
    });
    if (!docs[0]) return new Response("Rooms page not found", { status: 404 });
    redirect(`${prefix}/${docs[0].slug}/${slug}`);
  }
  const path = `${prefix}/${slug === "home" ? "" : slug}`;
  redirect(path);
}
