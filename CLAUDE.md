# Repository Overview

This is a mono-repository for multi-language content-driven websites consisting of:

- **CMS** (`/cms`): Payload CMS with Next.js for content management
- **Frontend** (`/web`): Astro-based multi-language static site, styled with Tailwind CSS

## Essential Commands

### CMS Development (`/cms`)

```bash
cd cms
pnpm dev              # Start development server (default: http://localhost:3000)
pnpm build            # Build for production
pnpm generate:types   # Generate TypeScript types from Payload schema
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

### Frontend Development (`/web`)

```bash
cd web
pnpm dev              # Start Astro dev server (default: http://localhost:4321)
pnpm build            # Build static site
pnpm check            # Run Astro type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

### Global Commands

```bash
pnpm install          # Install all dependencies (run from root)
```

## Architecture Overview

### CMS Architecture

The CMS uses Payload v3 with a modular collection and block system:

- **Collections** (`/cms/src/collections/`): Define content types in plural (e.g. `Articles.ts`, `Authors.ts`, `Projects.ts`, etc.)
- **Blocks** (`/cms/src/blocks/`): Reusable content blocks that map to frontend block components. Suffix: `Block` (e.g. `AuthorsListBlock.ts`)
- **Globals** (`/cms/src/globals/`): Global documents containing site-wide settings (e.g. `Header`, `Footer`, `Labels`)
- **Plugins** (`/cms/src/plugins/`): Custom plugins (e.g. `cms-content-translator`, `jhb-dashboard`)
- **Endpoints** (`/cms/src/endpoints/`): Custom HTTP API-endpoints
- **Fields** (`/cms/src/fields/`): Reusable fields (e.g. `heroSection` field for the `pages` collection)

Key architectural patterns:

- Modular collection and block system
- Multi-language support with automatic path generation
- Live preview for content editing
- Custom HTTP API-endpoints for the frontend (e.g. `sitemap.ts` or `staticPages.ts`)

### Frontend Architecture

The frontend uses Astro's static site generation with dynamic CMS integration:

- **CMS**: (`/web/src/cms/`): Utility functions for fetching data from the CMS
- **Components**: (`/web/src/components/`): Reusable .astro components
  - **Blocks**: (`/web/src/components/blocks/`): .astro components for CMS blocks (following the same naming convention as the CMS blocks)
- **Layout**: (`/web/src/layout/`): Layout components like `HeroSection.astro`, `Footer.astro` or `Layout.astro`

  - **collections**: (`/web/src/layout/collections/`): Layout components for collection types (e.g. `PageLayout.astro`, `PostLayout.astro`)

- **Pages**: (`/web/src/pages/`): Dynamic routing (e.g. `[lang]/[...path].astro`)
- **Schema**: (`/web/src/schema/`): Structured data schemas for each collection type for SEO

Key architectural patterns:

- Static site generation with Astro
- SSR only for `/preview` path for live preview
- Progressive enhancement with minimal client-side JavaScript
- Type-safe CMS data integration using generated types
- Tailwind CSS v4 for styling with custom design tokens

### Content Flow

1. Content is created/edited in the CMS
2. CMS generates TypeScript types for type safety
3. Frontend fetches data via SDK during build
4. Astro generates static pages with dynamic data
5. Deployed to Vercel with edge middleware for routing

### Development Workflow

1. Run CMS locally to manage content
2. Generate types after schema changes: `cd cms && pnpm generate:types`
3. Develop frontend components that consume CMS data
4. Test locally with both services running

## Important Configuration

### Environment Variables

Both packages require environment configuration:

- CMS: Database URL, storage credentials, API keys, etc.
- Web: CMS API URL, deployment settings, etc.

### TypeScript

Strict mode is enabled across the monorepo. Always ensure type safety when:

- Adding new CMS fields or collections
- Creating frontend components
- Integrating CMS data

### Code Style

- ESLint and Prettier are configured for consistency
- Always run `pnpm lint` and `pnpm format` before committing
- Follow existing patterns for imports and file organization

## Rules

### Translation Requirements

This is a multi-language website. When adding labels or text to Astro components:

1. **Never hardcode text strings** - All user-facing text must be translatable
2. **Update the CMS labels global** - Add necessary fields to `/cms/src/globals/labels.ts`
   - Use the `global` group for common, site-wide labels (e.g., "show-more", "close", "loading")
   - Use specific groups for scoped labels (e.g., `articles` for article-related text, `contact` for contact forms)
3. **Access labels in components** - Use `const { labels } = globalState`
4. **Example usage**: `labels.articles['written-by']` or `labels.global['show-more']`

- This ensures all UI text can be properly localized for different languages
- When adding labels to the CMS, please ensure you use all of them. If some are unused after the frontend implementation, delete them

### Structured Data Schemas

This website implements JSON-LD structured data for SEO. All schema definitions are located in `/web/src/schema/`.

1. **File Organization**: Create one file per collection or schema type (e.g., `article.ts`, `author.ts`)
2. **Function Naming**: Name the main export function `{contentType}Schema` (e.g., `articleSchema`, `authorSchema`)
3. **Return Type**: Functions must return `WithContext<SchemaType>` from the `schema-dts` package
4. **URL Construction**: Always use `new URL(path, WEBSITE_URL)`. Do not use `normalizePath`
5. **Usage**: Import and call schema functions in layout files, then render with `<Schema item={schema} />`

### Task Completion Checklist

When completing any task in this codebase, always perform these quality checks:

### Code Quality

- [ ] Run `pnpm lint` in the `cms` folder to check for linting issues
- [ ] Run `pnpm lint` in the `web` folder to check for linting issues
- [ ] Run `pnpm astro check` in the `web` folder to validate Astro components and TypeScript

### Type Safety

- [ ] If CMS schema was modified, run `cd cms && pnpm generate:types` to update TypeScript types
- [ ] Ensure all new components properly type their props using generated CMS types
