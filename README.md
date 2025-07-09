# Payload & Astro Website Template

This is a fully featured template for building performant and scalable content-driven websites with [Payload CMS](https://payloadcms.com/) and [Astro](https://astro.build/).

This template is built for multi-language websites and includes SEO metadata, path generation, breadcrumbs, alternate language paths, redirects, media hosting, live preview, Plausible Analytics, robots.txt, and automatic sitemap generation.

> [!NOTE]
> This template is still under active development. Features may change, and some functionality may not be fully stable or documented. I welcome feedback and suggestions for improvements.

## Getting Started

### Local Development Setup

Follow these steps to set up the project for local development:

1. Clone the repository:

   ```bash
   git clone https://github.com/jhb-software/payload-astro-template.git
   ```

2. Open two terminals in a split view. One for the Astro website and one for the Payload CMS.

3. In both terminals install the dependencies using `pnpm i`.

4. Create a `.env` file in both the `cms` and `web` folders. You can use the `.env.example` files as a reference in both folders which contain descriptions for each varialbe.

5. Generate and set a secure secret key for the CMS:

   - Visit https://payloadsecret.io/ to generate a random 32-byte secret
   - Set this as your `PAYLOAD_SECRET` in the CMS `.env` file

6. Set up MongoDB (if using MongoDB adapter):

   - Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Optional but recommended: Install [MongoDB Compass](https://www.mongodb.com/try/download/compass) for database management

7. Now you can start the development servers with `pnpm dev` in both terminals. Start with the CMS and then the website.

The CMS comes with a [seed script](https://github.com/jhb-software/payload-astro-website-template/blob/main/cms/src/seed.ts) to populate the database with some example data. To run it, uncomment the code inside the `onInit` function of your `payload.config.ts` file.

### Customizing the Template

When adapting this template for your project, consider the following steps:

1. Update the CMS base configuration:

   - Update the `websiteName`, `csrf` and `resend` configuration information in `payload.config.ts` to match your project details

2. Update the website base configuration:

   - Update the `websiteConfig` in `web/src/config.ts` with your project details
   - Place your logo, favicon and other assets in the `web/public` directory

3. Customize the CMS:

   - Review and modify the collections in `cms/src/collections` to match your content needs
   - Add or remove blocks in `cms/src/blocks` to match your content needs
   - Add or remove plugins based on your requirements

4. Adapt the website:

   - Implement templates for your CMS collections in `web/src/layout/collections`
   - Add Astro components for your CMS blocks in `web/src/components/blocks`
   - Update the files which generate structured data in `web/src/schema.ts`

### Deployment

Need help deploying the system or going live? Contact me via [email](mailto:info@jhb.software) or [X](https://x.com/jhb_dev) to discuss your project requirements and get expert assistance.

## Architecture Decisions

This section outlines the key architectural decisions made when building this template. While the template suggests specific approaches for building and hosting the system, you can adapt these to your specific needs.

### Static Astro Website

To improve performance and SEO, this template uses a static Astro website. All pages are pre-rendered at build time and served as static files. To enable previewing changes made in the CMS ([Payload Live Preview](https://payloadcms.com/docs/live-preview/overview)), this template includes a special preview route that server-side renders (SSR) the pages. More information on the Live Preview feature can be found in the [Live Preview section](#live-preview) section of this README.

The Astro app could be configured to server-side render all pages on demand with some modifications. To optimize performance, I recommend using [Vercel Incremental Static Regeneration (ISR)](https://vercel.com/docs/concepts/functions/incremental-static-regeneration) to benefit from caching and automatically regenerate specific pages when content is added or updated in the CMS.

### Website and CMS Hosting

The template is designed to deploy the website and CMS as separate projects on [Vercel](https://vercel.com/). Since Payload runs on Next.js, this provides the simplest and best developer experience for deployment. The Astro app uses the [Vercel adapter](https://docs.astro.build/de/guides/integrations-guide/vercel/) for deployment.

You can modify the setup to deploy both projects on another provider or self-host them if desired.

Since the website and CMS are deployed as separate projects, I recommend hosting your CMS on a subdomain of your website (e.g., `cms.mywebsite.com`). This creates a clean separation between the projects and maintains a clear URL structure.

### Database Hosting

The template uses the [Payload MongoDB adapter](https://payloadcms.com/docs/database/mongodb), but you can use any other database adapter supported by Payload.
For database hosting, [MongoDB Atlas](https://www.mongodb.com/atlas/database) offers a simple and scalable solution.

### Media Hosting

The template uses [Hetzner S3 Object Storage](https://www.hetzner.com/de/storage/object-storage/) for media files, providing a cost-effective solution for small to medium-sized websites.
For projects with larger budgets, I recommend using an image service with CDN and transformation capabilities like [Cloudinary](https://cloudinary.com/). Plugins are available for integrating Cloudinary with Payload.

### Website Analytics

The template integrates [Plausible Analytics](https://plausible.io/) for website analytics. Plausible is a privacy-friendly analytics tool that doesn't track users across websites. You can easily modify or remove this to use a different analytics solution.

### Cost and Scalability

The template is designed with cost-effectiveness and scalability in mind. The static website ensures minimal hosting costs and excellent scalability. The CMS deployment on Vercel is cost efficient and scalable, as is MongoDB Atlas for database hosting. Since the site is static, database load occurs only during CMS updates or website builds, not during regular site visits.

Most components can be deployed using free tiers to get started.

Here's an overview of typical costs for a small to medium-sized website:

- Vercel Pro Plan: ≈20 USD/month per seat (see [usage and pricing](https://vercel.com/docs/plans/pro)), note that you can host multiple websites on one account
- MongoDB Atlas Flex Tier: ≈8 USD/month per cluster (see [usage and pricing](https://www.mongodb.com/docs/atlas/billing/atlas-flex-costs/))
- Hetzner S3 Object Storage: ≈5 USD/month (see [usage and pricing](https://www.hetzner.com/storage/object-storage/))

For reference, the [jhb.software](https://jhb.software) website operates on exactly this setup at these costs.

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

---

## Contributing

If you want to contribute to this project, feel free to fork the repository and create a pull request. I am happy to receive feedback and suggestions for improvements.

## Support

If you need assistance with setting up this tech stack or Payload and Astro in general, feel free to contact me via [email](mailto:info@jhb.software) or [X](https://x.com/jhb_dev).

If you find this project helpful and would like to support its continued development, consider supporting me via the link below. Your support helps maintain and improve this and my other open-source projects:

<p>
  <a href="https://www.buymeacoffee.com/jhb_dev" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" height="40px">
  </a>
</p>
