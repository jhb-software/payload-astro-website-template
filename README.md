# Payload & Astro Website Template

This is a minimal, somewhat opinionated template for building websites with [Payload CMS](https://payloadcms.com/) and [Astro](https://astro.build/).

This template is for a multi-language website and includes SEO Metadata, Path, Breadcrumbs and Alternate Paths Generation, Redirects, Media Hosting, Live Preview, Plausible Analytics, Robots.txt, Automatic Sitemap Generation, Redirects.

> [!NOTE]
> This template is an early draft and is still under active development. Features may change, and some functionality may not be fully stable. I am happy to receive feedback and suggestions for improvements.

## CMS Features

The CMS is configured to contain all basic features you need for a website.

### SEO Plugin

The [official SEO plugin](https://www.npmjs.com/package/@payloadcms/plugin-seo) is used to add metadata fields to all pages, including title, description, and social media metadata.

### Path/Breadcrumbs and Alternate Paths Generation

The [Payload pages plugin](https://www.npmjs.com/package/@jhb.software/payload-pages-plugin) is used to automatically generate paths, breadcrumbs, and alternate language paths for all pages. Documents from multiple collections can be nested to create hierarchical page structures.

### Redirects Collection

A dedicated collection for managing redirects, allowing you to handle old paths and maintain SEO when restructuring your site.

### Redeploy Website Button

The Astro website is fully static, so the CMS includes a convenient redeploy button that allows content editors to trigger a fresh build of the website with updated CMS data with a single click.

### Live Preview

Real-time preview functionality allows content editors to see changes before publishing, improving the content creation workflow.

## Website Features

### SEO

Comprehensive SEO optimization including meta tags, Open Graph tags, Twitter Cards, and canonical URLs.

### Structured Data (Schema.org)

Automatic generation of JSON-LD structured data to help search engines understand your content better.

### Plausible Analytics

Privacy-friendly analytics integration with Plausible for tracking website performance without compromising user privacy.

### Automatic Sitemap Generation

Dynamic sitemap generation that updates automatically as you add or modify content, helping search engines discover your pages.

### Robots.txt

Automatically generated robots.txt file to control search engine crawling behavior.

### Redirects via Vercel Adapter

Server-side redirects handled through the Vercel adapter for fast, SEO-friendly URL redirections.

### Alternate Paths Generation

Automatic generation of alternate language paths for multi-language support, ensuring proper hreflang implementation for international SEO.
