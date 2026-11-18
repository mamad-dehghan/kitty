import { DiceOneIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { IconButton, Input } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";

export const SplitButtonDemo = () => {
  const [hasError, setError] = useState(false);
  const [text, setText] = useState("csa");
  return (
    <div style={{ margin: "10px" }}>
      {/*<GroupButton>
        <Button colorMode={colorOptions.error}>First</Button>
        <Button> Second</Button>
        <Button>{">"}</Button>
        <IconButton
          size={sizeOptions.small}
          colorMode={colorOptions.primary}
          fill={fillOptions.fill}
          Icon={CaretDownIcon}
          enable
        />
      </GroupButton>*/}
      {/*<Button colorMode={colorOptions.error} fill={fillOptions.outline} disabled>
        First
      </Button>
      <Button colorMode={colorOptions.error} fill={fillOptions.outline}>
        First
      </Button>
      <Button colorMode={colorOptions.error}> First</Button>*/}

      <Input
        id={"oi"}
        colorMode={colorOptions.secondary}
        fill={fillOptions.fill}
        placeholder="Help me!"
        hasError={hasError}
        supportText={text}
        label="Help me!"
        // iconEnd={<DiceOneIcon />}
        iconEnd={
          <IconButton
            size={sizeOptions.small}
            // colorMode={colorOptions.secondary}
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
        //     // colorMode={colorOptions.secondary}
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
        colorMode={colorOptions.primary}
        fill={fillOptions.fill}
        Icon={CaretDownIcon}
        enable
      />*/}
    </div>
  );
};
