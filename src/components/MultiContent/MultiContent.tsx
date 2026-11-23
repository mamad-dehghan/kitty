import classNames from "classnames";
import {
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import "./MultiContent.scss";

export type MultiContentDirection = "left" | "right" | "top" | "bottom";

export type MultiContentTransitionTo =
  | MultiContentDirection
  | ((prev: ReactNode, next: ReactNode) => MultiContentDirection);

type transitionVariables = "endOld" | "startNew";

const transitionPositions: Record<
  MultiContentDirection,
  Record<transitionVariables, string>
> = {
  left: {
    endOld: "-100%, 0",
    startNew: "100%, 0",
  },
  right: {
    endOld: "100%, 0",
    startNew: "-100%, 0",
  },
  bottom: {
    endOld: "0, 100%",
    startNew: "0, -100%",
  },
  top: {
    endOld: "0, -100%",
    startNew: "0, 100%",
  },
};

const TRANSITION_DURATION_MS = 300;
const TRANSITION_CLEANUP_MS = TRANSITION_DURATION_MS + 50;

const OUT_ANIMATION = `content-out ease ${TRANSITION_DURATION_MS}ms both`;
const IN_ANIMATION_A = `content-in-a ease ${TRANSITION_DURATION_MS}ms both`;
const IN_ANIMATION_B = `content-in-b ease ${TRANSITION_DURATION_MS}ms both`;

const areFunctionsEqual = (
  first: (...args: unknown[]) => unknown,
  second: (...args: unknown[]) => unknown,
) => {
  if (first === second) return true;

  try {
    return first.name === second.name && first.toString() === second.toString();
  } catch {
    return false;
  }
};

const isPlainObject = (value: object) => {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/**
 * Compares React values without relying on element object identity, so a
 * parent re-render with the same content does not start a new transition.
 * Functions compare by name and source: inline handlers keep their identity
 * across renders, while swapping a component/icon still counts as a change.
 */
const isEqualValue = (
  first: unknown,
  second: unknown,
  seen: WeakMap<object, object>,
): boolean => {
  if (Object.is(first, second)) return true;

  if (typeof first === "function" || typeof second === "function") {
    return (
      typeof first === "function" &&
      typeof second === "function" &&
      areFunctionsEqual(
        first as (...args: unknown[]) => unknown,
        second as (...args: unknown[]) => unknown,
      )
    );
  }

  if (
    typeof first !== "object" ||
    typeof second !== "object" ||
    first === null ||
    second === null
  ) {
    return false;
  }

  if (isValidElement(first) || isValidElement(second)) {
    if (!isValidElement(first) || !isValidElement(second)) return false;

    return (
      first.type === second.type &&
      first.key === second.key &&
      isEqualValue(first.props, second.props, seen)
    );
  }

  if (Array.isArray(first) || Array.isArray(second)) {
    if (!Array.isArray(first) || !Array.isArray(second)) return false;
    if (first.length !== second.length) return false;

    for (let index = 0; index < first.length; index += 1) {
      if (!isEqualValue(first[index], second[index], seen)) return false;
    }

    return true;
  }

  const seenSecond = seen.get(first);
  if (seenSecond !== undefined) return seenSecond === second;
  seen.set(first, second);

  if (first instanceof Date || second instanceof Date) {
    return (
      first instanceof Date &&
      second instanceof Date &&
      first.getTime() === second.getTime()
    );
  }

  if (!isPlainObject(first) || !isPlainObject(second)) return false;

  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);
  if (firstKeys.length !== secondKeys.length) return false;

  for (const key of firstKeys) {
    if (!Object.prototype.hasOwnProperty.call(second, key)) return false;

    if (
      !isEqualValue(
        (first as Record<string, unknown>)[key],
        (second as Record<string, unknown>)[key],
        seen,
      )
    ) {
      return false;
    }
  }

  return true;
};

const isSameContent = (previous: ReactNode, next: ReactNode) => {
  if (Object.is(previous, next)) return true;

  if (isValidElement(previous) || isValidElement(next)) {
    if (!isValidElement(previous) || !isValidElement(next)) return false;

    const previousKey = previous.key ?? null;
    const nextKey = next.key ?? null;

    if (previous.type !== next.type || previousKey !== nextKey) return false;

    // A key identifies the content. Props can update without replaying the
    // transition, which is what a keyed tab/page wants.
    if (previousKey !== null) return true;

    return isEqualValue(previous.props, next.props, new WeakMap());
  }

  return isEqualValue(previous, next, new WeakMap());
};

type transitionState = {
  previous: ReactNode;
  outgoing: { node: ReactNode } | null;
  direction: MultiContentDirection;
  transition: number;
};

export const MultiContentCss = ({
  children,
  transitionTo,
}: {
  transitionTo: MultiContentDirection;
  children: ReactNode;
}) => {
  const id = useId();
  const name = `multi-content-${id.replaceAll(":", "-")}`;

  const [active, setActive] = useState(children);
  useEffect(() => {
    // if (active === children) return;
    // return () => {
    document.startViewTransition(() => {
      // ReactDOM.flushSync(() => {
      setActive(children);
      // })
    });
    // }
  }, [children]);

  return (
    <>
      <span
        // className={classNames("multi-content", "to-" + transitionTo)}
        style={{
          display: "inline-block",
          viewTransitionName: name,
        }}
      >
        <style>
          {`
          ::view-transition-group(${name}) {
            animation-duration: 300ms;
            animation-timing-function: ease;
            overflow: hidden;
            border-radius: inherit;
            animation-fill-mode: both;
          }
          ::view-transition-old(${name}) {
            //all:unset;
            --start: 0, 0;
            --end : ${transitionPositions[transitionTo]["endOld"]};
            // animation-name: slide, descrease-opacity;
            animation-name: slide;
          }
          ::view-transition-new(${name}) {
            --start: ${transitionPositions[transitionTo]["startNew"]};
            --end :0, 0;
            // animation-name: slide, increase-opacity;
            animation-name: slide;
          }
      `}
        </style>
        {active}
      </span>
    </>
  );
};

type deferredModeProps = {
  transitionTo: MultiContentTransitionTo;
  children: ReactNode;
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
  width: string | number;
  height: string | number;
};

export const MultiContent = ({
  children,
  transitionTo,
  wrapperProps,
  width,
  height,
}: deferredModeProps) => {
  const [state, setState] = useState<transitionState>(() => ({
    previous: children,
    outgoing: null,
    direction: typeof transitionTo === "function" ? "left" : transitionTo,
    transition: 0,
  }));

  if (!isSameContent(state.previous, children)) {
    setState({
      previous: children,
      outgoing: { node: state.previous },
      direction:
        typeof transitionTo === "function"
          ? transitionTo(state.previous, children)
          : transitionTo,
      transition: state.transition + 1,
    });
  }

  useEffect(() => {
    if (!state.outgoing) return;

    const timeout = setTimeout(() => {
      setState((current) => ({ ...current, outgoing: null }));
    }, TRANSITION_CLEANUP_MS);

    return () => clearTimeout(timeout);
  }, [state.outgoing]);

  const {
    className: wrapperClassName,
    style: wrapperStyle,
    ...restWrapperProps
  } = wrapperProps ?? {};
  const isTransitioning = state.outgoing !== null;

  return (
    <span
      {...restWrapperProps}
      className={classNames(
        "multi-content",
        isTransitioning && `to-${state.direction}`,
        wrapperClassName,
      )}
      style={{
        ...wrapperStyle,
        width,
        height,
      }}
    >
      {state.outgoing && (
        <span
          key={`outgoing-${state.transition}`}
          className="multi-content-layer"
          style={{
            animation: OUT_ANIMATION,
            pointerEvents: "none",
          }}
        >
          {state.outgoing.node}
        </span>
      )}
      <span
        key="current"
        className="multi-content-layer"
        style={
          isTransitioning
            ? {
                animation:
                  state.transition % 2 === 0
                    ? IN_ANIMATION_A
                    : IN_ANIMATION_B,
              }
            : undefined
        }
      >
        {children}
      </span>
    </span>
  );
};

// export const MultiContentNumber = ({
//   direction,
//   currentMode,
//   wrapperProps,
//   componentProps,
// }: Omit<
//   props<number, Omit<HTMLAttributes<HTMLSpanElement>, "chilldren">>,
//   "modes"
// >) => {
//   const ref = useRef<HTMLSpanElement>(null);
//   const [modes, setModes] = useState([-Infinity, currentMode, Infinity]);
//   useLayoutEffect(() => {
//     if (modes[0] !== -Infinity) {
//       ref.current?.scroll(
//         direction === "horizontal"
//           ? { left: 0, behavior: "smooth" }
//           : { top: 0, behavior: "smooth" },
//       );
//       setTimeout(() => {
//         setModes((pre) => [-Infinity, pre[0], Infinity]);
//       }, 400);
//     } else if (modes[2] !== Infinity) {
//       ref.current?.scroll(
//         direction === "horizontal"
//           ? { left: ref.current.clientWidth * 2, behavior: "smooth" }
//           : { top: ref.current.clientHeight * 2, behavior: "smooth" },
//       );
//       setTimeout(() => {
//         setModes((pre) => [-Infinity, pre[2], Infinity]);
//       }, 400);
//     } else {
//       ref.current?.scroll(
//         direction === "horizontal"
//           ? { left: ref.current.clientWidth, behavior: "instant" }
//           : { top: ref.current.clientHeight, behavior: "instant" },
//       );
//     }
//   }, [ref, modes]);

//   useEffect(() => {
//     setModes((pre) =>
//       pre[1] === currentMode
//         ? pre
//         : pre[1] > currentMode
//           ? [currentMode, pre[1], Infinity]
//           : [-Infinity, pre[1], currentMode],
//     );
//   }, [currentMode]);

//   return (
//     <span
//       ref={ref}
//       className={classNames("multi-content", "number", direction)}
//       {...wrapperProps}
//     >
//       <span key={"before"} {...componentProps}>
//         {modes[0]}
//       </span>
//       <span key={"current"} {...componentProps}>
//         {modes[1]}
//       </span>
//       <span key={"after"} {...componentProps}>
//         {modes[2]}
//       </span>
//     </span>
//   );
// };
