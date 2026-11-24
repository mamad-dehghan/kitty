import classNames from "classnames";
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./Collapse.scss";

export type CollapseOrientation = "vertical" | "horizontal";

export interface ICollapseProps
  extends Omit<ComponentPropsWithRef<"div">, "children"> {
  /** Controls whether the content is expanded. */
  isOpen: boolean;
  children?: ReactNode;
  /** @default "vertical" */
  orientation?: CollapseOrientation;
  /**
   * Height (vertical) or width (horizontal) that stays visible while collapsed.
   * At zero, the collapsed subtree is also made inert.
   * @default 0
   */
  collapsedSize?: number | string;
  /**
   * Transition duration in milliseconds. `"auto"` derives the duration from
   * the measured content size.
   * @default "auto"
   */
  duration?: number | "auto";
  /** @default "cubic-bezier(0.2, 0, 0, 1)" */
  easing?: string;
  /** Remove the content after the exit transition. @default false */
  unmountOnExit?: boolean;
  /** Called after the content has fully expanded. */
  onOpened?: () => void;
  /** Called after the content has fully collapsed. */
  onClosed?: () => void;
}

type CollapseStage = "entered" | "entering" | "exited" | "exiting";

const STANDARD_EASING = "cubic-bezier(0.2, 0, 0, 1)";
const COLLAPSED_SIZE_PROPERTY = "--collapse-collapsed-size";
const TRANSITION_FALLBACK_MS = 80;

const toCssSize = (size: number | string) =>
  typeof size === "number" ? `${Math.max(0, size)}px` : size;

const isZeroSize = (size: string) => {
  const value = Number.parseFloat(size);
  return Number.isFinite(value) && value <= 0;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * MUI-compatible size-to-duration curve used by `duration="auto"`. Taller
 * content takes a little longer, while short rows still feel responsive.
 */
const getAutoDuration = (size: number) => {
  if (size <= 0) return 0;
  const constant = size / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
};

export const Collapse = ({
  isOpen,
  children,
  orientation = "vertical",
  collapsedSize = 0,
  duration = "auto",
  easing = STANDARD_EASING,
  unmountOnExit = false,
  onOpened,
  onClosed,
  className,
  style,
  ref,
  inert: inertProp,
  ...rest
}: ICollapseProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const previousOpenRef = useRef(isOpen);
  const generationRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const endHandlerRef = useRef<((event: TransitionEvent) => void) | null>(
    null,
  );
  const callbacksRef = useRef({ onOpened, onClosed });
  callbacksRef.current = { onOpened, onClosed };

  const [stage, setStage] = useState<CollapseStage>(
    isOpen ? "entered" : "exited",
  );
  const [mounted, setMounted] = useState(isOpen || !unmountOnExit);

  const isVertical = orientation === "vertical";
  const collapsedSizeCss = toCssSize(collapsedSize);
  const collapsedIsZero = isZeroSize(collapsedSizeCss);
  const collapsedPixelSize = collapsedSizeCss.trim().endsWith("px")
    ? Number.parseFloat(collapsedSizeCss)
    : null;
  const axis = isVertical ? "height" : "width";

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const clearPending = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const root = rootRef.current;
    const handler = endHandlerRef.current;
    if (root && handler) {
      root.removeEventListener("transitionend", handler);
    }
    endHandlerRef.current = null;
  };

  const getCurrentSize = () => {
    const root = rootRef.current;
    return root ? root.getBoundingClientRect()[axis] : 0;
  };

  /**
   * The wrapper overflows the collapsed root, so its client size is the
   * natural content size even while the root is at its collapsed size. For
   * horizontal content it is temporarily taken out of flow so auto width does
   * not resolve against the collapsed parent width.
   */
  const measureContent = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return 0;

    if (isVertical) {
      return wrapper.clientHeight;
    }

    const previousPosition = wrapper.style.position;
    wrapper.style.position = "absolute";
    const size = wrapper.clientWidth;
    wrapper.style.position = previousPosition;
    return size;
  };

  const resolveDuration = (size: number) =>
    duration === "auto" ? getAutoDuration(size) : Math.max(0, duration);

  const finish = (nextStage: "entered" | "exited") => {
    clearPending();

    const root = rootRef.current;
    if (root) {
      root.style.transitionDuration = "";
      root.style.transitionTimingFunction = "";
      root.style.removeProperty(axis);
    }

    setStage(nextStage);

    if (nextStage === "entered") {
      callbacksRef.current.onOpened?.();
    } else {
      if (unmountOnExit) {
        setMounted(false);
      }
      callbacksRef.current.onClosed?.();
    }
  };

  const scheduleFinish = (
    generation: number,
    ms: number,
    nextStage: "entered" | "exited",
  ) => {
    const root = rootRef.current;
    if (!root) return;

    const handleEnd = (event: TransitionEvent) => {
      if (event.target !== root) return;
      if (event.propertyName !== axis) return;
      if (generation !== generationRef.current) return;
      finish(nextStage);
    };

    endHandlerRef.current = handleEnd;
    root.addEventListener("transitionend", handleEnd);
    timerRef.current = window.setTimeout(() => {
      if (generation !== generationRef.current) return;
      finish(nextStage);
    }, ms + TRANSITION_FALLBACK_MS);
  };

  const startEnter = () => {
    clearPending();
    generationRef.current += 1;
    const generation = generationRef.current;
    const root = rootRef.current;
    const startSize = root ? getCurrentSize() : 0;

    setMounted(true);
    setStage("entering");

    if (root) {
      root.style.transitionDuration = "0ms";
      root.style.transitionTimingFunction = "linear";
      root.style[axis] = `${startSize}px`;
    }

    // The first frame commits children when `unmountOnExit` had removed them;
    // the second frame measures the settled layout.
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        if (generation !== generationRef.current) return;

        const root = rootRef.current;
        if (!root) return;

        const measured = measureContent();
        const targetSize =
          collapsedPixelSize === null
            ? measured
            : Math.max(measured, collapsedPixelSize);
        const ms = prefersReducedMotion() ? 0 : resolveDuration(targetSize);

        if (ms <= 0 || Math.abs(targetSize - startSize) < 0.5) {
          finish("entered");
          return;
        }

        // Commit the collapsed start size before asking for the target size,
        // otherwise the browser can coalesce both writes into one layout.
        void root.offsetHeight;
        root.style.transitionDuration = `${ms}ms`;
        root.style.transitionTimingFunction = easing;
        root.style[axis] = `${targetSize}px`;
        scheduleFinish(generation, ms, "entered");
      });
    });
  };

  const startExit = () => {
    clearPending();
    generationRef.current += 1;
    const generation = generationRef.current;
    const root = rootRef.current;

    if (!root) {
      setStage("exited");
      return;
    }

    const startSize = getCurrentSize();

    setStage("exiting");
    root.style.transitionDuration = "0ms";
    root.style.transitionTimingFunction = "linear";
    root.style[axis] = `${startSize}px`;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (generation !== generationRef.current) return;

      const root = rootRef.current;
      if (!root) return;

      const ms = prefersReducedMotion() ? 0 : resolveDuration(startSize);
      if (
        ms <= 0 ||
        (collapsedPixelSize !== null && startSize <= collapsedPixelSize + 0.5)
      ) {
        finish("exited");
        return;
      }

      void root.offsetHeight;
      root.style.transitionDuration = `${ms}ms`;
      root.style.transitionTimingFunction = easing;
      root.style[axis] = collapsedSizeCss;
      scheduleFinish(generation, ms, "exited");
    });
  };

  useLayoutEffect(() => {
    if (previousOpenRef.current === isOpen) return;
    previousOpenRef.current = isOpen;

    if (isOpen) {
      startEnter();
    } else {
      startExit();
    }
    // Transition helpers read the current render's props and refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orientation, collapsedSizeCss, duration, easing, unmountOnExit]);

  useEffect(
    () => () => {
      generationRef.current += 1;
      clearPending();
    },
    // Pending frames and timers only hold refs, so the mount cleanup is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const rootStyle = {
    ...style,
    [COLLAPSED_SIZE_PROPERTY]: collapsedSizeCss,
  } as CSSProperties;

  // `inert` covers the whole close animation, so a focused control cannot stay
  // focused inside a panel that is disappearing. A non-zero collapsed size
  // leaves a visible preview and keeps it interactive.
  const inert = inertProp || (collapsedIsZero && !isOpen);

  return (
    <div
      {...rest}
      ref={setRootRef}
      inert={inert || undefined}
      className={classNames(
        "collapse",
        `collapse--${orientation}`,
        `collapse--${stage}`,
        collapsedIsZero && "collapse--collapsed-empty",
        className,
      )}
      style={rootStyle}
    >
      <div ref={wrapperRef} className="collapse__wrapper">
        <div className="collapse__inner">{mounted ? children : null}</div>
      </div>
    </div>
  );
};
