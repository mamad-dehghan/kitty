import classNames from "classnames";
import {
  type KeyboardEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { MultiContentTabPages } from "./MultiContentTabPages";
import { ScrollTabPages } from "./ScrollTabPages";
import {
  getPanelId,
  getTabId,
  type TabContentHandle,
  type TabItem,
} from "./TabBarParts";
import "./TabBar.scss";

export type TabBarScrollMode = boolean | "settle" | "lazy";

type props = {
  tabs: TabItem[];
  initialActiveTab?: string;
  /**
   * `true` previews the next page during a native swipe, `"settle"` waits for
   * the scroll to settle before mounting it, `"lazy"` uses `MultiContent` with
   * swipe detection, and `false` uses `MultiContent` without swipe.
   * @default true
   */
  scrollable?: TabBarScrollMode;
  /** Accessible name for the tab list. */
  "aria-label"?: string;
  /** Id of the element that labels the tab list. */
  "aria-labelledby"?: string;
};

type tabProps = TabItem & {
  id: string;
  panelId: string;
  index: number;
  isActive: boolean;
  anchorName: string;
  buttonRef: (element: HTMLButtonElement | null) => void;
  onSelect: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
};

export const TabBar = ({
  tabs,
  initialActiveTab,
  scrollable = true,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: props) => {
  const id = useId();
  const [activeTab, setActive] = useState<string>(() =>
    initialActiveTab && tabs.some((tab) => tab.title === initialActiveTab)
      ? initialActiveTab
      : (tabs[0]?.title ?? ""),
  );

  const activeTabIndex = useMemo(() => {
    const index = tabs.findIndex((tab) => tab.title === activeTab);
    return index === -1 ? 0 : index;
  }, [tabs, activeTab]);

  const isNativeScroll =
    scrollable === true || scrollable === "settle";
  const isSwipeMode = scrollable === "lazy";

  const contentRef = useRef<TabContentHandle>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleActiveChange = useCallback((title: string) => {
    setActive((current) => (current === title ? current : title));
  }, []);

  const activateTab = useCallback(
    (
      index: number,
      options?: { focus?: boolean; behavior?: ScrollBehavior },
    ) => {
      const tab = tabs[index];
      if (!tab) return;

      const content = contentRef.current;
      if (content) {
        content.activate(index, { behavior: options?.behavior });
      } else {
        handleActiveChange(tab.title);
      }

      if (options?.focus) tabRefs.current[index]?.focus();
    },
    [handleActiveChange, tabs],
  );

  const onTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (tabs.length === 0) return;

      let nextIndex: number;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = (index + 1) % tabs.length;
          break;
        case "ArrowLeft":
          nextIndex = (index - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      activateTab(nextIndex, { focus: true, behavior: "auto" });
    },
    [activateTab, tabs.length],
  );

  const contentProps = {
    tabs,
    activeIndex: activeTabIndex,
    baseId: id,
    onActiveChange: handleActiveChange,
  };

  return (
    <div className="tab-page" id={id}>
      <div
        className="tab-bar"
        role="tablist"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.title}
            {...tab}
            id={getTabId(id, index)}
            panelId={getPanelId(id, index)}
            index={index}
            isActive={index === activeTabIndex}
            anchorName={"--badge-" + id}
            buttonRef={(element) => {
              tabRefs.current[index] = element;
            }}
            onSelect={(tabIndex) => {
              activateTab(tabIndex, { behavior: "smooth" });
            }}
            onKeyDown={onTabKeyDown}
          />
        ))}
        <hr
          className="tab-indicator"
          aria-hidden="true"
          style={{
            positionAnchor: "--badge-" + id,
          }}
        />
      </div>

      {isNativeScroll ? (
        <ScrollTabPages
          ref={contentRef}
          {...contentProps}
          preview={scrollable === true}
        />
      ) : (
        <MultiContentTabPages
          ref={contentRef}
          {...contentProps}
          swipe={isSwipeMode}
        />
      )}
    </div>
  );
};

const Tab = ({
  title,
  Icon,
  isActive,
  index,
  id,
  panelId,
  anchorName,
  buttonRef,
  onSelect,
  onKeyDown,
}: tabProps) => {
  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      className={classNames("tab", Icon && "has-icon", isActive && "active")}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
    >
      <div className="tab-content">
        <div className="tab-icon">
          {Icon ? <Icon weight={isActive ? "fill" : "regular"} /> : undefined}
        </div>
        <div
          className="tab-title"
          style={{
            anchorName: isActive ? anchorName : undefined,
          }}
        >
          {title}
        </div>
      </div>
    </button>
  );
};
