import { type breakPointType, breakPoints } from "../providers/theme/types";

export const mediaToClass = (media?: breakPointType) => {
  if (media === undefined) return false;
  if (typeof media === "string" && Object.values(breakPoints).includes(media)) {
    const className = [];
    for (const br of Object.values(breakPoints)) {
      className.push(br + "-to-" + media);
    }
    return className;
  }
  const className = [];
  for (const br of Object.values(breakPoints)) {
    className.push(br + "-to-" + (media[br] ?? br));
  }
  return className;
};
