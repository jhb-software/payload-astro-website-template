---
name: intl
description: Internationalization rules for multi-language websites. Use when working on localized text fields in the CMS, Intl formatting (dates, numbers, currencies, lists) in Astro components, or any locale-aware code.
---

# Internationalization Rules

## CMS: Localized Fields

- All text fields (e.g. labels, titles) should have `localized: true`

## Web: Labels & Translations

This is a multi-language website. When adding labels or text to Astro components:

1. **Never hardcode text strings** - All user-facing text must be translatable
2. **Update the CMS labels global** - Add necessary fields to `/cms/src/globals/labels.ts`
   - Use the `global` group for common, site-wide labels (e.g., "show-more", "close", "loading")
   - Use specific groups for scoped labels (e.g., `articles` for article-related text, `contact` for contact forms)
3. **Access labels in components** - Use `const { labels } = globalState`
4. **Example usage**: `labels.articles['written-by']` or `labels.global['show-more']`

- When adding labels to the CMS, ensure you use all of them. Delete unused labels after implementation.

## Web: Formatting with Intl APIs

Use the built-in JavaScript `Intl` APIs for locale-aware formatting. Never use third-party libraries or manual string concatenation.

The active locale **must come from the global state** (`const { locale } = globalState`). Never hardcode a locale string.

### Date & Time

```ts
const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
```

### Lists

```ts
const formatList = (items: string[], type: Intl.ListFormatType = 'conjunction') =>
  new Intl.ListFormat(locale, { type }).format(items);
```

### Currency & Numbers

```ts
const formatCurrency = (value: number, currency = 'EUR') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
```
