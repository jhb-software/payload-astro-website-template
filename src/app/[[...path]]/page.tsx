import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Blocks, Footer, Header, RoomDetail } from "@/components/Site";
import { parsePath } from "@/lib/preview";
import { findPage, findRoom, getRooms, getSite, media } from "@/lib/site";

type Props = { params: Promise<{ path?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments } = parsePath((await params).path);
  const page = await findPage(locale, segments[0]);
  const room = segments[1] ? await findRoom(locale, segments[1]) : undefined;
  const site = await getSite(locale);
  const image = media(room?.coverImage) || media(page?.seo?.image) || media(site.defaultSeo?.image);
  return {
    title: room?.name || page?.seo?.title || page?.title || site.defaultSeo?.title || site.siteName,
    description: room?.summary || page?.seo?.description || site.defaultSeo?.description,
    openGraph: image?.sizes?.og?.url ? { images: [{ url: image.sizes.og.url }] } : undefined,
  };
}

export default async function PublicPage({ params }: Props) {
  const { locale, segments } = parsePath((await params).path);
  if (segments.length > 2) notFound();

  const page = await findPage(locale, segments[0]);
  if (!page) notFound();

  const [site, rooms] = await Promise.all([getSite(locale), getRooms(locale)]);
  const room =
    segments[1] && page.pageType === "rooms" ? await findRoom(locale, segments[1]) : undefined;
  if (segments[1] && !room) notFound();

  return (
    <>
      <Header locale={locale} site={site} />
      {room ? (
        <RoomDetail room={room} />
      ) : (
        <main>
          <Blocks locale={locale} page={page} rooms={rooms} site={site} />
        </main>
      )}
      <Footer locale={locale} site={site} />
    </>
  );
}
