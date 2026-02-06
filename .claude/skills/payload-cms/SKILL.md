---
name: payload-cms
description: Payload CMS v3 conventions and best practices. Use when working on cms/, creating collections, fields, blocks, access control, or Payload local API queries.
---

# Payload CMS Rules

## Key Principles

- Write concise, technical TypeScript code
- Prefer iteration and modularization over code duplication
- Use descriptive variable names

## Collection Fields

- All fields should have `required: true` by default, unless explicitly optional

## Access Control

- Define granular access control for all collections
- Use `authenticated` as a default
- Use `anyone` for public read access

## Types

- Use TypeScript for all code
- Avoid using the `any` type or type assertions; use proper type definitions and type guards instead

## Performance

### Payload Local API Queries (payload.find)

To optimize Payload local API queries for speed and efficiency:

- Use `depth: 0` (or smallest depth possible) to avoid unnecessary relational field population
- Use the `select` property to limit returned fields to only those needed
- Set `limit: <number>` and `pagination: false` when pagination is not needed
- Always pass the `req` object to keep the query part of the same database transaction

```ts
req.payload.find({
  collection: "pages",
  depth: 0,
  select: {
    slug: true,
    path: true,
  },
  limit: 0,
  pagination: false,
  req,
});
```
