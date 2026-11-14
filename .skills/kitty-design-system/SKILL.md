---
name: Kitty Design System
description: Work on the kitty React + SCSS design system in packages/kitty — add or change components, theme tokens, providers, overlays, demos, and package exports
---

# Kitty Design System

`packages/kitty` is a private React 19 + TypeScript + SCSS component library for
the workspace. It is consumed by `talk-ui` as `"kitty": "workspace:*"` and is
not published. Read `README.md` in this package first for the public API.

## Source map

- `lib.ts` — package entry: `src/components`, hooks, `src/providers`, and
  `Shapes`.
- `lib.scss` — package SCSS entry; forwards `palette`, `typography`,
  `elevation`, `breakpoint`, and `animation`.
- `src/components/index.ts` — component barrel. **Public components must be
  exported here.**
- `src/providers/index.ts` — `AppLayer`, `ThemeProvider`, `ToastProvider`,
  `TooltipProvider`, and the `colorOptions` / `fillOptions` / `sizeOptions` /
  `breakPoints` enums.
- `src/components/<group>/` — component + its own `.scss` file. The TSX file
  imports the SCSS.
- `src/providers/theme/` — palette, typography, elevation, breakpoint,
  animation, and `ThemeProvider`.
- `src/providers/appLayer/appLayer.tsx` — shared overlay wrapper used by
  Drawer, Modal, Menu, BottomSheet, toasts, and tooltips.
- `src/z_demos/` — demo pages; `src/App.tsx` + `src/router.tsx` wire them up.
- `src/styles/shapes/` — SVGs exported as URL strings through
  `src/styles/shapes/index.ts`.

## Commands

Run from the workspace root (`C:/Code/root`):

```bash
bun install
bun run --cwd packages/kitty dev      # vite on :2000, opens /demo
bun run --cwd packages/kitty build    # vite build only; no tsc
bun run --cwd packages/kitty lint     # eslint (repo config required)
```

Type check from the package:

```bash
cd packages/kitty
../../node_modules/.bin/tsc --noEmit
```

The package currently has **pre-existing `tsc` errors** (PlaceFinder,
Splitter, TabBar, some `verbatimModuleSyntax` imports, toast timeout typing).
Do not claim a clean type check, and do not fix unrelated files while making a
focused change. Vite `build` succeeds without type checking.

## Adding or changing a component

1. Create `src/components/<group>/<Name>.tsx`.
2. Create `<name>.scss` beside it and `import "./<name>.scss";` in the TSX.
3. Extend the relevant native attributes (`ButtonHTMLAttributes`,
   `InputHTMLAttributes`, etc.) and use `forwardRef` for form controls.
4. Use `classNames` and the exported enums (`colorOptions`, `fillOptions`,
   `sizeOptions`). Do not accept free-form color strings for the standard
   modes.
5. Map props to the established classes:
   `element--primary|secondary|tertiary|error|warning|success|surface`,
   plus component-specific fills such as `button--tonal`,
   `icon-button--outline`, `input--elevated`, `chip` + `element-outline`.
6. Export the component from `src/components/index.ts` (alphabetical-ish by
   group is not required, but keep the file tidy).
7. Add a demo in `src/z_demos/`, a route in `src/router.tsx`, and an entry in
   `src/App.tsx` when the component needs interactive verification.
8. Verify in the demo at `/demo`.

Useful existing patterns:

- `Button.tsx` — prop-to-class mapping and `forwardRef`.
- `Input.tsx` — wrapper, helper text, label, icons.
- `Checkbox.tsx` / `RadioButton.tsx` — native input plus decorative icons,
  controlled `readOnly` fallback, `indeterminate`.
- `Badge.tsx` / `Tooltip.tsx` — cloning a single child element.
- `Drawer.tsx` / `Modal.tsx` / `Menu.tsx` — portals + `AppLayer` +
  `useDeferredState`.

## Styling rules

Colors are **HSL triplets**, not colors:

```css
--primary-40: 260, 34%, 48%;
--background: var(--natural-99);
```

Always consume them through `hsl()` / `hsla()`:

```scss
background-color: hsl(var(--primary));
color: hsl(var(--on-primary));
border: 1px solid hsla(var(--outline), 0.5);
```

Rules:

- Do not hardcode component colors; use role tokens from `palette.scss`.
- Use typography mixins (`@include typography.titleMedium();`) instead of
  hand-written font sizes.
- Use elevation mixins (`@include elevation.elevation-2();`) instead of ad-hoc
  shadows.
- Use palette role mixins (`primaryTheme`, `secondaryTheme`, `tertiaryTheme`,
  `errorTheme`, `warningTheme`, `successTheme`) when a component must expose
  `--color`, `--on-color`, `--container`, `--on-container`.
- Hover/focus/active state layers come from `palette.state-layer(...)`.
- Component SCSS is imported by the component. `src/styles/modules/_index.scss`
  is effectively empty (all imports commented); do not put new component styles
  there.
- When adding a reusable token or mixin, add it to the theme module and make
  sure the relevant `package.json` subpath export / `lib.scss` forward exists.

## Theme and provider contract

Root provider order in `src/main.tsx` and consumers:

```tsx
<ThemeProvider>
  <TooltipProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </TooltipProvider>
</ThemeProvider>
```

- `ThemeProvider` renders `#theme-provider`; `Drawer`, `Modal`, `Menu`, and
  `BottomSheet` portal into that element, so they fail without it. Toast and
  tooltip layers render inline but still need the theme tokens and wrapper for
  correct styling.
- `ThemeProvider` accepts `modify` (hue overrides) and `forceDarkMode`.
  Nested providers inherit the parent theme and do not touch the `darkMode`
  cookie or meta theme color.
- `themeT` exposes only `--primary-hue-theme`, `--secondary-hue-theme`, and
  `--tertiary-hue-theme` (numbers).
- `useHistoryLockAbility()` must be mounted once at the router root. Overlays
  use `useHistoryLock` through `AppLayer` to make browser Back close the top
  layer.
- `AppLayer` props: `blockBottomLayers`, `closeOnEscape`, `preventBlock`,
  `onClose`, plus normal div attributes.
- Use `useDeferredState(value, ms)` when an overlay needs to stay mounted for
  its exit animation.
- `ToastContext` is internal: it lives in
  `src/providers/toast/toast_context.ts` and is **not** re-exported from
  `src/providers/index.ts`. Toast API: `toast(id, content, severity)`,
  `closeToast(id)`, `closeAllToasts()`; auto-dismiss after 5s.

### Changing the palette

1. Add numbered tokens (`--<family>-10` … `--<family>-100`) in
   `src/providers/theme/palette.scss`.
2. Map them to role tokens inside `light-theme()` and `dark-theme()`.
3. Add or update the corresponding `@mixin` (for example `errorTheme`) and the
   `colorMode` selector mapping.
4. If a `colorOptions` value was added, update every component's mode-to-class
   mapping and the `README.md` tables.

Keep hue-driven families (`primary`, `secondary`, `tertiary`) derived from
`--*-hue-theme`; fixed families (`error`, `warning`, `success`, `natural`) use
literal HSL triplets.

## Overlay rules

- Portal target is `document.getElementById("theme-provider")!`.
- Use `AppLayer`, not a raw fixed div, so Escape, Back, and lower-layer
  blocking stay consistent.
- `Drawer`: `direction` is required, `isOpen` defaults to `true`;
  `mountElement` can override the portal target.
- `Modal`: compose with `Modal.Title`, `Modal.HelpText`, `Modal.Body`,
  `Modal.Actions`. It calls `document.startViewTransition`; keep that in mind
  for unsupported browsers/tests.
- `Menu`: `targetEl` is a `DOMRect`; without it the menu returns `null`.
  Items are action items (`onClick`), nested items (`items`), or
  `"separator"`. `layerID` is generated internally.
- `BottomSheet`: `open` + `onClose`; it closes when its wrapper is scrolled
  back to the top.

## Public export gotchas

These exist but are **not** exported from `lib.ts` today:

- `AppBar`
- `BottomSheet` (commented out in `src/components/index.ts`)
- `ProgressIndicator`
- `MultiContentCss` (only `MultiContent` is exported)
- `ToastContext`

If a consumer needs one, export it deliberately and update the README table.

Other API quirks:

- `Input` still requires `mode` in its type even though the implementation uses
  `color`. Pass both to satisfy TypeScript; do not remove `mode` without
  checking consumers.
- `Badge` only renders text for numbers or nodes; string `value` renders an
  empty badge.
- `Tooltip` and `Badge` require a single child element and warn/return the
  child for `Fragment`.
- `Switch` renders a `<button>` wrapper with a hidden checkbox; pass
  `checked` and `onChange` to the underlying input.
- `MultiItemInput` calls `onChange(value)` in an effect and expects the full
  comma/space-separated string.
- `MultiContent` requires explicit `width`/`height` and a single child.
- `Splitter` supports exactly two panels; `minSize` is a `` `${number}px` ``
  string.

## Consumer contract

- `talk-ui` imports runtime APIs from `"kitty"` and SCSS from
  `"kitty/scss/<module>"` (`@use "kitty/scss/elevation" as elevation;`).
- Do not publish kitty or replace the workspace reference with a version.
- Add new runtime dependencies to `packages/kitty/package.json`, then run
  `bun install` from the repository root. The root `bun.lock` is the source of
  truth for resolved versions.
- `peerDependencies` is currently empty. Kitty assumes React 19 and a bundler
  that handles SCSS imports.

## Verification checklist

- [ ] Demo route renders in `bun run --cwd packages/kitty dev`.
- [ ] Light and dark themes both look correct (toggle via `ThemeProvider`).
- [ ] Keyboard: Tab order, `:focus-visible`, Escape, and Back-to-close.
- [ ] Overlay portals mount under `#theme-provider` and block lower layers.
- [ ] Responsive behavior checked at `sm`, `md`, `lg`, `xl`.
- [ ] New public API added to `src/components/index.ts` / `src/providers/index.ts`.
- [ ] README component table and SCSS export table updated when the API changes.
- [ ] `bun run --cwd packages/kitty build` succeeds; note that it does not
      type check, so run `tsc --noEmit` separately and compare with the known
      pre-existing errors.
