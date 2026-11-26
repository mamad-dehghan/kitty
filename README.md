# Kitty

A React 19 + TypeScript + SCSS design system. Kitty provides Material Design
3–style components, theme tokens, overlay providers, and small hooks. It is a
work in progress: components are added as the product needs them, so expect a
few rough edges and unfinished TODOs.

- **Runtime:** React 19, `classnames`, `@phosphor-icons/react`,
  `react-inlinesvg`, `typescript-cookie`
- **Styling:** SCSS with CSS custom properties (HSL triplet tokens), no CSS-in-JS
- **Build/demo:** Vite 6 with the SWC React plugin
- **Package entrypoints:** `lib.ts` (TypeScript) and `lib.scss` (SCSS)

## Table of contents

- [Getting started](#getting-started)
- [Using Kitty in an app](#using-kitty-in-an-app)
- [SCSS API](#scss-api)
- [Providers](#providers)
- [Theming and CSS tokens](#theming-and-css-tokens)
- [Components](#components)
- [Hooks](#hooks)
- [Shapes](#shapes)
- [Demo app](#demo-app)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Release](#release)
- [Development notes](#development-notes)

## Getting started

Kitty is a standalone Bun project. Install and run from this repository root
(`C:/Code/root/packages/kitty`):

```bash
bun install
bun run dev
```

The demo server runs Vite on <http://localhost:2000> and opens `/`. The
demo is a development harness; it is not part of the published package.

## Using Kitty in an app

Kitty is a private package consumed as a pinned git dependency. Pin a release
tag (or a commit hash) after `#`:

```json
{
  "dependencies": {
    "kitty": "git+https://github.com/mamad-dehghan/kitty.git#v0.2.0"
  }
}
```

Replace `v0.2.0` with the release you want. The consuming project's lockfile
pins the resolved commit; commit that lockfile. For a fully immutable
reference, use the commit hash instead of the tag:

```json
"kitty": "git+https://github.com/mamad-dehghan/kitty.git#<commit-sha>"
```

Import components and enums from the package root:

```tsx
import {
  Button,
  colorOptions,
  fillOptions,
  sizeOptions,
} from "kitty";
import { HeartIcon } from "@phosphor-icons/react";

export function FavoriteButton() {
  return (
    <Button
      colorMode={colorOptions.primary}
      fill={fillOptions.tonal}
      size={sizeOptions.medium}
      icon={<HeartIcon />}
      iconSide="start"
    >
      Favorite
    </Button>
  );
}
```

Import SCSS mixins/tokens through the exported subpaths when styling your own
app code:

```scss
@use "kitty/scss/typography" as typography;
@use "kitty/scss/elevation" as elevation;
@use "kitty/scss/palette" as palette;
@use "kitty/scss/breakpoint" as breakpoint;
@use "kitty/scss/animation" as animation;

.card {
  @include typography.titleMedium();
  @include elevation.elevation-2();
  @include palette.primaryTheme();
}
```

### SCSS API

The exported SCSS subpaths are declared in `package.json`:

| Import                  | File                                     |
| ----------------------- | ---------------------------------------- |
| `kitty/scss`            | `lib.scss` (forwards the theme modules)  |
| `kitty/scss/palette`    | `src/providers/Theme/palette.scss`       |
| `kitty/scss/typography` | `src/providers/Theme/typography.scss`    |
| `kitty/scss/elevation`  | `src/providers/Theme/elevation.scss`     |
| `kitty/scss/breakpoint` | `src/providers/Theme/breakpoint.scss`    |
| `kitty/scss/animation`  | `src/providers/Theme/animation.scss`     |

## Providers

Wrap the application once. `ThemeProvider` renders the `#theme-provider`
element that Kitty's portals mount into, so it must stay at the root.

```tsx
import { createRoot } from "react-dom/client";
import { ThemeProvider, ToastProvider, TooltipProvider } from "kitty";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <TooltipProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </TooltipProvider>
  </ThemeProvider>,
);
```

### `ThemeProvider`

| Prop             | Type                      | Description                                                        |
| ---------------- | ------------------------- | ------------------------------------------------------------------ |
| `children`       | `ReactNode`               | App tree.                                                          |
| `modify`         | `Partial<themeT>`         | Overrides theme hue variables.                                     |
| `forceDarkMode`  | `boolean`                 | Pins dark mode instead of reading the `darkMode` cookie.           |

- Nested `ThemeProvider`s inherit the parent theme and do not rewrite the
  `darkMode` cookie or the theme-color meta tag.
- Hues are numbers in `themeT`: `--primary-hue-theme`,
  `--secondary-hue-theme`, and `--tertiary-hue-theme`.
- The root provider applies the base palette (`.as-root`) plus
  `.light-theme` or `.dark-theme`.

### `TooltipProvider`

Renders the single tooltip layer and provides `TooltipContext`. It must be
present for `<Tooltip>` to work.

### `ToastProvider`

Provides `useToast()` and renders the snackbar layer. Only one toast is visible
at a time; additional toasts wait in a queue.

```tsx
import { useToast } from "kitty";

const { toast, closeToast, closeAllToasts } = useToast();

const id = toast("Changes saved", {
  action: { label: "Undo", onClick: undo },
});
```

`toast(content, options?)` returns the toast id.

| Option        | Type                 | Description                                                                          |
| ------------- | -------------------- | ------------------------------------------------------------------------------------ |
| `id`          | `string`             | Stable id; reusing it updates the toast and restarts its timer.                      |
| `duration`    | `number`             | Auto-dismiss delay in ms. `0` keeps it open. Default `5000`, or `10000` with an action. |
| `action`      | `{ label, onClick }` | Action button; activating it also dismisses the toast.                               |
| `dismissible` | `boolean`            | Shows the dismiss button. Default `true`.                                            |
| `closeLabel`  | `string`             | Accessible label for the dismiss button. Default `"Dismiss"`.                        |

The timer pauses while the toast is hovered or focused. `closeToast(id)` and
`closeAllToasts()` are also returned by the hook.

## Theming and CSS tokens

Kitty follows an M3-like token model. Colors are stored as **HSL component
triplets**, not complete colors:

```css
--primary-40: 260, 34%, 48%;
--background: var(--natural-99);
```

Use them with `hsl()`/`hsla()`:

```css
background: hsl(var(--primary));
color: hsl(var(--on-primary));
outline: 1px solid hsla(var(--outline), 0.5);
```

### Theme classes

| Class                        | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `.theme-provider`            | Base wrapper applied by `ThemeProvider`.  |
| `.theme-provider.as-root`    | Emits the base hue palette.               |
| `.theme-provider.light-theme`| Light role tokens.                        |
| `.theme-provider.dark-theme` | Dark role tokens.                         |

Role tokens include `--primary`, `--on-primary`, `--primary-container`,
`--on-primary-container`, and matching `secondary`, `tertiary`, `error`,
`warning`, `success`, `surface`, `surface-container`, `surface-variant`,
`outline`, and `inverse-*` roles. The numbered `--natural-*` and
`--natural-variant-*` scales supply the neutral roles.

### Element variant classes

Components translate their `colorMode`, `fill`, and `size` props into a single
`element--*` namespace:

- color: `element--primary`, `element--secondary`, `element--tertiary`,
  `element--error`, `element--warning`, `element--success`,
  `element--surface`
- fill: `element--fill`, `element--outline`, `element--tonal`,
  `element--elevated`, `element--link`
- size: `element--small`, `element--medium`, `element--large`

Fill and size values never overlap with color values, so one prefix is enough.
State modifiers use the same prefix (`element--focused`, `element--enabled`);
the native/visual disabled state stays `disabled`.
The same mapping is exported for custom components:

```tsx
import { colorClass, fillClass, sizeClass, variantClasses } from "kitty";

classNames("my-control", variantClasses({ colorMode, fill, size }));
// or individually: colorClass(colorMode), fillClass(fill), sizeClass(size)
```

Use the exported enums (`colorOptions`, `fillOptions`, `sizeOptions`) rather
than string literals. Components share the `colorMode` / `fill` / `size` prop names;
where a component only implements part of an enum (for example chip fills) the
prop type narrows to the supported values.

### Customizing hues

```tsx
<ThemeProvider
  modify={{
    "--primary-hue-theme": 210,
    "--secondary-hue-theme": 160,
    "--tertiary-hue-theme": 20,
  }}
>
  <App />
</ThemeProvider>
```

### Typography mixins

`displayLarge/Medium/Small`, `headlineLarge/Medium/Small`,
`titleLarge/Medium/Small`, `labelLarge/Medium/Small`,
`bodyLarge/Medium/Small`, and `ellipsisText`.

### Elevation mixins

`elevation-0` through `elevation-5` set background, text color, and the
paper overlay tint. Shadow-only variants are `elevation-shadow-0` through
`elevation-shadow-5`.

### Breakpoints

| Name | Range                       |
| ---- | --------------------------- |
| `sm` | `> -1px` and `<= 480px`     |
| `md` | `> 480px` and `<= 600px`    |
| `lg` | `> 600px` and `<= 800px`    |
| `xl` | `> 800px` and `<= 100vw`    |

SCSS: `@include breakpoint.apply-to-breakpoint(lg) { ... }` and
`@include breakpoint.with-size(lg) { ... }` (the latter generates
`sm-to-lg`, `md-to-lg`, etc. selectors).

TypeScript: `breakPoints` is exported as an enum, and components such as
`NavBar` accept a `media` map, for example
`media={{ md: breakPoints.lg }}`.

## Components

Everything below is exported from the package root (`lib.ts` →
`src/components/index.ts`) unless marked otherwise. Component-specific SCSS is
imported by each component, so consumers do not import component styles
manually.

### Actions

| Component     | Required props                          | Notes                                                                 |
| ------------- | --------------------------------------- | --------------------------------------------------------------------- |
| `Button`      | —                                       | `colorMode`, `fill`, `size` (`small \| medium \| large`), `icon`, `iconSide`, `fullWidth`, `disabled`. |
| `FAB`         | `Icon`                                  | `label` turns it into an extended FAB; `colorMode`, `size`, `hidden`, `condensed`. |
| `FABMenu`     | `Icon`, `items`                         | Fixed bottom-end menu with 2–6 actions, a 56px close button, and an M3 scrim. `label` extends the closed FAB; `hidden`/`condensed` affect the closed trigger. |
| `IconButton`  | `Icon`                                  | `colorMode`, `fill` (incl. `elevated`), `size`, `enable`, `dataFocused`. |
| `AssistChip`  | `assist` (true), `fill`                 | `fill` is `outline` or `elevated`; optional `Icon`, `iconSide`.       |
| `FilterChip`  | `enable`, `fill`                        | Shows a check icon when `enable`; optional custom `Icon`.             |
| `GroupButton` | `children`                              | Visual grouping only; `size` is `small \| medium \| large`.            |

```tsx
import { AssistChip, FilterChip, fillOptions } from "kitty";

<AssistChip assist fill={fillOptions.outline} Icon={PlusIcon}>
  Add item
</AssistChip>

<FilterChip enable={active} fill={fillOptions.elevated} onClick={toggle}>
  Filter
</FilterChip>
```

`FAB` is the M3 floating action button. Give an icon-only FAB an
`aria-label`; `label` creates an extended FAB. `condensed` collapses the label
back to a regular FAB, and `hidden` slides it out of view and sets `inert`.

```tsx
<FAB
  Icon={PlusIcon}
  label="Compose"
  colorMode={colorOptions.primary}
  condensed={scrolledDown}
  hidden={hidden}
/>

<FABMenu
  Icon={PencilSimpleIcon}
  colorMode={colorOptions.tertiary}
  triggerLabel="Open create menu"
  items={[
    { label: "New chat", Icon: UserIcon, onClick: newChat },
    { label: "New group", Icon: UsersThreeIcon, onClick: newGroup },
  ]}
/>
```

`FABMenu` owns its open/close state, focus management, Escape/backdrop
dismissal, and browser-back lock. It portals to `#theme-provider`, so the
`ThemeProvider` must be mounted. It is fixed to the viewport bottom-end; pass
`offsetBlock` when a bottom navigation or app bar is present, for example
`offsetBlock="calc(var(--bottom-bar-height, 0px) + 1rem)"`. M3 recommends
pairing the menu with an icon-only FAB; an extended `label` is supported for
custom patterns. Scroll
adaptivity is intentionally not baked into `FAB` or `FABMenu`; drive
`hidden`/`condensed` from any source. For convenience, `useScrollBehavior`
derives both states from a scroll container:

```tsx
const scroll = useScrollBehavior({
  target: scrollerRef, // defaults to window
  hideWhen: "down", // "down" | "up" | "distance" | false
  hideAfter: 64,
  condenseWhen: "down",
  condenseAfter: 8,
});

<FAB
  Icon={PlusIcon}
  label="Compose"
  hidden={scroll.hidden}
  condensed={scroll.condensed}
/>
```

CSS-only alternatives: `scroll-state(scrolled: block-end)` handles the
direction trigger in Chromium 144+, and scroll-driven animations
(`animation-timeline: scroll()`) handle a fixed distance threshold in current
browsers. Neither covers every target browser, which is why the demo uses the
small hook.

### Inputs

| Component        | Required props        | Notes                                                                                   |
| ---------------- | --------------------- | --------------------------------------------------------------------------------------- |
| `Input`          | `id`                  | `colorMode`, `fill`, `label`, `supportText`, `hasError`, `iconStart`, `iconEnd`, `fullWidth`. |
| `SearchInput`    | —                     | `colorMode` and `fill` default to `primary`/`outline`; supports start/end icons.               |
| `MultiItemInput` | `value`, `onChange`   | Tag input. Separates tags with spaces or commas; `onChange` receives the full string.     |
| `Checkbox`       | —                     | `colorMode` defaults to `primary`; native checkbox plus decorative icons; supports `indeterminate`. |
| `RadioButton`    | —                     | `colorMode` defaults to `primary`; native radio input with decorative icons.                   |
| `Switch`         | —                     | Controlled via the hidden input's `checked`/`onChange`; `checkedColorMode`, `uncheckedColorMode`, icon flags. |
| `Select`         | `options`             | Combobox + listbox. `value`/`defaultValue`, `onChange(value)`, `label`, `placeholder`, `colorMode`, `fill`, `fullWidth`, `name`, `disabled`, `required`. |

All input controls use the same `colorMode` / `fill` props:

```tsx
<Input
  id="email"
  colorMode={colorOptions.primary}
  fill={fillOptions.fill}
  label="Email"
  supportText="We never share it"
  hasError={invalid}
/>
```

Controlled `Checkbox`/`RadioButton` inputs are set to `readOnly` automatically
when they receive `checked` without an `onChange`.

`Select` implements the ARIA select-only combobox pattern: the trigger is a
`role="combobox"` button with `aria-expanded`, `aria-controls` and
`aria-activedescendant`; the popup is a portalled `role="listbox"` of
`role="option"` rows. Arrow keys, Home/End, Enter/Space, Escape, Tab and
type-ahead are supported. Always give it a visible `label` or an `aria-label`.

```tsx
<Select
  label="Priority"
  options={[
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high", icon: FireIcon },
  ]}
  value={priority}
  onChange={setPriority}
/>
```

### Display

| Component   | Required props | Notes                                                                      |
| ----------- | -------------- | -------------------------------------------------------------------------- |
| `Badge`     | `value`, `children` | Positions a badge with CSS anchor positioning. `colorMode` defaults to `error`; `maxValue` defaults to `999`. |
| `Divider`   | —              | `type` is `intent` (default), `center`, or `fullWidth`.                     |
| `Toast`     | `children`     | Presentational M3 snackbar; optional `action` (`{ label, onClick }`), `onClose` (dismiss button), `closeLabel`, and `isClosing`. |
| `LoadingIndicator` | —       | Cycles through SVG shapes; `size` defaults to `4rem`, `frame` defaults to `true`. |
| `ProgressIndicator` | `value` | `type` is `linear` (default) or `circular`; `max` defaults to `1`; `size` is `small`, `medium`, or `large`; `colorMode`; `wave` enables the M3 Expressive wavy geometry. |
| `Tooltip`   | `children`, `title` | Clones a single element and shows content on hover; requires `TooltipProvider`. |

`Tooltip` and `Badge` clone their child and need a single element (not a
`Fragment`). Give the child a stable layout wrapper.

Use `Tooltip` instead of native `title` attributes for hover hints. Native
`title` is not used in Kitty because it cannot be styled consistently and does
not work on touch. `TooltipProvider` must be mounted for `Tooltip` to work;
`NavBar` uses it for the rail toggle.

`ProgressIndicator` builds the flat linear layers with `::before` / `::after`
and `clip-path`; circular and wavy variants use inline SVG. It does not create
a shadow root. `wave` applies to both `linear` and `circular`, and the track
stays flat on the wavy linear variant to match Material 3.

### Navigation and layout

| Component  | Required props                  | Notes                                                                                       |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `NavBar`   | `items`, `initialActiveItem`    | Collapsible vertical nav; each item has `title`, `Icon`, `content`, optional `onClick`. `ariaLabel` names the nav; optional `action` adds a rail-only primary action. |
| `TabBar`   | `tabs`                          | Accessible tabs; each item has `title`, `PageContent`, optional `Icon` and `PageLoadder`. `scrollable` is `true` (native pages with swipe preview), `"settle"` (native pages, deferred mount), `"lazy"` (`MultiContent` plus swipe), or `false` (`MultiContent`, no swipe). |
| `Splitter` | `panels`, `layout`              | Exactly two panels; `minSize` strings use `px`; supports `hideable` and `grow`.               |
| `AppBar`   | `left`, `center`, `right`       | `center` is either `{ type: "search" }` or a heading block. |

`NavBar.media` and `mediaToClass` generate `sm-to-*`/`md-to-*`/etc. classes,
which can be styled with the breakpoint mixins.

`NavBar` renders a `nav` landmark named by `ariaLabel`. Destinations expose
`aria-current="page"` and support Home/End plus arrow-key movement. Pass
`action` to add an optional rail-only primary action:

```tsx
<NavBar
  ...
  action={<NavBar.PrimaryAction Icon={PencilSimpleIcon} label="New" />}
/>
```

`NavBar.PrimaryAction` wraps `FAB` and automatically condenses to an icon when
the rail is collapsed and extends its label when expanded. Give it a `label` or
an `aria-label` so the icon-only state keeps an accessible name. The action is
hidden in the bottom-bar layouts. The rail toggle uses `Tooltip`, so
`TooltipProvider` must be mounted.

`TabBar` follows the WAI-ARIA tabs pattern (`tablist` / `tab` / `tabpanel`,
roving `tabindex`, arrow keys, Home/End) and accepts `aria-label` or
`aria-labelledby` to name the tab list. Inactive pages render no content at
rest. During a preview swipe the adjacent page mounts temporarily; once
scrolling settles only the active page remains. `PageLoadder` is used as the
`Suspense` fallback while a page loads.

`scrollable` supports four modes:

- `true` — native horizontal pages with swipe preview. The current page stays
  mounted and one adjacent page mounts after ~24px or 80ms of movement.
- `"settle"` — native horizontal pages. Content mounts only when scrolling
  settles, so intermediate tabs are never mounted during a multi-tab jump.
- `"lazy"` — `MultiContent` plus horizontal swipe detection. Only the current
  page is mounted; the target page mounts after a deliberate swipe passes the
  distance/time threshold.
- `false` — no swiping; clicks and keyboard switch the active page through
  `MultiContent`.

Interactive controls and `[data-tabbar-no-swipe]` targets are ignored by the
`"lazy"` gesture detector.

### Helpers

| Component     | Required props    | Notes                                                                                       |
| ------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `Collapse`    | `isOpen`, `children` | Animates between a collapsed size and the content's auto height/width. `orientation`, `collapsedSize`, `duration="auto"`, `easing`, `unmountOnExit`, `onOpened`, `onClosed`. |
| `MenuItem`    | `title`           | Standalone menu row; `LeadingIcon`, `TrailingIcon`, `onClick`, `disable`.                    |
| `PlaceFinder` | —                 | Positions a container against a `DOMRect`; accepts `targetEl`, `position`, `margins`, `disablePositioning`. |
| `MultiContent`| `transitionTo`, `children`, `width`, `height` | Slides a single child when its content changes. `transitionTo` is a direction or `(prev, next) => direction`. |

`Collapse` is a controlled motion primitive for expandable content. It
measures the child's natural size, so auto-height (and auto-width) content
transitions correctly even when `unmountOnExit` had removed it.
`duration="auto"` scales the duration with the measured size; pass a number to
fix it. With `collapsedSize` at zero, closed content becomes
`visibility: hidden` and `inert`, so it leaves the tab order, cannot receive
pointer events, and is removed from the accessibility tree while keeping its
state. A non-zero `collapsedSize` leaves a visible preview interactive; keep
focusable controls out of the clipped portion.

Pair it with a button that owns `aria-expanded` and `aria-controls` (the
Material 3 expandable-list pattern):

```tsx
const [open, setOpen] = useState(false);
const id = useId();

<button
  aria-expanded={open}
  aria-controls={`${id}-panel`}
  onClick={() => setOpen((value) => !value)}
>
  Details
</button>
<Collapse isOpen={open} id={`${id}-panel`} role="region">
  <p>Auto-height content...</p>
</Collapse>
```

`PlaceFinder` is the collision-aware positioning primitive behind `Menu`. It
returns a positioned `<div>` and is safe to use for custom popovers.

`MultiContent` requires explicit `width`/`height`; both the outgoing and the
incoming child fill that box. `transitionTo` is where the outgoing content
travels (`"left" | "right" | "top" | "bottom"`) or a resolver called with the
previous and next child when the content changes. Give the child a stable `key`
to make change detection exact and cheap; without a key the component compares
the rendered values, so unrelated parent re-renders do not animate.

### Overlays

All overlays portal into `#theme-provider`, block lower layers with
`AppLayer`, and integrate with browser history.

| Component     | Required props        | Notes                                                                                       |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| `Drawer`      | `direction`, `onClose`| `direction` is `left \| right \| top \| bottom`; `isOpen` defaults to `true`.                |
| `Modal`       | `isOpen`, `onClose`, `children` | Optional `transitionSourceRef` morphs the dialog from/to the element that opened it. Uses `document.startViewTransition`; compose with `Modal.Title`, `Modal.HelpText`, `Modal.Body`, `Modal.Actions`. |
| `Menu`        | `isOpen`, `onClose`, `items` | Needs `targetEl` (a `DOMRect`) or it renders nothing. Items are action items, nested items, or `"separator"`. |
| `BottomSheet` | `open`, `onClose`, `children` | Pull-down sheet; closes when the wrapper is scrolled back to the top. |
| `AppLayer`    | —                     | Low-level overlay wrapper. `blockBottomLayers` locks history; `closeOnEscape` calls `onClose`. |

`Menu` example:

```tsx
const [target, setTarget] = useState<DOMRect>();

<IconButton
  Icon={DotsThreeIcon}
  size={sizeOptions.small}
  fill={fillOptions.link}
  onClick={(event) => setTarget(event.currentTarget.getBoundingClientRect())}
/>

<Menu
  isOpen={Boolean(target)}
  onClose={() => setTarget(undefined)}
  targetEl={target}
  items={[
    { label: "Edit", leadingIcon: PencilIcon, onClick: edit },
    "separator",
    { label: "Delete", leadingIcon: TrashIcon, onClick: remove },
  ]}
/>
```

## Hooks

| Hook                     | Description                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `useDeferredState`       | Delays a value update, used by overlays to keep exit animations mounted.                         |
| `useScrollBehavior`      | Tracks a scroll container and returns `{ direction, hidden, condensed }` for FAB-style components. |
| `useTheme`               | Returns `{ theme, overrideTheme, darkMode, setDarkMode }` from `ThemeProvider`.                  |
| `useToast`               | Snackbar queue API: `{ toast, closeToast, closeAllToasts }`. See ToastProvider above.             |
| `useHistoryLock`         | Locks a layer to the browser back button. Returns `{ lock, unlock }` and accepts a release callback. |
| `useHistoryLockAbility`  | Installs the global `popstate` listener. Mount it once at the app root (`router.tsx` does this). |

Overlay components call `useHistoryLock` internally. If you build a custom
layer on `AppLayer`, use `blockBottomLayers` and make sure
`useHistoryLockAbility()` is mounted at the app root.

## Shapes

All SVGs in `src/assets/shapes` are exported as URL strings under the `Shapes`
namespace, suitable for `react-inlinesvg` or `<img src>`:

```tsx
import SVG from "react-inlinesvg";
import { Shapes } from "kitty";

<SVG src={Shapes.heart} />
```

Available names include `arch`, `arrow`, `boom`, `bun`, `burst`, `circle`,
`clamshell`, `diamond`, `fan`, `flower`, `gem`, `ghostish`, `heart`, `oval`,
`pentagon`, `pill`, `pixel_triangle`, `pixel_circle`, `puffy`,
`puffy_diamond`, `slanted`, `soft_boom`, `soft_burst`, `square`, `sunny`,
`triangle`, `very_sunny`, and the `_4_side_cookie`, `_6_side_cookie`,
`_7_side_cookie`, `_9_side_cookie`, `_12_side_cookie`,
`_4_leaf_clover`, `_8_leaf_clover` families.

## Demo app

`src/DemoShell.tsx` wraps every route with the shared header, logo link, and
theme toggle. `src/App.tsx` renders the tabbed overview inside it, and
`src/router.tsx` owns the routes:

| Category        | Routes                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Actions         | `/button`, `/icon-button`, `/fab`, `/chip`, `/group-button` |
| Inputs          | `/input`, `/search-input`, `/multi-item-input`, `/checkbox`, `/radio-button`, `/switch`, `/select` |
| Display         | `/badge`, `/divider`, `/toast`, `/loading-indicator`, `/progress-indicator`, `/tooltip` |
| Navigation      | `/app-bar`, `/nav-bar`, `/tab-bar`, `/splitter`     |
| Overlays        | `/modal`, `/drawer`, `/menu`, `/bottom-sheet`       |
| Helpers         | `/place-finder`, `/collapse`, `/multi-content`                |

`/` renders the tabbed overview. Demos are registered once in
`src/demos/registry.tsx`; `App.tsx` builds the NavBar/TabBar sections from it
and `router.tsx` derives the routes. Adding a component means adding a demo
file and one registry entry. The theme toggle in `DemoShell` uses `Tooltip`, so
`TooltipProvider` must be mounted in the demo root.

## Project structure

```text
packages/kitty/
├── lib.ts                  # package entry: components, hooks, providers, shapes
├── lib.scss                # package SCSS entry (forwards theme modules)
├── CHANGELOG.md            # curated release notes
├── index.html              # Vite demo HTML
├── opencode.json           # registers .skills with OpenCode
├── vite.config.ts          # dev server on :2000, opens /
├── .skills/                # project-local OpenCode skills (kitty-design-system, release)
├── scripts/                # release tooling and tests
├── src/
│   ├── App.tsx             # tabbed demo overview
│   ├── DemoShell.tsx       # shared demo header, logo link, theme toggle
│   ├── DemoShell.scss
│   ├── main.tsx            # demo root providers
│   ├── router.tsx          # demo routes + history-lock listener
│   ├── components/         # one folder per component
│   │   ├── AppBar/         # AppBar.tsx + AppBar.scss
│   │   ├── Badge/
│   │   ├── BottomSheet/
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── Chip/           # AssistChip.tsx, FilterChip.tsx, index.ts
│   │   ├── Collapse/
│   │   ├── Divider/
│   │   ├── Drawer/
│   │   ├── FAB/            # FAB.tsx, FABMenu.tsx, index.ts
│   │   ├── GroupButton/
│   │   ├── IconButton/
│   │   ├── Input/
│   │   ├── LoadingIndicator/
│   │   ├── Menu/           # Menu.tsx, MenuItem.tsx, DrawerMenu.tsx
│   │   ├── Modal/
│   │   ├── MultiContent/
│   │   ├── MultiItemInput/
│   │   ├── NavBar/
│   │   ├── PlaceFinder/    # PlaceFinder.tsx + finder.ts
│   │   ├── ProgressIndicator/
│   │   ├── RadioButton/
│   │   ├── SearchInput/
│   │   ├── Select/
│   │   ├── Splitter/
│   │   ├── Switch/
│   │   ├── TabBar/
│   │   ├── Toast/
│   │   ├── Tooltip/
│   │   └── index.ts        # component barrel
│   ├── providers/          # AppLayer/, Theme/, Toast/, Tooltip/
│   ├── hooks/              # useDeferredState, useHistoryLock, useScrollBehavior
│   ├── assets/shapes/      # SVG shapes
│   ├── styles/             # globals only
│   └── demos/              # demo pages + registry.tsx + DemoLayout
└── tsconfig.json
```

## Scripts

| Script          | Command        | Notes                                              |
| --------------- | -------------- | -------------------------------------------------- |
| `dev`           | `vite`         | Demo server on port 2000, strict port.             |
| `build`         | `vite build`   | Bundles the demo. Does **not** run `tsc`.          |
| `preview`       | `vite preview` | Serves the built demo.                             |
| `typecheck`     | `tsc --noEmit` | Full TypeScript check.                             |
| `test`          | `bun test`     | Runs the release script tests.                     |
| `release`       | `bun run release <patch\|minor\|major>` | Bumps, promotes the changelog, commits, and tags; does not push. |

Run them from this repository root with `bun run <script>`.

## Release

Kitty is released by git tag, not npm. The project skill at
`.skills/release/SKILL.md` reviews changes since the last tag and curates
`CHANGELOG.md`; `scripts/release.ts` performs the mechanical release.

```bash
bun run release minor --dry-run
bun run release minor
```

The script verifies `main` and a clean tree (except `CHANGELOG.md`), runs
typecheck and build, bumps `package.json`, promotes `## [Unreleased]` in
`CHANGELOG.md`, commits `chore: release vX.Y.Z`, and creates annotated tag
`vX.Y.Z`. It stops before pushing.

```bash
git push origin main
git push origin vX.Y.Z
gh release create vX.Y.Z --generate-notes
```

Then update the dependency pin and verify a clean consumer install. See
`.skills/release/SKILL.md` for the full checklist.

## Development notes

- **Type-check separately.** `build` only transpiles. Run
  `bun run typecheck` for the full TypeScript check; it should pass.
- **Barrel exports matter.** `lib.ts` re-exports `src/components/index.ts`;
  add new public components there. `MultiContentCss` stays internal, and
  `ToastContext` stays internal behind the public `useToast()` hook.
- **Keep enums and classes in sync.** New `colorOptions` values need matching
  `element--*` class handling in each component and palette roles.
- **Scoped SCSS.** Each component imports its own SCSS file. Add new shared
  tokens to the theme modules and expose them through the SCSS subpath exports.
- **Overlays need `#theme-provider`.** If you render outside `ThemeProvider`,
  portals will fail because `document.getElementById("theme-provider")` is
  `null`.
- **Browser APIs.** `Modal` and `MultiContentCss` call
  `document.startViewTransition`; provide a fallback or only mount them in
  browsers that support it.
- **Icons come from Phosphor.** Keep icon props typed as `Icon` from
  `@phosphor-icons/react` and render with a `weight`.
- **Fixed demo UI and the bottom NavBar.** The home route uses a 64px bottom
  NavBar at `sm`/`md`/`lg`. Fixed page-level UI such as `FABMenu` must clear it;
  the FAB demo does this with `offsetBlock` and `--demo-bottom-bar-height`.
- **Local skills.** `.skills/kitty-design-system` and `.skills/release` are
  registered for OpenCode by `opencode.json`; keep the config if you want the
  skills available.
