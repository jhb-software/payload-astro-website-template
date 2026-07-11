---
name: astro-components
description: Astro component conventions and best practices. Use when creating or modifying .astro files in web/, working with Astro props, Tailwind CSS styling, or using custom components like Img, RichText, and Link.
---

# Astro Components Rules

## Props Definition

If a component has props, define a `Props` type and destructure from `Astro.props`:

```ts
type Props = {
  title: string;
};

const { title } = Astro.props;
```

Use types from the CMS wherever possible:

```ts
import type { Image } from "cms/src/payload-types";

type Props = {
  images: Image[];
};

const { images } = Astro.props;
```

## Styling

Always use Tailwind CSS. When a tag has many classes, group them with `class:list` and inline comments:

```astro
<div class:list={[
  'flex flex-col', // Layout
  'p-4 gap-2',  // Spacing
  'bg-white rounded shadow-md',  // Visual
]}>
```

## Custom Components

### Images

Use the custom `<Img />` component from `web/src/components/Img.astro`. It handles alt text automatically:

```astro
<Img media={media} class="w-full h-full aspect-square" height={500} width={500} />
```

### Rich Text

For rendering rich text from the CMS, always use `<RichText />` from `web/src/components/blocks/RichTextBlock/RichTextLexical.astro`:

```astro
<RichText data={richText} />
```

### Links

For internal or external links, always use the custom `Link.astro` component from `web/src/components/Link.astro`. Normalize CMS-driven internal paths using `normalizePath()`:

```astro
<Link href={normalizePath(page.path)}>Page Name</Link>
<Link href={externalUrl}>Website Name</Link>
```
