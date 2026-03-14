# AGENTS.md

## Repo Guardrails

This repository has already been damaged by broad, low-discipline agent edits. Read these rules before making changes.

### 1. Package manager discipline

- This repo uses `pnpm`.
- `pnpm-lock.yaml` is the dependency source of truth.
- Do not add, update, or commit `package-lock.json` unless the user explicitly approves a migration to `npm`.
- If `package.json` changes, you must update and verify `pnpm-lock.yaml` in the same task.
- Never leave a dependency edit half-finished.

### 2. Protect external integrations

- Do not remove or rewrite Google-related configuration casually.
- Treat fonts, analytics, OAuth, Search Console, Tag Manager, API keys, callback URLs, and third-party integration code as high-sensitivity areas.
- If a task seems unrelated to those integrations, leave them alone.
- If you must change them, explain why and verify the exact impact.

### 3. No vague commits or vague changes

- Do not make commits titled `update`, `fix stuff`, or similar low-information messages.
- Do not bundle unrelated lockfile, config, CI, and UI changes into one commit.
- If a change is small, keep the scope small.
- If a lockfile changes, say so explicitly.

### 4. Review before "cleanup"

- Do not delete configuration just because it looks unused.
- Do not replace project-specific docs with template text.
- Do not leave AI Studio / Gemini template residue in files that should describe MintLedger.
- Do not remove code or config unless you have confirmed it is obsolete in this repo.

### 5. Build and CI expectations

- Before finishing dependency or deployment work, verify the repo still passes the relevant checks.
- Minimum expectation after dependency/config/build changes:
  - `pnpm build`
- Minimum expectation after test-related changes:
  - `pnpm test`
- Minimum expectation after TypeScript/config refactors:
  - `pnpm lint`

### 6. Working style for future agents

- Prefer precise, narrow edits over sweeping rewrites.
- Preserve working behavior unless the user explicitly asks for a redesign.
- When in doubt, inspect the current repo state first and make fewer assumptions.
- The costliest past mistakes in this repo came from moving fast without checking lockfiles, docs, or integration boundaries.
