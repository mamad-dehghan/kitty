---
name: Kitty Design System
description: Work on the kitty React + SCSS design system in packages/kitty — add or change components, theme tokens, providers, overlays, demos, and package exports
---

# Kitty Design System

This repository is a private React 19 + TypeScript + SCSS component library.
It is consumed as a pinned git dependency and is not published. Read
`README.md` here first for the public API.

## Source map

- `lib.ts` — package entry: `src/components`, hooks, `src/providers`, and
  `Shapes`.
- `lib.scss` — package SCSS entry; forwards `palette`, `typography`,
  `elevation`, `breakpoint`, and `animation`.
- `src/components/index.ts` — component barrel. **Public components must be
  exported here.**
- `src/providers/index.ts` — `AppLayer`, `ThemeProvider`, `ToastProvider`,
  `useToast`, `TooltipProvider`, and the `colorOptions` / `fillOptions` /
  `sizeOptions` / `breakPoints` enums.
- `src/components/<Component>/` — one folder per component. The main file
  matches the folder (`Select/Select.tsx`) and imports its own SCSS
  (`Select.scss`). Folders with several public components may add an
  `index.ts` barrel (for example `Chip/`).
- `src/providers/Theme/` — palette, typography, elevation, breakpoint,
  animation, and `ThemeProvider`.
- `src/providers/AppLayer/AppLayer.tsx` — shared overlay wrapper used by
  Drawer, Modal, Menu, BottomSheet, FABMenu, toasts, and tooltips.
- `src/DemoShell.tsx` / `.scss` — shared demo chrome (header, logo link,
  theme toggle) wrapping every route.
- `src/App.tsx` — tabbed home overview; `src/router.tsx` derives routes and
  mounts them inside `DemoShell`.
- `src/demos/` — one demo per component plus `registry.tsx` and shared
  `DemoLayout`; the registry drives the home tabs and routes.
- `src/assets/shapes/` — SVGs exported as URL strings through
  `src/assets/shapes/index.ts`.

## Commands

Run from this repository root (`C:/Code/root/packages/kitty`):

```bash
bun install
bun run dev        # vite on :2000, opens /
bun run build      # vite build only; no tsc
bun run typecheck  # tsc --noEmit
```

`bun run typecheck` runs the full TypeScript check and should pass. Vite
`build` succeeds without type checking, so do not treat it as a type check.

## Adding or changing a component

1. Create `src/components/<Name>/<Name>.tsx` (one PascalCase folder per
   component).
2. Create `<Name>.scss` beside it and `import "./<Name>.scss";` in the TSX.
3. Extend the relevant native attributes (`ButtonHTMLAttributes`,
   `InputHTMLAttributes`, etc.) and use `forwardRef` for form controls.
4. Use `classNames` and the exported enums (`colorOptions`, `fillOptions`,
   `sizeOptions`). Do not accept free-form color strings for the standard
   variants.
5. Use the shared variant helpers, which emit the `element--*` classes
   (`element--primary`, `element--outline`, `element--small`, …):
   `variantClasses({ colorMode, fill, size })` or `colorClass` / `fillClass` /
   `sizeClass` individually.
6. Export the component from `src/components/index.ts` (keep the grouped
   sections tidy).
7. Add a `<Name>Demo` in `src/demos/` and register it in
   `src/demos/registry.tsx`; the home tabs and routes derive from the registry.
8. Verify in the demo at `/<path>` (the route is wrapped by `DemoShell`).

Useful existing patterns:

- `Button.tsx` — prop-to-class mapping and `forwardRef`.
- `Input.tsx` — wrapper, helper text, label, icons.
- `Checkbox.tsx` / `RadioButton.tsx` — native input plus decorative icons,
  controlled `readOnly` fallback, `indeterminate`.
- `Badge.tsx` / `Tooltip.tsx` — cloning a single child element.
- `FAB.tsx` / `FABMenu.tsx` — M3 sizes, extended/condensed states, and a
  portalled action menu with focus and history handling.
- `Collapse.tsx` — measured auto-height/auto-width transitions.
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
- The demo shell wraps every route. The home route adds a 64px bottom NavBar
  at sm/md/lg; fixed page UI such as `FABMenu` must clear it (`offsetBlock` in
  the FAB demo).
- Do not use native `title` attributes for tooltips. Use the `<Tooltip>`
  component instead (single child element, requires `TooltipProvider`), and keep
  an `aria-label` on icon-only controls for their accessible name. This applies
  to controls such as the NavBar rail toggle.
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

- `ThemeProvider` renders `#theme-provider`; `Drawer`, `Modal`, `Menu`,
  `BottomSheet`, and `FABMenu` portal into that element, so they fail without
  it. Toast and tooltip layers render inline but still need the theme tokens
  and wrapper for correct styling.
- `useTheme()` returns the current `{ theme, overrideTheme, darkMode, setDarkMode }`
  context.
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
  `src/providers/Toast/ToastContext.ts`. Use `useToast()`; `toast(content, options?)`
  returns an id, and `closeToast(id)` / `closeAllToasts()` are also available.
  One toast is visible at a time and the rest queue. Auto-dismiss defaults to
  5s (10s with an action), pauses on hover/focus, and `duration: 0` is
  persistent.

### Changing the palette

1. Add numbered tokens (`--<family>-10` … `--<family>-100`) in
   `src/providers/Theme/palette.scss`.
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
- `FABMenu`: fixed bottom-end and portalled through `AppLayer`; pass
  `offsetBlock` when a bottom navigation/app bar is present.

## Public export gotchas

These exist but are **not** exported from `lib.ts` today:

- `MultiContentCss` (only `MultiContent` is exported)
- `ToastContext` (use the exported `useToast()` hook instead)

If a consumer needs one, export it deliberately and update the README table.

Other API quirks:

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

- Consumers import runtime APIs from `"kitty"` and SCSS from
  `"kitty/scss/<module>"` (`@use "kitty/scss/elevation" as elevation;`).
- Consumers pin Kitty through
  `"kitty": "git+https://github.com/mamad-dehghan/kitty.git#vX.Y.Z"` or a
  commit hash. Commit the consumer's lockfile.
- Add or change dependencies in this package's `package.json`, then run
  `bun install` here. `packages/kitty/bun.lock` is the source of truth.
- React 19 and React DOM are peer dependencies. Keep them in dev dependencies
  for the demo. If a consumer bundles Kitty source, keep React resolution
  deduped in its Vite config.

## Verification checklist

- [ ] Demo route renders in `bun run dev`.
- [ ] Light and dark themes both look correct (toggle via `ThemeProvider`).
- [ ] Keyboard: Tab order, `:focus-visible`, Escape, and Back-to-close.
- [ ] Overlay portals mount under `#theme-provider` and block lower layers.
- [ ] Responsive behavior checked at `sm`, `md`, `lg`, `xl`.
- [ ] New public API added to `src/components/index.ts` / `src/providers/index.ts`.
- [ ] README component table and SCSS export table updated when the API changes.
- [ ] `bun run build` succeeds; run `bun run typecheck` separately because the
      build does not type check.
