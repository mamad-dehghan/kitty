import { DiceOneIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { IconButton, Input } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/theme/types";

export const MultiButtonDemo = () => {
  const [hasError, setError] = useState(false);
  const [text, setText] = useState("csa");
  return (
    <div style={{ margin: "10px" }}>
      {/*<GroupButton>
        <Button mode={colorOptions.error}>First</Button>
        <Button> Second</Button>
        <Button>{">"}</Button>
        <IconButton
          size={sizeOptions.small}
          mode={colorOptions.primary}
          fill={fillOptions.fill}
          Icon={CaretDownIcon}
          enable
        />
      </GroupButton>*/}
      {/*<Button mode={colorOptions.error} fill={fillOptions.outline} disabled>
        First
      </Button>
      <Button mode={colorOptions.error} fill={fillOptions.outline}>
        First
      </Button>
      <Button mode={colorOptions.error}> First</Button>*/}

      <Input
        id={"oi"}
        mode={colorOptions.primary}
        fill={fillOptions.fill}
        color={colorOptions.secondary}
        placeholder="Help me!"
        hasError={hasError}
        supportText={text}
        label="Help me!"
        // iconEnd={<DiceOneIcon />}
        iconEnd={
          <IconButton
            size={sizeOptions.small}
            // mode={colorOptions.secondary}
            fill={fillOptions.fill}
            Icon={DiceOneIcon}
            enable
            onClick={() => {
              setError((p) => !p);
              setText((p) => (p ? "" : "axlic"));
            }}
          />
        }
        // iconStart={
        //   <Button
        //     // mode={colorOptions.secondary}
        //     fill={fillOptions.fill}
        //     icon={<CaretDownIcon />}
        //     iconSide="start"
        //     // Icon={CaretDownIcon}
        //     // enable
        //   >
        //     Open
        //   </Button>
        // }
      />
      {/*<Button>{">"}</Button>
      <IconButton
        size={sizeOptions.small}
        mode={colorOptions.primary}
        fill={fillOptions.fill}
        Icon={CaretDownIcon}
        enable
      />*/}
    </div>
  );
};
