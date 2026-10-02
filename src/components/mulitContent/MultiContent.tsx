import classNames from "classnames";
import {
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import { useDeferredState } from "../../hooks/useDeferredState";
import "./multiContent.scss";

type props = {
  transitionTo: "left" | "right" | "top" | "bottom";
  children: ReactNode;
};

type transitionVariables = "endOld" | "startNew";

const transitionPositions: Record<
  props["transitionTo"],
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

export const MultiContentCss = ({
  children,
  transitionTo,
}: {
  transitionTo: "left" | "right" | "top" | "bottom";
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
  transitionTo: "left" | "right" | "top" | "bottom";
  children: ReactElement<{
    style?: CSSProperties;
  }>;
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
  const oldValue = useDeferredState(children, 300);

  return (
    <span
      className={classNames("multi-content", "to-" + transitionTo)}
      {...wrapperProps}
      style={{
        ...wrapperProps?.style,
        width,
        height,
      }}
    >
      {oldValue !== children ? (
        cloneElement(oldValue, {
          style: {
            ...oldValue.props.style,
            animation: "old-content ease 350ms 1",
          },
        })
      ) : (
        <></>
      )}
      {children}
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
