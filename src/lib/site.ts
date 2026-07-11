import { draftMode } from "next/headers";
import { getPayload } from "payload";

import config from "@payload-config";
import type { Locale } from "@/lib/preview";
import type { Media, Page, Room, SiteSetting } from "@/payload-types";

export function pagePath(page: Page, locale: Locale) {
  const prefix = locale === "nl" ? "" : `/${locale}`;
  return page.pageType === "home" ? prefix || "/" : `${prefix}/${page.slug}`;
}

export function media(value: Media | number | null | undefined): Media | undefined {
  return typeof value === "object" && value ? value : undefined;
}

export async function getSite(locale: Locale): Promise<SiteSetting> {
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug: "siteSettings", locale, depth: 2 });
}

export async function findPage(locale: Locale, slug?: string): Promise<Page | undefined> {
  const payload = await getPayload({ config });
  const { isEnabled } = await draftMode();
  const { docs } = await payload.find({
    collection: "pages",
    locale,
    depth: 2,
    draft: isEnabled,
    limit: 1,
    where: slug ? { slug: { equals: slug } } : { pageType: { equals: "home" } },
  });
  return docs[0];
}

export async function findRoom(locale: Locale, slug: string): Promise<Room | undefined> {
  const payload = await getPayload({ config });
  const { isEnabled } = await draftMode();
  const { docs } = await payload.find({
    collection: "rooms",
    locale,
    depth: 2,
    draft: isEnabled,
    limit: 1,
    where: { slug: { equals: slug } },
  });
  return docs[0];
}

export async function getRooms(locale: Locale): Promise<Room[]> {
  const payload = await getPayload({ config });
  const { isEnabled } = await draftMode();
  const { docs } = await payload.find({
    collection: "rooms",
    locale,
    depth: 1,
    draft: isEnabled,
    limit: 20,
    sort: "sortOrder",
  });
  return docs;
}
