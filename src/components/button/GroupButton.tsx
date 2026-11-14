import { type ReactNode } from "react";

import "./groupButton.scss";
import classNames from "classnames";
import { sizeOptions } from "../../providers/theme/types";
import { sizeClass } from "../../providers/theme/variants";

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
