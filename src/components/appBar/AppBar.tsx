import classNames from "classnames";
import { type ReactElement } from "react";
import { sizeOptions } from "../../providers";
import "./app_bar.scss";

type props = {
  left: ReactElement[];
  right: ReactElement[];
  center:
    | { type: "search" }
    | {
        type: sizeOptions;
        align?: "center" | "start";
        heading: string;
        subtitle?: string;
      };
};

export const AppBar = ({ left, center, right }: props) => {
  return (
    <>
      <div
        className={classNames(
          "app-bar",
          center.type !== "search" && center.align === "center" && "center",
        )}
      >
        <div className="app-bar--section left">{left}</div>
        {center.type === "search" ? (
          <></>
        ) : (
          <div
            className={classNames(
              "app-bar--section",
              "center",
              (center.align ?? "start") + "-text",
              center.type,
            )}
          >
            <div className="app-bar--extend-heading">{center.heading}</div>
            <div className="app-bar--extend-subtitle">{center.subtitle}</div>
          </div>
        )}
        {/*<div className="content">
            content
          </div>*/}
        <div className="app-bar--section right">{right}</div>
      </div>
      {center.type === sizeOptions.medium ||
      center.type === sizeOptions.large ? (
        <div
          className={classNames(
            "app-bar--extend",
            (center.align ?? "start") + "-text",
            center.type,
          )}
        >
          <div className="app-bar--extend-heading">{center.heading}</div>
          <div className="app-bar--extend-subtitle">{center.subtitle}</div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
