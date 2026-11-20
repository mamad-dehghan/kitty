import {
  CopyIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Button, Menu } from "../components";
import { fillOptions } from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

const items = [
  {
    label: "Edit",
    leadingIcon: PencilSimpleIcon,
    onClick: () => undefined,
  },
  {
    label: "Duplicate",
    leadingIcon: CopyIcon,
    onClick: () => undefined,
  },
  "separator" as const,
  {
    label: "Share",
    leadingIcon: ShareNetworkIcon,
    items: [
      { label: "Copy link", onClick: () => undefined },
      { label: "Email", onClick: () => undefined },
      { label: "Message", onClick: () => undefined },
    ],
  },
  {
    label: "Delete",
    leadingIcon: TrashIcon,
    onClick: () => undefined,
  },
];

export const MenuDemo = () => {
  const [targetEl, setTargetEl] = useState<DOMRect>();
  const [compactTargetEl, setCompactTargetEl] = useState<DOMRect>();

  const close = () => setTargetEl(undefined);
  const closeCompact = () => setCompactTargetEl(undefined);

  return (
    <DemoPage
      title="Menu"
      description="Portalled menu with icons, separators and nested submenus."
    >
      <DemoSection title="Nested menu">
        <DemoRow>
          <Button
            fill={fillOptions.outline}
            onClick={(event) =>
              setTargetEl(event.currentTarget.getBoundingClientRect())
            }
          >
            Open menu
          </Button>
        </DemoRow>

        <Menu
          isOpen={Boolean(targetEl)}
          targetEl={targetEl}
          onClose={close}
          items={items}
          hideLeadingIcon={false}
        />

        <DemoNote>
          Nested items open a second menu; selecting an action closes the root
          menu.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Compact, fit content">
        <DemoRow>
          <Button
            fill={fillOptions.tonal}
            onClick={(event) =>
              setCompactTargetEl(event.currentTarget.getBoundingClientRect())
            }
          >
            Compact menu
          </Button>
        </DemoRow>

        <Menu
          isOpen={Boolean(compactTargetEl)}
          targetEl={compactTargetEl}
          onClose={closeCompact}
          compact
          fitContent
          hideLeadingIcon
          items={[
            { label: "First", onClick: closeCompact },
            { label: "Second", onClick: closeCompact },
          ]}
          position={[{ vertical: "bottom", horizontal: "right" }]}
        />
      </DemoSection>
    </DemoPage>
  );
};
