import { XIcon, type Icon, type IconWeight } from "@phosphor-icons/react";
import classNames from "classnames";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AppLayer } from "../../providers/AppLayer/AppLayer";
import { colorOptions } from "../../providers/Theme/types";
import { colorClass, type Size } from "../../providers/Theme/variants";
import { FAB } from "./FAB";
import "./FABMenu.scss";

export type FABMenuItem = {
  label: string;
  Icon: Icon;
  onClick: () => void;
  disabled?: boolean;
};

export type FABMenuColorMode =
  colorOptions.primary | colorOptions.secondary | colorOptions.tertiary;

export interface IFABMenuProps {
  /** Icon of the closed FAB. */
  Icon: Icon;
  /** Two to six actions. */
  items: FABMenuItem[];
  /** Optional visible label for the closed FAB (extended FAB). */
  label?: string;
  /** @default sizeOptions.medium */
  size?: Size;
  /** M3 FAB menus support primary, secondary and tertiary colors. @default colorOptions.primary */
  colorMode?: FABMenuColorMode;
  weight?: IconWeight;
  /** @default false */
  defaultOpen?: boolean;
  /** Controlled open state. */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Slides the closed FAB out of view. Ignored while the menu is open. */
  hidden?: boolean;
  /** Collapses an extended closed FAB. Ignored while the menu is open. */
  condensed?: boolean;
  /** Offset from the bottom edge. @default "1rem" */
  offsetBlock?: string;
  /** Offset from the inline-end edge. @default "1rem" */
  offsetInline?: string;
  mountElement?: HTMLElement;
  className?: string;
  menuClassName?: string;
  style?: CSSProperties;
  menuStyle?: CSSProperties;
  /** Accessible name for an icon-only closed FAB. @default "Open actions" */
  triggerLabel?: string;
  /** Accessible name for the close button. @default "Close menu" */
  closeLabel?: string;
}

export const FABMenu = ({
  Icon,
  items,
  label,
  size,
  colorMode = colorOptions.primary,
  weight,
  defaultOpen = false,
  isOpen,
  onOpenChange,
  hidden = false,
  condensed = false,
  offsetBlock,
  offsetInline,
  mountElement,
  className,
  menuClassName,
  style,
  menuStyle,
  triggerLabel = "Open actions",
  closeLabel = "Close menu",
}: IFABMenuProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(
    mountElement ?? null,
  );
  const open = isOpen ?? internalOpen;
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setPortalTarget(
      mountElement ??
        (typeof document === "undefined"
          ? null
          : document.getElementById("theme-provider")),
    );
  }, [mountElement]);

  const changeOpen = (next: boolean) => {
    if (isOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!portalTarget) return;

    if (open) {
      wasOpen.current = true;
      const frame = requestAnimationFrame(() => {
        (firstItemRef.current ?? closeRef.current)?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }

    if (wasOpen.current) {
      wasOpen.current = false;
      const frame = requestAnimationFrame(() => {
        const trigger = triggerRef.current;
        if (trigger && !trigger.inert) trigger.focus();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open, portalTarget]);

  if (!portalTarget) return null;

  const offsets = {
    ...(offsetBlock ? { "--fab-menu-offset-block": offsetBlock } : {}),
    ...(offsetInline ? { "--fab-menu-offset-inline": offsetInline } : {}),
  } as CSSProperties;
  const firstEnabledIndex = items.findIndex((item) => !item.disabled);

  return (
    <>
      {createPortal(
        <div
          className={classNames("fab-menu-anchor", className)}
          style={{ ...offsets, ...style }}
        >
          <FAB
            ref={triggerRef}
            Icon={Icon}
            label={label}
            size={size}
            colorMode={colorMode}
            weight={weight}
            hidden={open || hidden}
            condensed={!open && condensed}
            aria-label={label ? undefined : triggerLabel}
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            onClick={() => changeOpen(true)}
          />
        </div>,
        portalTarget,
      )}

      {open
        ? createPortal(
            <AppLayer
              className="fab-menu-layer"
              blockBottomLayers
              closeOnEscape
              onClose={() => changeOpen(false)}
              onClick={() => changeOpen(false)}
            >
              <div
                className={classNames(
                  "fab-menu",
                  colorClass(colorMode),
                  menuClassName,
                )}
                style={{ ...offsets, ...menuStyle }}
              >
                <div className="fab-menu__items" id={menuId}>
                  {items.map((item, index) => {
                    const ItemIcon = item.Icon;

                    return (
                      <div
                        key={`${item.label}-${index}`}
                        className="fab-menu__item-wrap"
                        style={
                          {
                            "--fab-item-index": index,
                          } as CSSProperties
                        }
                      >
                        <button
                          ref={
                            index === firstEnabledIndex
                              ? firstItemRef
                              : undefined
                          }
                          type="button"
                          className="fab-menu__item"
                          disabled={item.disabled}
                          onClick={(event) => {
                            event.stopPropagation();
                            changeOpen(false);
                            item.onClick();
                          }}
                        >
                          <ItemIcon weight="regular" aria-hidden="true" />
                          <span>{item.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  ref={closeRef}
                  type="button"
                  className="fab-menu__close"
                  aria-label={closeLabel}
                  onClick={(event) => {
                    event.stopPropagation();
                    changeOpen(false);
                  }}
                >
                  <XIcon weight="bold" aria-hidden="true" />
                </button>
              </div>
            </AppLayer>,
            portalTarget,
          )
        : null}
    </>
  );
};
