import { colorOptions, fillOptions, sizeOptions } from "./types";

/** Color role of an element (`primary`, `error`, …). */
export type ColorMode = colorOptions;
/** Surface treatment of an element (`fill`, `outline`, …). */
export type Fill = fillOptions;
/** Size of an element (`small`, `medium`, `large`). */
export type Size = sizeOptions;

/** Props that select the shared element variants. */
export type VariantProps = {
  /** Color role. */
  colorMode?: ColorMode;
  /** Surface treatment. */
  fill?: Fill;
  /** Size. */
  size?: Size;
};

/**
 * Builds the shared variant class name: `element--{value}`.
 * Color, fill and size values don't overlap, so they share one namespace.
 */
export const elementClass = (value?: string | false) =>
  value ? `element--${value}` : undefined;

export const colorClass = (colorMode?: ColorMode) => elementClass(colorMode);
export const fillClass = (fill?: Fill) => elementClass(fill);
export const sizeClass = (size?: Size) => elementClass(size);

/**
 * All variant class names for an element, ready to spread into `classNames`.
 *
 * ```tsx
 * classNames("button", variantClasses({ colorMode, fill, size }))
 * ```
 */
export const variantClasses = ({
  colorMode,
  fill,
  size,
}: VariantProps = {}) => [
  colorClass(colorMode),
  fillClass(fill),
  sizeClass(size),
];
