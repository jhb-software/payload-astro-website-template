---
name: astro-accessibility
description: WCAG 2.1 AA accessibility guidelines for Astro components. Use when creating or modifying .astro files, working on accessibility, ARIA attributes, keyboard navigation, screen readers, semantic HTML, or accessible images.
---

# Accessibility Rules (WCAG 2.1 AA)

This project must meet **WCAG 2.1 AA** guidelines.

## Semantic Structure

- Use semantic HTML: `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<ul>`, `<li>`
- Use ARIA roles only when native semantics are not possible (e.g. `<div role="list">`)

## Images

- **Informative images**: use the custom `<Img>` component and pass the `media` prop, it includes the correct alt text
- **Functional images/icons** (used in buttons or links): use `alt` or `aria-label` to describe the action/purpose
- **Decorative images/icons**: use `aria-hidden="true"` and `alt=""`

## Active State

- Use `aria-current="page"` or `aria-current="location"` for the current page (e.g. navigation, breadcrumbs)
- Use aria-current for styling: `aria-current:font-semibold`

## Lists

- Use semantic HTML: `<ul>`, `<ol>`, `<li>`
- For custom components rendering lists, explicitly set ARIA roles:
  - `role="list"` on the container
  - `role="listitem"` on each item

## Keyboard Navigation

- All functionality **must be operable using only the keyboard**
- Do **not** rely solely on hover, drag, or pointer events for core interactions

## Aria Labels

- Do NOT hardcode strings for `aria-label` or visually hidden (`sr-only`) text
- Always use dynamic labels from the global state: `labels.global['skipToMainContent']`
- Select elements must have an accessible name (e.g. `label` tag or `aria-label`)
