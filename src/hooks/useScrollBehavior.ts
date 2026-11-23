import { type RefObject, useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | "idle";

/**
 * When a scroll state becomes active:
 * - `down` / `up`: while the last scroll direction matches.
 * - `distance`: whenever the scroll offset is greater than the threshold.
 * - `false`: never.
 */
export type ScrollTrigger = "down" | "up" | "distance" | false;

export type ScrollTarget =
  Window | HTMLElement | RefObject<HTMLElement | null> | null;

export type ScrollBehaviorOptions = {
  /** Scroll container to observe. Defaults to the window. */
  target?: ScrollTarget;
  /** Minimum movement in px before the direction flips. @default 8 */
  threshold?: number;
  /** State change for `hidden`. @default "down" */
  hideWhen?: ScrollTrigger;
  /** Scroll offset required before `hidden` becomes true. @default 64 */
  hideAfter?: number;
  /** State change for `condensed`. @default "down" */
  condenseWhen?: ScrollTrigger;
  /** Scroll offset required before `condensed` becomes true. @default 0 */
  condenseAfter?: number;
  /** Disables the listener and returns an idle state. @default true */
  enabled?: boolean;
};

export type ScrollBehaviorState = {
  direction: ScrollDirection;
  hidden: boolean;
  condensed: boolean;
};

const idleState: ScrollBehaviorState = {
  direction: "idle",
  hidden: false,
  condensed: false,
};

const resolveTarget = (
  target: ScrollTarget | undefined,
): Window | HTMLElement | null => {
  if (typeof window === "undefined") return null;
  if (!target) return window;
  if (target === window) return window;
  if ("current" in target) return target.current;
  return target;
};

const resolveFlag = (
  trigger: ScrollTrigger,
  direction: ScrollDirection,
  scrollTop: number,
  after: number,
) => {
  if (trigger === false) return false;
  if (trigger === "distance") return scrollTop > after;
  if (trigger === "down") {
    return direction === "down" && scrollTop > after;
  }
  return direction === "up" && scrollTop > after;
};

/**
 * Tracks a scroll container and derives the `hidden` / `condensed` states used
 * by FAB-style components. It is intentionally independent from `FAB` and
 * `FABMenu` so consumers can drive those states from any source.
 */
export const useScrollBehavior = ({
  target,
  threshold = 8,
  hideWhen = "down",
  hideAfter = 64,
  condenseWhen = "down",
  condenseAfter = 0,
  enabled = true,
}: ScrollBehaviorOptions = {}): ScrollBehaviorState => {
  const [state, setState] = useState<ScrollBehaviorState>(idleState);
  const frame = useRef(0);
  const lastY = useRef(0);
  const directionRef = useRef<ScrollDirection>("idle");

  useEffect(() => {
    if (!enabled) return;
    const scrollTarget = resolveTarget(target);
    if (!scrollTarget) return;

    const isWindow = scrollTarget === window;
    const element = isWindow ? null : (scrollTarget as HTMLElement);
    const readScrollTop = () =>
      isWindow ? window.scrollY : (element?.scrollTop ?? 0);

    lastY.current = readScrollTop();
    directionRef.current = "idle";

    const evaluate = () => {
      frame.current = 0;
      const y = readScrollTop();
      const delta = y - lastY.current;
      let direction = directionRef.current;

      if (y <= 0) {
        direction = "idle";
        lastY.current = 0;
      } else if (Math.abs(delta) >= threshold) {
        direction = delta > 0 ? "down" : "up";
        lastY.current = y;
      }

      directionRef.current = direction;

      const hidden = resolveFlag(hideWhen, direction, y, hideAfter);
      const condensed = resolveFlag(condenseWhen, direction, y, condenseAfter);

      setState((previous) =>
        previous.direction === direction &&
        previous.hidden === hidden &&
        previous.condensed === condensed
          ? previous
          : { direction, hidden, condensed },
      );
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(evaluate);
    };

    if (isWindow) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      element?.addEventListener("scroll", onScroll, { passive: true });
    }

    evaluate();

    return () => {
      if (isWindow) {
        window.removeEventListener("scroll", onScroll);
      } else {
        element?.removeEventListener("scroll", onScroll);
      }
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [
    target,
    threshold,
    hideWhen,
    hideAfter,
    condenseWhen,
    condenseAfter,
    enabled,
  ]);

  return enabled ? state : idleState;
};
