---
name: upgrade-dependencies
description: Upgrade the workspace dependencies (cms + web) to their latest versions, review breaking changes, fix security advisories, regenerate Payload files, verify both apps and open a PR. Use when the user says "upgrade dependencies", "bump dependencies", "update dependencies", "audit dependencies" or "check for vulnerabilities".
user-invocable: true
---

# Upgrade dependencies, review breaking changes, fix advisories

If the user only asks for an audit, do steps 1, 4 and 8.

## 1. Check the tree and branch

`git status --porcelain` must be empty, so the diff shows only the upgrade. If it isn't, tell the user and stop.

Create the branch `upgrade-dependencies-<calendar-week>` from `main`. Get the ISO week with `date +%V`, for example `upgrade-dependencies-47`.

## 2. Upgrade

```sh
pnpm install --frozen-lockfile
pnpm -r outdated
pnpm -r up --latest
```

Payload (`payload`, `@payloadcms/*`), `next`, `eslint-config-next` and React are exact pins. They must stay on one version each across `cms` and `web`.

Going to latest can overshoot. Hold a package back (`pnpm -r up --latest '!<pkg>'`) when the ecosystem doesn't support its new major yet. Check `pnpm peers check` and the peer ranges of the tools that depend on it (`npm view <tool>@latest peerDependencies`). For example, TypeScript 7 stays held back while `typescript-eslint` and `@astrojs/check` don't support it. Compare `pnpm peers check` with its output before the upgrade (`git stash`), and fix only the new unmet peers.

## 3. Reconcile overrides

`pnpm up` never touches `overrides:` in `pnpm-workspace.yaml`, and overrides win during resolution. For each upgraded dependency listed there, check that the override doesn't hold it back. Raise or remove the override if it does.

Don't remove a security floor just to tidy up. The lockfile keeps resolved versions, so removing a floor and reinstalling doesn't show whether it's still needed.

## 4. Fix advisories

**This step must pass before you finish.** A run must end with zero _fixable_ advisories. While one remains, the run is unfinished: don't report success, don't push and don't open a PR. Only advisories with no patched release yet (`fix` = `NO`) may stay. List each of them in the report and PR with the reason.

```sh
./.claude/skills/upgrade-dependencies/audit-dependencies.sh
```

- Exit `0`: no fixable advisory remains. Any rows still printed are `fix` = `NO`. Report them.
- Exit `1`: fixable advisories remain. A `fix` = `?` row has no patched range in the advisory data. Treat it as fixable until its vulnerable range proves otherwise. For example, an advisory that only names `=3.1.6` is fixed by moving to any other release.
- Exit `2`: the audit couldn't run or its output couldn't be parsed. That means unknown, not clean. Rerun it, and report it as a blocker if it keeps failing.

Fix each fixable advisory with the first of these that works:

1. **Upgrade the direct dependency that pulls it in.** `pnpm why <pkg> -r` shows who that is. Upgrade it if a newer release requires the patched range.
2. **Add an override floor** in `pnpm-workspace.yaml`, scoped to the vulnerable range, matching the existing entries: `"pkg@<1.2.3": ">=1.2.3"`. Use `^` instead of `>=` when another major line would break consumers. In `0.x`, `^0.27.0` excludes a `0.28.1` fix.
3. **Run `pnpm install`** and check `pnpm why <pkg> -r` again. pnpm doesn't always re-resolve a locked transitive dependency to satisfy a changed override. If it didn't move, run `pnpm update <pkg> -r` for that package.

Before chasing a patched version, check that it's actually published (`npm view <pkg> versions`). Rerun the audit until it exits `0`.

`pnpm audit` and Dependabot count differently, so a clean audit doesn't prove there are no open GitHub alerts. When you push, read the full `git push` output. If GitHub's banner ("GitHub found N vulnerabilities…") reports alerts that the audit doesn't, find out why before you report success.

## 5. Review the upgrades

List the changes with `git diff -- cms/package.json web/package.json`. A change to the `0.<minor>` segment counts as breaking.

- **Every non-patch bump:** read the release notes of every version from OLD to NEW for removals, renames, and peer or Node changes. Search `cms/src/` and `web/src/` for anything affected, and check against `node_modules/<pkg>/` rather than trusting the wording.
- **Payload:** also check the minimum Node, Next.js and React versions. Raise `engines.node` in `cms/package.json` if Payload's minimum went up.
- **Patch bumps:** read the notes only if a check fails.

## 6. Regenerate and check

```sh
cd cms && pnpm generate:importmap && pnpm generate:types && pnpm lint && pnpm check
cd web && pnpm lint && pnpm check
```

Commit any regenerated files, such as `cms/src/payload-types.ts`, `importMap.js` and `next-env.d.ts`.

## 7. Run both apps

Start `pnpm dev` in `cms` (port 3000) and `web` (port 4321), using env files copied from `.env.example`. Request `/admin`, `/api/pages` and `/`, and read the server logs for module, compile or runtime errors. If MongoDB isn't available, separate database connection errors from real breakage, and say in the report what couldn't be tested. Stop both servers and delete the copied `.env` files afterwards.

## 8. Report and PR

Commit as `chore: upgrade dependencies (week <n>)`, push, and open a PR with this body:

```
<dep>  <OLD> → <NEW>
  Breaking: <one line, or "none">
  Impact: <"none" | file:line and what changed>

Held back: <dep, why>
Advisories: <before> → <after>
Left open: <each fix = NO advisory and why, e.g. "4.3.1 is the newest release, the advisory names 4.3.2">
Verification: <checks run, what the dev servers showed, what couldn't be tested>
```

## When to stop and ask

- A failure you can't trace to an upgrade.
- A breaking change that needs an architectural decision, such as Payload removing an API the CMS depends on.
- A fixable advisory that you can only fix by downgrading or by forcing a major version that a dependency doesn't support.
