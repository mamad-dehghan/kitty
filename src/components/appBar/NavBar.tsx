import { type Icon, ListIcon, TextOutdentIcon } from "@phosphor-icons/react";
import classNames from "classnames";
import { type ReactNode, useMemo, useState } from "react";
import {
  type breakPointType,
  colorOptions,
  fillOptions,
} from "../../providers/theme/types";
import { mediaToClass } from "../../utils/functions";
import { Button } from "../button/Button";
import "./navbar.scss";

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
};

export const NavBar = ({
  items,
  initialActiveItem,
  onActiveChange,
  media,
}: props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState(initialActiveItem);

  const activeContent = useMemo(() => {
    return items.find((i) => i.title === activeItem)?.content;
  }, [items, activeItem]);

  return (
    <div className={classNames("navber-page", mediaToClass(media))}>
      <div
        className={classNames("navbar", isCollapsed ? "collapsed" : "expanded")}
      >
        <Button
          className="navbar-collapse-button"
          fill={fillOptions.link}
          mode={colorOptions.warning}
          onClick={() => setIsCollapsed((pre) => !pre)}
        >
          {isCollapsed ? (
            <ListIcon weight="regular" />
          ) : (
            <TextOutdentIcon weight="regular" />
          )}
        </Button>
        <div className="navbar-items-wrapper">
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
      </div>
      {activeContent}
    </div>
  );
};

const NavBarButton = ({
  title,
  Icon,
  onClick,
  isActive,
}: props["items"][0] & { isActive: boolean }) => {
  return (
    <button
      className={classNames("navbar-button", isActive && "element-focused")}
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
