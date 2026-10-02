import classNames from "classnames";
import { type HTMLAttributes, type KeyboardEvent, useEffect } from "react";
import { useHistoryLock } from "../../hooks/useHistoryLock";
import "./app_layer.scss";
import { blurBottomLayers } from "./utils";

type props = Omit<HTMLAttributes<HTMLDivElement>, "onKeyDown" | "tabIndex"> & {
  /** @default false */
  blockBottomLayers?: boolean;
  /** @default false */
  closeOnEscape?: boolean;
  /** @default false */
  preventBlock?: boolean;
  onClose?: () => void;
};

function onKeyDown(
  closeOnEscape: props["closeOnEscape"],
  onClose: props["onClose"],
) {
  return function (event: KeyboardEvent<HTMLDivElement>) {
    if (closeOnEscape && onClose && event.key === "Escape") {
      onClose();
    }
  };
}

const fakeClose = () => {};

export const AppLayer = ({
  className,
  closeOnEscape = false,
  blockBottomLayers = false,
  preventBlock = false,
  onClose,
  onClick,
  ...others
}: props) => {
  const { lock } = useHistoryLock(onClose ?? fakeClose);
  useEffect(() => {
    if (blockBottomLayers) {
      // checkLayerState()
      if (onClose) lock();
      blurBottomLayers();
    }

    return () => {
      if (blockBottomLayers) {
        // unlock()
        // checkLayerState()
        blurBottomLayers();
      }
    };
  }, [blockBottomLayers]);

  return (
    <div
      tabIndex={-1}
      onKeyDown={onKeyDown(closeOnEscape, onClose)}
      onClick={(event) => {
        // console.log("app-layer", others.id);
        if (onClick) {
          // event.stopPropagation();
          onClick(event);
        }
      }}
      className={classNames("app-extra-layer", className, {
        "block-bottom-layers": blockBottomLayers,
        "prevent-block-layer": preventBlock,
      })}
      data-layer
      {...others}
    />
  );
};
