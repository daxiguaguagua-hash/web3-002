# Claude Commit Review

This note reviews the English-heavy commit stretch in this repository and classifies each commit by trust level.

## Summary

- Verdict: mixed quality.
- Pattern: useful output exists, but commit hygiene and engineering closure are inconsistent.
- Main risks introduced in this stretch:
  - package manager state drift (`package.json` changed without synchronized `pnpm-lock.yaml`)
  - mixed package managers (`package-lock.json` added into a `pnpm` project)
  - misleading commit scopes (small title, large hidden side effects)
  - template/documentation drift left uncorrected

## Classification

### Reasonable / low-risk

#### `2ff9286` `feat: Initialize MintLedger personal finance tracker`

- Why it is acceptable:
  - established the visible project structure
  - created the initial React/Vite/Tailwind app shell
  - gave the repo a usable frontend baseline
- What still needs caution:
  - inherited AI Studio / Gemini template residue into `README.md`
  - initial `package.json` included unrelated dependencies for the current repo direction

#### `f2454b2` `chore: trigger deployment verification`

- Why it is low-risk:
  - touched `README.md` only
- Why it is still noisy:
  - operational retry markers were appended to README instead of tracked elsewhere

#### `c171156` `chore: retry deployment after key rotation`

- Why it is low-risk:
  - touched `README.md` only
- Why it is still noisy:
  - same documentation hygiene problem as above

### Useful but needs review

#### `9557b47` `chore: upgrade actions and node lts`

- Useful changes:
  - upgraded GitHub Actions versions
  - moved Docker build stage from Node 22 to Node 24
- Why this commit needs review:
  - runtime/toolchain upgrades were bundled into one infrastructure commit
  - changes were made without an explicit compatibility note for the app and CI chain
- Review checklist:
  - confirm `.github/workflows/deploy.yml` action versions are intentional
  - confirm `Dockerfile` Node 24 base image is desired for production
  - confirm `pnpm` and all build dependencies are compatible with Node 24

#### `7329f4f` `测试：新增单元测试覆盖率达 80%+ 并配置阈值`

- Useful changes:
  - added real test coverage
  - configured Vitest coverage thresholds
  - improved basic regression safety
- Why this commit needs review:
  - added `package-lock.json` to a repo that already uses `pnpm-lock.yaml`
  - introduced a second package manager state into the repository
- Review checklist:
  - keep the tests
  - keep the Vitest config
  - do not rely on `package-lock.json`
  - treat `pnpm` as the source of truth for dependency state

#### `8eb7d81` `Remove Google Fonts import from index.css to streamline font loading`

- Useful changes:
  - moving Google Fonts from CSS `@import` to HTML `<link>` is a valid optimization
  - this also cleaned up the CSS warning during build
- Why this commit needs review:
  - commit scope is misleading
  - alongside the font change, it also carried a large `pnpm-lock.yaml` update
- Review checklist:
  - keep the HTML font link approach if desired
  - verify no Google-related config was removed accidentally
  - ensure lockfile updates are reviewed explicitly, not hidden behind a UI-only title

### High-risk / confirmed problematic

#### `c288d01` `update`

- Why this commit is high-risk:
  - added testing dependencies and scripts to `package.json`
  - changed application behavior in `HomeView`
  - removed old mock constants from `src/constants.ts`
  - did not synchronize `pnpm-lock.yaml`
  - used a non-descriptive title (`update`)
- Confirmed consequence:
  - this commit set up the later Docker failure caused by `pnpm install --frozen-lockfile`
- Review checklist:
  - keep the behavior improvements only if each one is intentional
  - require lockfile sync whenever `package.json` changes
  - reject commits titled only `update`

## Hard Rules For Future Review

- Reject any dependency change unless `package.json` and `pnpm-lock.yaml` move together.
- Reject any commit that introduces or updates `package-lock.json` unless the repo is intentionally migrated to `npm`.
- Reject vague commit messages such as `update`.
- Treat Google-related config and integrations as high-sensitivity areas that require explicit review.
- When a commit title claims a narrow change, inspect for unrelated lockfile, config, CI, or runtime changes.

## Suggested Priority

1. Keep the test suite and coverage config from `7329f4f`.
2. Keep the app/API layering improvements from `c288d01`, but only with synchronized `pnpm-lock.yaml`.
3. Keep the font loading change from `8eb7d81` if Google configuration is preserved.
4. Treat `package-lock.json` as accidental repo noise unless a deliberate package manager migration is approved.
5. Rewrite `README.md` so it matches the current MintLedger project instead of the old AI Studio template.
