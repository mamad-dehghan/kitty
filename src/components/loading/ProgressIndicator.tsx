import classNames from "classnames";
import { type HTMLAttributes } from "react";
import "./progress_indicator.scss";
import { sizeOptions } from "../../providers/theme/types";
import { sizeClass } from "../../providers/theme/variants";

type props = {
  type: "linear" | "circular";
  /** @default sizeOptions.medium */
  size?: sizeOptions;
  value: number;
  max?: number;
} & HTMLAttributes<HTMLDivElement>;

export const ProgressIndicator = ({
  value,
  type,
  size = sizeOptions.medium,
  max = 1,
  className,
  ...others
}: props) => {
  return (
    <div
      className={classNames("progress-indicator", sizeClass(size), className)}
      {...others}
    >
      <div
        className="progress-indicator--value"
        style={{
          flexBasis: Math.max(0, Math.min(max, value)) + "%",
        }}
        // data-value={Math.max(0, Math.min(max, value))}
      />
      <div className="progress-indicator--empty">
        <div className="progress-indicator--stop-marker">
          {/*<div className="progress-indicator--stop-marker-inner">
          </div>*/}
        </div>
      </div>
    </div>
  );

  // return <progress className={classNames("progress-indicator", className)}
  //   value={Math.max(0, Math.min(max, value))}
  //   max={max}
  //   {...others}
  // />
};
