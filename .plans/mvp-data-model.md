# MVP Data Model

Build a new Fryhof site, not a WordPress clone. The CMS should cover the first public version with a small model that editors can understand.

## Site Shape

Primary pages:

- Home
- Accommodation
- Rooms
- Business meetings
- Surroundings
- Availability
- About / Contact
- Privacy

Keep accommodation features as page sections, not separate records:

- Living room and kitchen
- Pool
- Hottub, sauna and gym
- Cinema
- Firepit and BBQ
- Parking, wifi, sustainability and extras

## Collections

### Pages

Use for fixed marketing pages.

Fields:

- `title`: localized text, required
- `slug`: localized text, required, indexed
- `pageType`: select for `home`, `accommodation`, `rooms`, `business`, `surroundings`, `availability`, `aboutContact`, `privacy`
- `layout`: localized blocks
- `seo`: title, description, image

### Rooms

Use for the 7 guest rooms. Rooms get real URLs because the existing site has repeated detail pages with consistent structure.

Fields:

- `name`: localized text, required
- `slug`: localized text, required, indexed
- `summary`: localized textarea
- `description`: localized rich text
- `capacity`: number
- `bedType`: localized text
- `features`: localized list of short text items
- `coverImage`: media upload
- `gallery`: media upload list
- `sortOrder`: number

Skip pricing in MVP. Add one `priceNote` later only if prices must be public.

### Media

Use Payload uploads.

Fields:

- `alt`: localized text

Image sizes:

- `thumb`: 320px
- `og`: 1200x630

### Site Settings

Use one Payload global.

Fields:

- `siteName`
- `defaultSeo`: title, description, image
- `navigation`: label and page relationship
- `footerNavigation`: label and page relationship
- `contact`: email, phone, address lines, Google Maps URL
- `socialLinks`: label and URL
- `availabilityEmbed`: provider label, embed URL, fallback URL

## Blocks

Keep the block list short.

- `hero`: eyebrow, heading, text, image, primary link
- `richText`: content
- `imageText`: heading, text, image, image position
- `gallery`: image list
- `featureGrid`: repeated title/text/image or icon
- `roomList`: optional heading/text, frontend pulls rooms by `sortOrder`
- `cta`: heading, text, link label, page or URL
- `embed`: label and URL, used for booking/availability widget

## Localization

Locales:

- `nl` default
- `en`
- `de`

Localize editor-facing content:

- page titles and slugs
- page blocks
- SEO text
- room names, summaries, descriptions and features
- media alt text
- navigation labels

Do not localize:

- image files
- capacity
- sort order
- booking embed URL unless the provider needs locale-specific URLs

## MVP Skips

Do not model these yet:

- booking engine
- availability data
- forms
- testimonials
- blog/news
- popups
- attractions collection
- amenities taxonomy
- reusable section library
- redirect manager
- pricing tables
- WordPress page tree

## Build Order

1. Add `rooms`.
2. Add `siteSettings` global.
3. Extend `pages` with `pageType` and the missing blocks.
4. Seed the fixed pages and 7 rooms manually.
5. Build frontend rendering for pages and room detail pages.
6. Add preview/live preview after the first editable page works.
