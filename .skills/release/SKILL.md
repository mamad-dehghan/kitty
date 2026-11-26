---
name: Release
description: Cut a Kitty release by reviewing changes since the last tag, curating CHANGELOG.md, bumping the version, and creating the annotated git tag.
---

# Kitty Release

Kitty is private and is not published to npm. A **git tag is the release
artifact**; consumers pin `git+https://github.com/mamad-dehghan/kitty.git#vX.Y.Z`.

The skill owns the judgment: review the changes, filter noise, write the
changelog, and choose the bump. The script owns the mechanics: version bump,
changelog promotion, commit, and tag.

Run from `C:/Code/root/packages/kitty`.

## 1. Preflight

```bash
git fetch --tags
git status
git describe --tags --abbrev=0
```

All feature and fix work must be committed. Only `CHANGELOG.md` may be dirty
when the release script runs.

Use the tag printed by `git describe --tags --abbrev=0` as the previous
release. The current release is `v0.2.0`; choose the next bump from the changes
since that tag.

## 2. Review changes

Do not paste raw `git log` output into the changelog. Use it as input:

```bash
git log --oneline <last-tag>..HEAD
git diff --stat <last-tag>..HEAD
```

Inspect the actual changes:

- `src/components/index.ts` and new component folders
- public props, defaults, and removed/renamed APIs
- providers and hooks (`src/providers`, `src/hooks`)
- theme tokens and variant classes
- SCSS export surface (`package.json`, `lib.scss`)
- user-visible demo changes when they document a new API

Filter out demo-only tweaks, formatting, internal refactors, and documentation
noise unless they affect consumers.

Classify into `Added`, `Changed`, `Fixed`, `Removed`, and, when needed,
`Breaking` with migration steps. Prefer user-facing outcomes over commit
wording.

## 3. Choose the bump

| Change | Bump |
| --- | --- |
| Breaking prop/API/token change | `major` |
| New component, additive prop, new hook, new feature | `minor` |
| Fix, docs, internal refactor | `patch` |

While on `0.x`, breaking changes are commonly released as `minor`; call them
out under `Breaking` in the changelog.

## 4. Write the changelog

Edit `CHANGELOG.md` and put the curated entries under `## [Unreleased]`:

```md
## [Unreleased]

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

The script refuses to run if the section is missing or empty.

## 5. Run the release script

Preview first:

```bash
bun run release minor --dry-run
```

Then release locally:

```bash
bun run release minor
```

The script:

- verifies `main`, a clean tree except `CHANGELOG.md`, and a new tag
- runs `bun run typecheck` and `bun run build`
- bumps `package.json`
- promotes `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD`
- commits `chore: release vX.Y.Z`
- creates annotated tag `vX.Y.Z`
- **stops before pushing**

Use an explicit version instead of a bump when needed:

```bash
bun run release 0.2.0
```

## 6. Review and push

```bash
git show --stat HEAD
git tag -n
```

Then:

```bash
git push origin main
git push origin vX.Y.Z
gh release create vX.Y.Z --generate-notes
```

Never move or reuse a published tag. If a release is wrong, publish a new
patch.

## 7. Update consumers

Update the README dependency example and downstream consumers to the new tag:

```json
"kitty": "git+https://github.com/mamad-dehghan/kitty.git#vX.Y.Z"
```

Verify from a clean consumer:

```bash
bun add "git+https://github.com/mamad-dehghan/kitty.git#vX.Y.Z"
```

Build the consumer and commit its lockfile.

## Rules

- Annotated tags only: `vX.Y.Z`.
- `package.json` version and tag stay in sync (`X.Y.Z` ↔ `vX.Y.Z`).
- No release from a dirty tree or a non-`main` branch.
- Do not publish to npm; `"private": true` stays.
- Update `CHANGELOG.md` as part of the release commit.
- Run `bun test` when the release script changes.
