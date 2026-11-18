import { type breakPointType, breakPoints } from "./types";

export const mediaToClass = (media?: breakPointType) => {
  if (media === undefined) return false;

  const breakpointValues = Object.values(breakPoints);

  if (typeof media === "string") {
    if (!breakpointValues.includes(media)) return false;
    return breakpointValues.map((breakpoint) => `${breakpoint}-to-${media}`);
  }

  return breakpointValues.map(
    (breakpoint) => `${breakpoint}-to-${media[breakpoint] ?? breakpoint}`,
  );
};
