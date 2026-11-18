import { useEffect, useState } from "react";

export const useDeferredState = <T,>(
  value: T,
  timeoutMs: number,
  initalValue?: T,
) => {
  const [copyValue, SetCopyValue] = useState<T>(initalValue ?? value);
  useEffect(() => {
    setTimeout(SetCopyValue, timeoutMs, value);
  }, [timeoutMs, value]);

  return copyValue;
};
