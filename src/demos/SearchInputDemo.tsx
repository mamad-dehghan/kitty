import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { IconButton, SearchInput } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";
import {
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

export const SearchInputDemo = () => {
  const [query, setQuery] = useState("");

  return (
    <DemoPage
      title="SearchInput"
      description="Search field with optional start/end icons and colorMode variants."
    >
      <DemoSection title="Basic">
        <SearchInput
          placeholder="Search components…"
          iconStart={<MagnifyingGlassIcon />}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <SearchInput
          placeholder="With a clear action"
          iconStart={<MagnifyingGlassIcon />}
          iconEnd={
            query ? (
              <IconButton
                Icon={XIcon}
                fill={fillOptions.link}
                colorMode={colorOptions.primary}
                size={sizeOptions.small}
                onClick={() => setQuery("")}
              />
            ) : undefined
          }
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </DemoSection>

      <DemoSection title="Colors">
        <DemoRow>
          {[
            colorOptions.primary,
            colorOptions.secondary,
            colorOptions.tertiary,
            colorOptions.success,
            colorOptions.warning,
            colorOptions.error,
          ].map((colorMode) => (
            <SearchInput
              key={colorMode}
              colorMode={colorMode}
              placeholder={colorMode}
              iconStart={<MagnifyingGlassIcon />}
            />
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Disabled">
        <SearchInput
          placeholder="Disabled"
          iconStart={<MagnifyingGlassIcon />}
          disabled
        />
      </DemoSection>
    </DemoPage>
  );
};
