import { RichText } from "@payloadcms/richtext-lexical/react";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/preview";
import { locales } from "@/lib/preview";
import { media, pagePath } from "@/lib/site";
import type { Media, Page, Room, SiteSetting } from "@/payload-types";

function relationshipPath(value: Page | number | null | undefined, locale: Locale) {
  return typeof value === "object" && value ? pagePath(value, locale) : undefined;
}

function Image({ value, className = "" }: { value?: Media | number | null; className?: string }) {
  const image = media(value);
  return image?.url ? (
    <img
      alt={image.alt || ""}
      className={className}
      height={image.height || undefined}
      loading="lazy"
      src={image.url}
      width={image.width || undefined}
    />
  ) : null;
}

function Action({ href, children }: { href?: string; children?: ReactNode }) {
  return href && children ? (
    <a className="button" href={href} rel={href.startsWith("http") ? "noreferrer" : undefined}>
      {children}
    </a>
  ) : null;
}

export function Header({ locale, site }: { locale: Locale; site: SiteSetting }) {
  return (
    <header className="site-header">
      <a className="brand" href={locale === "nl" ? "/" : `/${locale}`}>
        {site.siteName}
      </a>
      <nav aria-label="Primary navigation">
        <ul className="nav-list">
          {site.navigation?.map((item) => {
            const href = relationshipPath(item.page, locale);
            return href ? (
              <li key={item.id || `${item.label}-${href}`}>
                <a href={href}>{item.label}</a>
              </li>
            ) : null;
          })}
        </ul>
      </nav>
      <nav aria-label="Language">
        <ul className="language-list">
          {locales.map((item) => (
            <li key={item}>
              <a
                aria-current={item === locale ? "page" : undefined}
                href={item === "nl" ? "/" : `/${item}`}
              >
                {item.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Footer({ locale, site }: { locale: Locale; site: SiteSetting }) {
  const contact = site.contact;
  return (
    <footer className="site-footer">
      <div>
        <strong>{site.siteName}</strong>
        {contact?.addressLines?.map(({ id, line }) => (
          <div key={id || line}>{line}</div>
        ))}
      </div>
      <div className="footer-links">
        {contact?.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
        {contact?.phone && (
          <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
        )}
        {contact?.googleMapsUrl && <a href={contact.googleMapsUrl}>Google Maps</a>}
      </div>
      <nav aria-label="Footer navigation" className="footer-links">
        {site.footerNavigation?.map((item) => {
          const href = relationshipPath(item.page, locale);
          return href ? (
            <a href={href} key={item.id || item.label}>
              {item.label}
            </a>
          ) : null;
        })}
      </nav>
      <div className="footer-links">
        {site.socialLinks?.map((link) => (
          <a href={link.url} key={link.id || link.url} rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export function Blocks({
  locale,
  page,
  rooms,
  site,
}: {
  locale: Locale;
  page: Page;
  rooms: Room[];
  site: SiteSetting;
}) {
  const blocks = page.layout?.map((block) => {
    switch (block.blockType) {
      case "hero": {
        const href = block.primaryLink?.url || relationshipPath(block.primaryLink?.page, locale);
        return (
          <section className="hero" key={block.id}>
            <div className="hero-copy">
              {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
              <h1>{block.heading}</h1>
              {block.text && <p className="lead">{block.text}</p>}
              <Action href={href}>{block.primaryLink?.label}</Action>
            </div>
            <Image className="hero-image" value={block.image} />
          </section>
        );
      }
      case "richText":
        return (
          <section className="content prose" key={block.id}>
            <RichText data={block.content} />
          </section>
        );
      case "imageText":
        return (
          <section
            className={`image-text ${block.imagePosition === "right" ? "image-right" : ""}`}
            key={block.id}
          >
            <Image value={block.image} />
            <div className="prose">
              <h2>{block.heading}</h2>
              <RichText data={block.text} />
            </div>
          </section>
        );
      case "gallery":
        return (
          <section aria-label="Gallery" className="gallery" key={block.id}>
            {block.images.map((item) => (
              <Image key={item.id} value={item.image} />
            ))}
          </section>
        );
      case "featureGrid":
        return (
          <section className="content" key={block.id}>
            {block.heading && <h2>{block.heading}</h2>}
            <div className="feature-grid">
              {block.features.map((feature) => (
                <article key={feature.id}>
                  <Image value={feature.image} />
                  {feature.icon && (
                    <span aria-hidden="true" className="icon">
                      {feature.icon}
                    </span>
                  )}
                  <h3>{feature.title}</h3>
                  {feature.text && <p>{feature.text}</p>}
                </article>
              ))}
            </div>
          </section>
        );
      case "roomList":
        return (
          <section className="content" key={block.id}>
            {block.heading && <h2>{block.heading}</h2>}
            {block.text && <p className="lead">{block.text}</p>}
            <div className="room-grid">
              {rooms.map((room) => (
                <RoomCard basePath={pagePath(page, locale)} key={room.id} room={room} />
              ))}
            </div>
          </section>
        );
      case "cta": {
        const href = block.url || relationshipPath(block.page, locale);
        return (
          <section className="cta" key={block.id}>
            <div>
              <h2>{block.heading}</h2>
              {block.text && <p>{block.text}</p>}
            </div>
            <Action href={href}>{block.label}</Action>
          </section>
        );
      }
      case "embed":
        return (
          <section className="content" key={block.id}>
            <iframe
              allow="payment"
              loading="lazy"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
              src={block.url}
              title={block.label}
            />
          </section>
        );
    }
  });
  const availability = site.availabilityEmbed;
  return (
    <>
      {blocks}
      {page.pageType === "availability" &&
        (availability?.embedUrl || availability?.fallbackUrl) &&
        !page.layout?.some(({ blockType }) => blockType === "embed") && (
          <section className="content">
            {availability.embedUrl && (
              <iframe
                allow="payment"
                loading="lazy"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
                src={availability.embedUrl}
                title={availability.providerLabel || "Availability"}
              />
            )}
            {availability.fallbackUrl && (
              <p>
                <a href={availability.fallbackUrl}>
                  Open {availability.providerLabel || "availability"}
                </a>
              </p>
            )}
          </section>
        )}
    </>
  );
}

function RoomCard({ basePath, room }: { basePath: string; room: Room }) {
  return (
    <article className="room-card">
      <Image value={room.coverImage} />
      <div>
        <h3>
          <a href={`${basePath}/${room.slug}`}>{room.name}</a>
        </h3>
        {room.summary && <p>{room.summary}</p>}
        <p>
          {room.capacity} guests{room.bedType ? ` · ${room.bedType}` : ""}
        </p>
      </div>
    </article>
  );
}

export function RoomDetail({ room }: { room: Room }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Room {room.sortOrder}</p>
          <h1>{room.name}</h1>
          {room.summary && <p className="lead">{room.summary}</p>}
          <p>
            {room.capacity} guests{room.bedType ? ` · ${room.bedType}` : ""}
          </p>
        </div>
        <Image className="hero-image" value={room.coverImage} />
      </section>
      {room.description && (
        <section className="content prose">
          <RichText data={room.description} />
        </section>
      )}
      {!!room.features?.length && (
        <section className="content">
          <ul className="features">
            {room.features.map((feature) => (
              <li key={feature.id || feature.item}>{feature.item}</li>
            ))}
          </ul>
        </section>
      )}
      {!!room.gallery?.length && (
        <section aria-label="Room gallery" className="gallery">
          {room.gallery.map((item) => (
            <Image key={item.id} value={item.image} />
          ))}
        </section>
      )}
    </main>
  );
}
