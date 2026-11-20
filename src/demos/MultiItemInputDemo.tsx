import { useState } from "react";
import { MultiItemInput } from "../components";
import {
  colorOptions,
  fillOptions,
} from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoSection,
} from "./DemoLayout";

export const MultiItemInputDemo = () => {
  const [tags, setTags] = useState("react,typescript,");
  const [emptyTags, setEmptyTags] = useState("");

  return (
    <DemoPage
      title="MultiItemInput"
      description="Input that turns words into removable FilterChips on space or comma."
    >
      <DemoSection title="With tags">
        <MultiItemInput
          id="demo-tags"
          label="Tags"
          value={tags}
          onChange={setTags}
          supportText="Press space or comma to add a tag"
        />
        <code>{tags || "(empty)"}</code>
      </DemoSection>

      <DemoSection title="Empty">
        <MultiItemInput
          id="demo-empty-tags"
          label="Skills"
          value={emptyTags}
          onChange={setEmptyTags}
          placeholder="react typescript scss"
          fill={fillOptions.outline}
          colorMode={colorOptions.secondary}
        />
      </DemoSection>

      <DemoNote>
        Click a chip to remove it. The controlled value is the raw comma
        separated string.
      </DemoNote>
    </DemoPage>
  );
};
