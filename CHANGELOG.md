# Changelog

All notable changes to Kitty are documented here.

## [Unreleased]

## [0.2.0] - 2026-11-26

### Added
- `Select` combobox with listbox options, type-ahead, and keyboard navigation.
- `FAB` and `FABMenu` with M3 sizes, extended/condensed/hidden states, and a portalled action menu.
- `Collapse` for measured auto-height and auto-width expand/collapse transitions.
- `ProgressIndicator` M3 linear and circular variants, `colorMode`, and optional `wave` geometry; it is now exported.
- `NavBar.PrimaryAction` and an optional rail-only `action` slot.
- TabBar `scrollable` modes: `true`, `"settle"`, `"lazy"`, and `false`.
- `useScrollBehavior` and `useTheme` hooks.
- Variant helpers (`colorClass`, `fillClass`, `sizeClass`, `variantClasses`) and shared types.
- Exported `AppBar`, `BottomSheet`, and `ProgressIndicator`.
- Project release skill and `bun run release` tooling.

### Changed
- Toast is now an M3 snackbar with a queue, hover/focus pause, and `useToast()`.
- NavBar uses M3 styling, accessible navigation semantics, and keyboard movement.
- TabBar follows the WAI-ARIA tabs pattern with roving focus and configurable swipe/mounting behavior.
- MultiContent slides in a direction or via a resolver and ignores unrelated re-renders.
- Modal supports `transitionSourceRef` to morph from the clicked trigger.
- Checkbox and RadioButton use native inputs with refreshed styles.
- Kitty is now a standalone Bun project; consumers install from a pinned git tag.
- Demo app rebuilt with per-component routes, a shared shell, theme switcher, and logo.
- README and Kitty skill refreshed; the screenshot gallery was removed.

### Breaking
- Variant props are now `colorMode`, `fill`, and `size`; old `color`/`mode` props are removed.
- `Input` no longer requires or uses `mode`.
- Toast actions are `{ label, onClick }`; `ToastContext` is internal, use `useToast()`.
- `Modal.bindButton` renamed to `transitionSourceRef`.

### Fixed
- Cleared the remaining TypeScript errors; `bun run typecheck` passes.
- Demo FAB clears the responsive bottom NavBar.
- Modal view transitions bind to the clicked trigger and fall back when unsupported.

### Removed
- `CSwitch`; use `Switch`.

## [0.1.0] - 2026-10-02

- Initial release.
