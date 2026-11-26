import { type Icon, ListIcon, TextOutdentIcon } from "@phosphor-icons/react";
import classNames from "classnames";
import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import {
  type breakPointType,
  fillOptions,
  sizeOptions,
} from "../../providers/Theme/types";
import { mediaToClass } from "../../providers/Theme/media";
import { FAB, type IFABProps } from "../FAB";
import { IconButton } from "../IconButton/IconButton";
import { Tooltip } from "../Tooltip/Tooltip";
import "./NavBar.scss";

type props = {
  items: {
    title: string;
    Icon: Icon;
    onClick?: () => void;
    content: ReactNode;
  }[];
  initialActiveItem: string;
  onActiveChange?: (active: string) => void;
  media?: breakPointType;
  /** Accessible name for the navigation landmark. */
  ariaLabel?: string;
  /** Optional rail-only primary action, usually `<NavBar.PrimaryAction />`. */
  action?: ReactNode;
};

export type INavBarPrimaryActionProps = Omit<
  IFABProps,
  "hidden" | "size"
>;

const NavBarContext = createContext<{ isCollapsed: boolean }>({
  isCollapsed: false,
});

const NavBarPrimaryAction = ({
  className,
  condensed,
  ...others
}: INavBarPrimaryActionProps) => {
  const { isCollapsed } = useContext(NavBarContext);

  return (
    <FAB
      {...others}
      type="button"
      className={classNames("navbar-primary-action", className)}
      condensed={condensed ?? isCollapsed}
    />
  );
};

const NavBarComponent = ({
  items,
  initialActiveItem,
  onActiveChange,
  media,
  ariaLabel = "Primary navigation",
  action,
}: props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const itemsId = useId();

  const activeContent = useMemo(() => {
    return items.find((i) => i.title === activeItem)?.content;
  }, [items, activeItem]);

  const toggleLabel = isCollapsed
    ? "Expand navigation"
    : "Collapse navigation";

  const handleItemsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(".navbar-button"),
    );
    const currentIndex = buttons.indexOf(
      document.activeElement as HTMLButtonElement,
    );

    if (currentIndex < 0) return;

    let nextIndex: number;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = buttons.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    buttons[nextIndex]?.focus();
  };

  return (
    <NavBarContext.Provider value={{ isCollapsed }}>
      <div className={classNames("navber-page", mediaToClass(media))}>
        <nav
          className={classNames(
            "navbar",
            isCollapsed ? "collapsed" : "expanded",
            Boolean(action) && "has-action",
          )}
          aria-label={ariaLabel}
        >
          <Tooltip title={toggleLabel}>
            <IconButton
              className="navbar-collapse-button"
              fill={fillOptions.link}
              size={sizeOptions.large}
              Icon={isCollapsed ? ListIcon : TextOutdentIcon}
              aria-expanded={!isCollapsed}
              aria-controls={itemsId}
              aria-label={toggleLabel}
              type="button"
              onClick={() => setIsCollapsed((previous) => !previous)}
            />
          </Tooltip>
          {action ? (
            <div className="navbar-primary-action-slot">{action}</div>
          ) : null}
          <div
            className="navbar-items-wrapper"
            id={itemsId}
            onKeyDown={handleItemsKeyDown}
          >
            {items.map((item) => (
              <NavBarButton
                key={item.title}
                title={item.title}
                Icon={item.Icon}
                onClick={() => {
                  setActiveItem(item.title);
                  onActiveChange?.(item.title);
                  item.onClick?.();
                }}
                isActive={activeItem === item.title}
                content={item.content}
              />
            ))}
          </div>
        </nav>
        {activeContent}
      </div>
    </NavBarContext.Provider>
  );
};

export const NavBar = Object.assign(NavBarComponent, {
  PrimaryAction: NavBarPrimaryAction,
});

const NavBarButton = ({
  title,
  Icon,
  onClick,
  isActive,
}: props["items"][0] & { isActive: boolean }) => {
  return (
    <button
      type="button"
      className={classNames(
        "navbar-button",
        isActive && "navbar-button--active",
      )}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <div className="navbar-button-content">
        <div className="navbar-button-icon">
          <Icon weight={isActive ? "fill" : "regular"} />
        </div>
        <div className="navbar-button-title">{title}</div>
      </div>
    </button>
  );
};
