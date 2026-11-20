# Kitty

A React 19 + TypeScript + SCSS design system used by the packages in this
workspace. Kitty provides Material Design 3–style components,
theme tokens, overlay providers, and small hooks. It is a work in progress:
components are added as the product needs them, so expect a few rough edges and
unfinished TODOs.

- **Runtime:** React 19, `classnames`, `@phosphor-icons/react`,
  `react-inlinesvg`, `typescript-cookie`
- **Styling:** SCSS with CSS custom properties (HSL triplet tokens), no CSS-in-JS
- **Build/demo:** Vite 6 with the SWC React plugin
- **Package entrypoints:** `lib.ts` (TypeScript) and `lib.scss` (SCSS)

## Table of contents

- [Getting started](#getting-started)
- [Using Kitty in an app](#using-kitty-in-an-app)
- [SCSS API](#scss-api)
- [Component gallery](#component-gallery)
- [Providers](#providers)
- [Theming and CSS tokens](#theming-and-css-tokens)
- [Components](#components)
- [Hooks](#hooks)
- [Shapes](#shapes)
- [Demo app](#demo-app)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Development notes](#development-notes)

## Getting started

Kitty lives in a Bun workspace. Install and run from the repository root
(`C:/Code/root`), not from this package:

```bash
bun install
bun run --cwd packages/kitty dev
```

The demo server runs Vite on <http://localhost:2000> and opens `/`. The
demo is a development harness; it is not part of the published package.

## Using Kitty in an app

Kitty is a private workspace package, so consumers use a workspace dependency
instead of a registry version:

```json
{
  "dependencies": {
    "kitty": "workspace:*"
  }
}
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

## Component gallery

These captures show selected Kitty components and their variants. The
interactive versions live in the demo pages under `src/demos/`.

### Buttons

Light theme, fill and color variants:

![Buttons with different fills and colors](https://ik.imagekit.io/zdldazk95/taski/Group%2011__O0IaiyBO.png?updatedAt=1709930042381)

Full width:

![Full-width buttons](https://ik.imagekit.io/zdldazk95/taski/chrome_QPHmTzRO7b_VhF0yG6R-.png?updatedAt=1709930041943)

With icons:

![Buttons with icons](https://ik.imagekit.io/zdldazk95/taski/Group%2013_sGHtKatIa.png?updatedAt=1709930039406)

Dark theme and accessibility states:

![Button dark theme and accessibility states](https://ik.imagekit.io/zdldazk95/taski/Group%2012_aVmzNYfOu.png?updatedAt=1709930038283)

### Icon buttons

Light and dark themes, active/inactive states, and colors:

![Icon buttons with fill and color variants](https://ik.imagekit.io/zdldazk95/taski/Group%2019_aa20sW6CW.png?updatedAt=1709930037394)

Outline and tonal fills:

![Icon buttons with outline and tonal fills](https://ik.imagekit.io/zdldazk95/taski/Group%2018_Ltkz8Kp4M.png?updatedAt=1709930036377)

### Group button

Colors, fills, icons, disabled states, and accessibility:

![Grouped buttons with fills, icons, and disabled states](https://ik.imagekit.io/zdldazk95/taski/Group%2021_MftABGYe2.png?updatedAt=1709930037117)

### Filter chip

Active/inactive states, icons, disabled states, and accessibility:

![Filter chips in active, disabled, and icon variants](https://ik.imagekit.io/zdldazk95/taski/Group%2022_63ajo-Sy0.png?updatedAt=1709930035550)

### Radio and checkbox

Radio button colors and accessibility:

![Radio button color variants](https://ik.imagekit.io/zdldazk95/taski/Group%2024_zcdvmO1_n.png?updatedAt=1709930032672)

Checkbox colors and states:

![Checkbox color and state variants](https://ik.imagekit.io/zdldazk95/taski/Group%2023_9XapF0IU_.png?updatedAt=1709930033594)

### Switch

Colors, icons, and accessibility:

![Switch color and icon variants](https://ik.imagekit.io/zdldazk95/taski/Group%2025_I1lLACoF8.png?updatedAt=1709930028702)

### Input

Light theme — colors, icons, support text, and the error state:

![Inputs in light mode](https://ik.imagekit.io/zdldazk95/taski/chrome_qV1YhFqRq1-1_leE4j94se.png?updatedAt=1709930017405)

Dark theme:

![Inputs in dark mode](https://ik.imagekit.io/zdldazk95/taski/chrome_qV1YhFqRq1_icjk4u1ne.png?updatedAt=1709930024612)

### Badge

Light theme:

![Badges in light mode](https://ik.imagekit.io/zdldazk95/taski/chrome_X8cgbmNruv%201_PjNSk3Y_z.png?updatedAt=1709930033584)

Dark theme:

![Badges in dark mode](https://ik.imagekit.io/zdldazk95/taski/chrome_X8cgbmNruv%202_0MFfFL77e.png?updatedAt=1709930033587)

### Divider

![Divider variants](https://ik.imagekit.io/zdldazk95/taski/Group%2026_HPish0ikL.png?updatedAt=1709930027049)

### Menu

Light and dark themes, icons, and nested menus:

![Menu variants](https://ik.imagekit.io/zdldazk95/taski/Group%2029_khrhFY2wH.png?updatedAt=1709930027070)

![Nested menu variants](https://ik.imagekit.io/zdldazk95/taski/Group%2028_FBfo9--E9.png?updatedAt=1709930025630)

### Tag input

`MultiItemInput` in its light-theme variants:

![Tag input variants](https://ik.imagekit.io/zdldazk95/taski/Group%2031_AOS0Cs0Jx.png?updatedAt=1709930023047)

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

Provides `ToastContext` and renders the toast stack. `ToastContext` is not
re-exported from `lib.ts` yet; inside this package, import it from its module:

```tsx
import { useContext } from "react";
import { ToastContext } from "./toast/toast_context";

const { toast } = useContext(ToastContext);
toast("saved", "Changes saved", colorOptions.success);
```

To make it available to consumers, add
`export { ToastContext } from "./toast/toast_context";` to
`src/providers/index.ts`.

Toasts dismiss automatically after 5 seconds. `toast` takes
`(id, content, severity)`; `closeToast(id)` and `closeAllToasts()` are also
available on the context.

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
`warning`, `success`, `surface`, `surface-variant`, `outline`, and
`inverse-*` roles. The numbered `--natural-*` and
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
| `Toast`     | `children`     | Presentational toast; `action` is `{ content, onClick, position, colorMode }`. |
| `LoadingIndicator` | —       | Cycles through SVG shapes; `size` defaults to `4rem`, `frame` defaults to `true`. |
| `ProgressIndicator` | `type`, `value` | `type` is `linear` or `circular`; `max` defaults to `1`; `size` is `small`, `medium`, or `large`. |
| `Tooltip`   | `children`, `title` | Clones a single element and shows content on hover; requires `TooltipProvider`. |

`Tooltip` and `Badge` clone their child and need a single element (not a
`Fragment`). Give the child a stable layout wrapper.

### Navigation and layout

| Component  | Required props                  | Notes                                                                                       |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `NavBar`   | `items`, `initialActiveItem`    | Collapsible vertical nav; each item has `title`, `Icon`, `content`, optional `onClick`.       |
| `TabBar`   | `tabs`                          | Swipeable tabs; each tab has `title`, `PageContent`, optional `Icon` and `PageLoadder`.       |
| `Splitter` | `panels`, `layout`              | Exactly two panels; `minSize` strings use `px`; supports `hideable` and `grow`.               |
| `AppBar`   | `left`, `center`, `right`       | `center` is either `{ type: "search" }` or a heading block. |

`NavBar.media` and `mediaToClass` generate `sm-to-*`/`md-to-*`/etc. classes,
which can be styled with the breakpoint mixins.

### Helpers

| Component     | Required props    | Notes                                                                                       |
| ------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `MenuItem`    | `title`           | Standalone menu row; `LeadingIcon`, `TrailingIcon`, `onClick`, `disable`.                    |
| `PlaceFinder` | —                 | Positions a container against a `DOMRect`; accepts `targetEl`, `position`, `margins`, `disablePositioning`. |
| `MultiContent`| `transitionTo`, `children`, `width`, `height` | Cross-fades/slides a single child when it changes.                             |

`PlaceFinder` is the collision-aware positioning primitive behind `Menu`. It
returns a positioned `<div>` and is safe to use for custom popovers.

### Overlays

All overlays portal into `#theme-provider`, block lower layers with
`AppLayer`, and integrate with browser history.

| Component     | Required props        | Notes                                                                                       |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| `Drawer`      | `direction`, `onClose`| `direction` is `left \| right \| top \| bottom`; `isOpen` defaults to `true`.                |
| `Modal`       | `isOpen`, `onClose`, `children` | Uses `document.startViewTransition`; compose with `Modal.Title`, `Modal.HelpText`, `Modal.Body`, `Modal.Actions`. |
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

`src/App.tsx` and `src/router.tsx` render a demo shell with routes at the
root:

| Category        | Routes                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Actions         | `/button`, `/icon-button`, `/chip`, `/group-button` |
| Inputs          | `/input`, `/search-input`, `/multi-item-input`, `/checkbox`, `/radio-button`, `/switch`, `/select` |
| Display         | `/badge`, `/divider`, `/toast`, `/loading-indicator`, `/progress-indicator`, `/tooltip` |
| Navigation      | `/app-bar`, `/nav-bar`, `/tab-bar`, `/splitter`     |
| Overlays        | `/modal`, `/drawer`, `/menu`, `/bottom-sheet`       |
| Helpers         | `/place-finder`, `/multi-content`                             |

`/` renders the tabbed overview. Demos are registered once in
`src/demos/registry.tsx`; `App.tsx` builds the NavBar/TabBar sections from it
and `router.tsx` derives the routes, so adding a component means adding a demo
file and one registry entry.

## Project structure

```text
packages/kitty/
├── lib.ts                  # package entry: components, hooks, providers, shapes
├── lib.scss                # package SCSS entry (forwards theme modules)
├── index.html              # Vite demo HTML
├── vite.config.ts          # dev server on :2000, opens /
├── src/
│   ├── App.tsx             # demo shell
│   ├── main.tsx            # demo root providers
│   ├── router.tsx          # demo routes + history-lock listener
│   ├── components/         # one folder per component
│   │   ├── AppBar/         # AppBar.tsx + AppBar.scss
│   │   ├── Badge/
│   │   ├── BottomSheet/
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── Chip/           # AssistChip.tsx, FilterChip.tsx, index.ts
│   │   ├── Divider/
│   │   ├── Drawer/
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
│   ├── hooks/              # useDeferredState, useHistoryLock
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
| `lint`          | `eslint .`     | Uses the repository ESLint setup when available.   |

Run them from the workspace root with
`bun run --cwd packages/kitty <script>`.

## Development notes

- **No type-check in `build`.** Vite transpiles without type checking. The
  package currently reports pre-existing `tsc --noEmit` errors (notably in
  `PlaceFinder/finder.ts`, `Splitter.tsx`, `TabBar.tsx`, and a few
  `verbatimModuleSyntax` imports). Avoid treating a successful Vite build as a
  clean type check.
- **Barrel exports matter.** `lib.ts` re-exports `src/components/index.ts`;
  add new public components there. Some components (`AppBar`, `BottomSheet`,
  `ProgressIndicator`) exist but are not exported yet.
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
