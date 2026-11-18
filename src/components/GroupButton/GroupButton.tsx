import { type ReactNode } from "react";

import "./GroupButton.scss";
import classNames from "classnames";
import { sizeOptions } from "../../providers/Theme/types";
import { sizeClass } from "../../providers/Theme/variants";

type props = {
  children: ReactNode[];
  /** @default sizeOptions.medium */
  size?: sizeOptions;
};
// const GroupButtonSeparator = () => <div className="group-button--separator" />;

export const GroupButton = ({
  children,
  size = sizeOptions.medium,
}: props) => {
  return (
    <div className={classNames("group-button", sizeClass(size))}>
      {children}
      {/*{children.reduce((first, second) => (
        <>
          {first}
          <GroupButtonSeparator />
          {second}
        </>
      ))}*/}
    </div>
  );
};
