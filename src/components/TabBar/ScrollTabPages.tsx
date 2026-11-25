import {
  forwardRef,
  type UIEventHandler,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  clampIndex,
  getPanelId,
  getTabId,
  TabPanel,
  type TabContentHandle,
  type TabContentProps,
} from "./TabBarParts";

const SCROLL_SETTLE_MS = 160;
const SCROLL_START_FALLBACK_MS = 120;
const SWIPE_PREVIEW_AXIS_PX = 8;
const SWIPE_PREVIEW_DISTANCE_PX = 24;
const SWIPE_PREVIEW_DELAY_MS = 80;

type scrollGesture = {
  startLeft: number;
  startTime: number;
};

type props = TabContentProps & {
  preview: boolean;
};

export const ScrollTabPages = forwardRef<TabContentHandle, props>(
  (
    {
      tabs,
      activeIndex,
      baseId,
      onActiveChange,
      preview,
    },
    ref,
  ) => {
    const [renderedIndex, setRenderedIndex] = useState(activeIndex);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);
    const programmaticScroll = useRef<number | null>(null);
    const scrollSettleTimer = useRef<number | undefined>(undefined);
    const scrollFallbackTimer = useRef<number | undefined>(undefined);
    const scrollGesture = useRef<scrollGesture | null>(null);

    useEffect(() => {
      return () => {
        window.clearTimeout(scrollSettleTimer.current);
        window.clearTimeout(scrollFallbackTimer.current);
      };
    }, []);

    useEffect(() => {
      if (preview) return;

      scrollGesture.current = null;
      setPreviewIndex((current) => (current === null ? current : null));
    }, [preview]);

    // Start at the initial tab and restore the position if the mode changes.
    useLayoutEffect(() => {
      const wrapper = contentRef.current;
      if (!wrapper) return;

      programmaticScroll.current = null;
      setRenderedIndex(activeIndex);
      wrapper.scrollLeft = wrapper.clientWidth * activeIndex;
      // eslint-disable-next-line react-hooks/exhaustive-deps -- initial position only
    }, []);

    const finishScroll = useCallback(() => {
      window.clearTimeout(scrollSettleTimer.current);

      const wrapper = contentRef.current;
      if (!wrapper || wrapper.clientWidth === 0) return;

      const index = clampIndex(
        Math.round(wrapper.scrollLeft / wrapper.clientWidth),
        tabs.length,
      );
      const tab = tabs[index];

      programmaticScroll.current = null;
      scrollGesture.current = null;
      setPreviewIndex(null);

      if (!tab) return;

      setRenderedIndex(index);
      onActiveChange(tab.title);
    }, [onActiveChange, tabs]);

    const scheduleScrollSettle = useCallback(() => {
      window.clearTimeout(scrollSettleTimer.current);
      scrollSettleTimer.current = window.setTimeout(
        finishScroll,
        SCROLL_SETTLE_MS,
      );
    }, [finishScroll]);

    const scrollToIndex = useCallback(
      (index: number, behavior: ScrollBehavior) => {
        const wrapper = contentRef.current;
        if (!wrapper) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const targetLeft = wrapper.clientWidth * index;
        const actualBehavior = reduceMotion ? "auto" : behavior;
        const startLeft = wrapper.scrollLeft;

        programmaticScroll.current = index;
        window.clearTimeout(scrollSettleTimer.current);
        window.clearTimeout(scrollFallbackTimer.current);

        wrapper.scrollTo({
          left: targetLeft,
          behavior: actualBehavior,
        });

        if (Math.abs(wrapper.scrollLeft - targetLeft) <= 1) {
          programmaticScroll.current = null;
        } else if (actualBehavior === "smooth") {
          // Some environments pause smooth scrolling (for example a
          // background tab). Jump if the animation has not started.
          scrollFallbackTimer.current = window.setTimeout(() => {
            if (programmaticScroll.current !== index) return;
            if (Math.abs(wrapper.scrollLeft - startLeft) > 1) return;

            wrapper.scrollLeft = targetLeft;
          }, SCROLL_START_FALLBACK_MS);
        }
      },
      [],
    );

    const activate = useCallback(
      (index: number, options?: { behavior?: ScrollBehavior }) => {
        const tab = tabs[index];
        if (!tab) return;

        window.clearTimeout(scrollSettleTimer.current);
        scrollGesture.current = null;
        setPreviewIndex(null);
        setRenderedIndex(index);
        onActiveChange(tab.title);
        scrollToIndex(index, options?.behavior ?? "smooth");
      },
      [onActiveChange, scrollToIndex, tabs],
    );

    useImperativeHandle(ref, () => ({ activate }), [activate]);

    const onScroll = useCallback<UIEventHandler<HTMLDivElement>>(
      (event) => {
        const wrapper = event.currentTarget;
        const width = wrapper.clientWidth;
        if (width === 0) return;

        if (programmaticScroll.current !== null) {
          const targetLeft = width * programmaticScroll.current;
          if (Math.abs(wrapper.scrollLeft - targetLeft) <= 1) {
            programmaticScroll.current = null;
          }
          scheduleScrollSettle();
          return;
        }

        const index = clampIndex(
          Math.round(wrapper.scrollLeft / width),
          tabs.length,
        );
        const tab = tabs[index];

        if (tab) onActiveChange(tab.title);

        if (preview) {
          const gesture = (scrollGesture.current ??= {
            startLeft: width * renderedIndex,
            startTime: performance.now(),
          });
          const delta = wrapper.scrollLeft - gesture.startLeft;
          const elapsed = performance.now() - gesture.startTime;

          if (Math.abs(delta) < SWIPE_PREVIEW_AXIS_PX) {
            setPreviewIndex((current) => (current === null ? current : null));
          } else if (
            Math.abs(delta) >= SWIPE_PREVIEW_DISTANCE_PX ||
            elapsed >= SWIPE_PREVIEW_DELAY_MS
          ) {
            const targetIndex = clampIndex(
              renderedIndex + (delta > 0 ? 1 : -1),
              tabs.length,
            );
            const nextPreview =
              targetIndex === renderedIndex ? null : targetIndex;

            setPreviewIndex((current) =>
              current === nextPreview ? current : nextPreview,
            );
          }
        }

        scheduleScrollSettle();
      },
      [
        onActiveChange,
        preview,
        renderedIndex,
        scheduleScrollSettle,
        tabs,
      ],
    );

    const onScrollEnd = useCallback<UIEventHandler<HTMLDivElement>>(() => {
      finishScroll();
    }, [finishScroll]);

    return (
      <div
        ref={contentRef}
        className="page-content-wrapper"
        onScroll={onScroll}
        onScrollEnd={onScrollEnd}
      >
        {tabs.map((tab, index) => (
          <TabPanel
            key={tab.title}
            tab={tab}
            isActive={index === activeIndex}
            isRendered={index === renderedIndex || index === previewIndex}
            id={getPanelId(baseId, index)}
            labelledBy={getTabId(baseId, index)}
          />
        ))}
      </div>
    );
  },
);

ScrollTabPages.displayName = "ScrollTabPages";
