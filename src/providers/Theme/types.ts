export enum fillOptions {
  fill = "fill",
  link = "link",
  outline = "outline",
  elevated = "elevated",
  tonal = "tonal",
}

export enum colorOptions {
  primary = "primary",
  error = "error",
  warning = "warning",
  success = "success",

  secondary = "secondary",
  tertiary = "tertiary",
  surface = "surface",
}

export enum sizeOptions {
  small = "small",
  medium = "medium",
  large = "large",
}

export enum breakPoints {
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
}

export type breakPointType = breakPoints | Partial<Record<breakPoints, breakPoints>>
