import { useState } from "react";
import { Switch } from "../components/input/Switch";
import { colorOptions } from "../providers/theme/types";

export const SwitchDemo = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div>
      <Switch
        checked={isActive}
        checkedColor={colorOptions.success}
        // uncheckedColor={colorOptions.error}
        hasUncheckedIcon
        // mode={colorOptions.primary}
        onChange={(e) => {
          setIsActive(e.target.checked);
        }}
      />
    </div>
  );
};
