import { useState } from "react";
import { Switch } from "../components/input/Switch";
import { colorOptions } from "../providers/theme/types";

export const SwitchDemo = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div>
      <Switch
        checked={isActive}
        checkedColorMode={colorOptions.success}
        // uncheckedColorMode={colorOptions.error}
        hasUncheckedIcon
        // colorMode={colorOptions.primary}
        onChange={(e) => {
          setIsActive(e.target.checked);
        }}
      />
    </div>
  );
};
