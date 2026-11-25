import classNames from "classnames";
import {
  forwardRef,
  isValidElement,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  MultiContent,
  type MultiContentTransitionTo,
} from "../MultiContent/MultiContent";
import {
  getPanelId,
  getTabId,
  TabPanel,
  type TabContentHandle,
  type TabContentProps,
} from "./TabBarParts";

const SWIPE_AXIS_LOCK_PX = 8;
const SWIPE_COMMIT_MIN_PX = 56;
const SWIPE_COMMIT_RATIO = 0.18;
const SWIPE_COMMIT_MIN_MS = 80;
const SWIPE_FLICK_MIN_PX = 24;
const SWIPE_FLICK_VELOCITY = 0.5;
const SWIPE_CLICK_SUPPRESS_MS = 400;
const SWIPE_IGNORE_SELECTOR =
  'input, textarea, select, option, audio[controls], video[controls], [contenteditable="true"], [data-tabbar-no-swipe]';

type swipeStart = {
  pointerId: number;
  x: number;
  y: number;
  time: number;
  axis: "pending" | "horizontal" | "vertical";
};

type props = TabContentProps & {
  swipe: boolean;
};

const getNodeIndex = (node: ReactNode) => {
  if (isValidElement(node) && node.key !== null) {
    const index = Number(node.key);
    if (!Number.isNaN(index)) return index;
  }

  return 0;
};

const resolveTransition: MultiContentTransitionTo = (previous, next) =>
  getNodeIndex(next) >= getNodeIndex(previous) ? "left" : "right";

export const MultiContentTabPages = forwardRef<TabContentHandle, props>(
  ({ tabs, activeIndex, baseId, onActiveChange, swipe }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const swipeStartRef = useRef<swipeStart | null>(null);
    const previousUserSelect = useRef<string | undefined>(undefined);
    const suppressClick = useRef(false);
    const suppressClickTimer = useRef<number | undefined>(undefined);

    const restoreSwipeStyles = useCallback(() => {
      const wrapper = contentRef.current;
      if (!wrapper) return;

      wrapper.classList.remove("swiping");
      wrapper.style.userSelect = previousUserSelect.current ?? "";
      previousUserSelect.current = undefined;
    }, []);

    useEffect(() => {
      return () => {
        window.clearTimeout(suppressClickTimer.current);
        restoreSwipeStyles();
      };
    }, [restoreSwipeStyles]);

    useEffect(() => {
      if (swipe) return;

      swipeStartRef.current = null;
      restoreSwipeStyles();
    }, [restoreSwipeStyles, swipe]);

    const activate = useCallback(
      (index: number) => {
        const tab = tabs[index];
        if (!tab) return;

        onActiveChange(tab.title);
      },
      [onActiveChange, tabs],
    );

    useImperativeHandle(ref, () => ({ activate }), [activate]);

    const onSwipePointerDown = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!swipe || !event.isPrimary || event.button !== 0) return;
        if (event.defaultPrevented) return;

        const target = event.target;
        if (
          !(target instanceof Element) ||
          target.closest(SWIPE_IGNORE_SELECTOR)
        ) {
          return;
        }

        swipeStartRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          time: performance.now(),
          axis: "pending",
        };
      },
      [swipe],
    );

    const onSwipePointerMove = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = swipeStartRef.current;
        if (!start || start.pointerId !== event.pointerId) return;

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;

        if (start.axis === "pending") {
          if (
            Math.abs(dx) < SWIPE_AXIS_LOCK_PX &&
            Math.abs(dy) < SWIPE_AXIS_LOCK_PX
          ) {
            return;
          }

          if (Math.abs(dy) >= Math.abs(dx)) {
            start.axis = "vertical";
            return;
          }

          start.axis = "horizontal";
          event.currentTarget.setPointerCapture(event.pointerId);

          const wrapper = contentRef.current;
          if (wrapper) {
            previousUserSelect.current = wrapper.style.userSelect;
            wrapper.style.userSelect = "none";
            wrapper.classList.add("swiping");
          }

          suppressClick.current = true;
          window.clearTimeout(suppressClickTimer.current);
          suppressClickTimer.current = window.setTimeout(() => {
            suppressClick.current = false;
          }, SWIPE_CLICK_SUPPRESS_MS);
        }
      },
      [],
    );

    const onSwipePointerUp = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = swipeStartRef.current;
        swipeStartRef.current = null;

        if (!start || start.pointerId !== event.pointerId) return;

        const wrapper = event.currentTarget;
        if (wrapper.hasPointerCapture(event.pointerId)) {
          wrapper.releasePointerCapture(event.pointerId);
        }

        if (start.axis !== "horizontal") return;

        restoreSwipeStyles();
        if (!swipe) return;

        const distance = Math.abs(event.clientX - start.x);
        const elapsed = performance.now() - start.time;
        const distanceThreshold = Math.max(
          SWIPE_COMMIT_MIN_PX,
          wrapper.clientWidth * SWIPE_COMMIT_RATIO,
        );
        const deliberateSwipe =
          distance >= distanceThreshold && elapsed >= SWIPE_COMMIT_MIN_MS;
        const flick =
          distance >= SWIPE_FLICK_MIN_PX &&
          elapsed > 0 &&
          distance / elapsed >= SWIPE_FLICK_VELOCITY;

        if (!deliberateSwipe && !flick) return;

        const targetIndex = activeIndex + (event.clientX < start.x ? 1 : -1);
        if (targetIndex < 0 || targetIndex >= tabs.length) return;

        activate(targetIndex);
      },
      [activate, activeIndex, restoreSwipeStyles, swipe, tabs.length],
    );

    const onSwipePointerCancel = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = swipeStartRef.current;
        swipeStartRef.current = null;

        if (
          start?.pointerId === event.pointerId &&
          start.axis === "horizontal"
        ) {
          restoreSwipeStyles();
        }
      },
      [restoreSwipeStyles],
    );

    const onSwipePointerLeave = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = swipeStartRef.current;
        if (start?.pointerId === event.pointerId && start.axis === "pending") {
          swipeStartRef.current = null;
        }
      },
      [],
    );

    const onContentClickCapture = useCallback(
      (event: ReactMouseEvent<HTMLDivElement>) => {
        if (!suppressClick.current) return;

        suppressClick.current = false;
        window.clearTimeout(suppressClickTimer.current);
        event.preventDefault();
        event.stopPropagation();
      },
      [],
    );

    const activeTab = tabs[activeIndex];

    return (
      <div
        ref={contentRef}
        className={classNames(
          "page-content-wrapper",
          "no-scroll",
          swipe && "lazy",
        )}
        onPointerDown={swipe ? onSwipePointerDown : undefined}
        onPointerMove={swipe ? onSwipePointerMove : undefined}
        onPointerUp={swipe ? onSwipePointerUp : undefined}
        onPointerCancel={swipe ? onSwipePointerCancel : undefined}
        onPointerLeave={swipe ? onSwipePointerLeave : undefined}
        onClickCapture={swipe ? onContentClickCapture : undefined}
      >
        {activeTab ? (
          <MultiContent
            width="100%"
            height="100%"
            transitionTo={resolveTransition}
            wrapperProps={{ className: "tab-multi-content" }}
          >
            <TabPanel
              key={activeIndex}
              tab={activeTab}
              isActive
              isRendered
              id={getPanelId(baseId, activeIndex)}
              labelledBy={getTabId(baseId, activeIndex)}
            />
          </MultiContent>
        ) : null}
      </div>
    );
  },
);

MultiContentTabPages.displayName = "MultiContentTabPages";
