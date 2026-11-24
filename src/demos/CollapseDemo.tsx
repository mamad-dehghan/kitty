import { CaretDownIcon } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { Button, Collapse } from "../components";
import { fillOptions } from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";
import "./CollapseDemo.scss";

const faqItems = [
  {
    id: "sync",
    title: "How does offline sync work?",
    body: "Changes are written locally first and queued for upload. When the connection returns, the queue is replayed in order and conflicts are resolved against the latest server revision.",
  },
  {
    id: "access",
    title: "Who can see a shared workspace?",
    body: "Every member of the workspace can read its notes and comments. Only admins can invite new people or change retention settings.",
  },
  {
    id: "export",
    title: "Can I export my data?",
    body: "Open the workspace menu and choose Export. A ZIP archive with Markdown files and attachments is prepared and downloaded to your device.",
  },
];

const DraftField = ({ id }: { id: string }) => {
  const [value, setValue] = useState("");

  return (
    <div className="collapse-demo__field">
      <label htmlFor={id}>Draft message</label>
      <input
        id={id}
        value={value}
        placeholder="This value resets when the panel unmounts"
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
};

export const CollapseDemo = () => {
  const baseId = useId().replaceAll(":", "");
  const [openItem, setOpenItem] = useState<string | null>("sync");
  const [horizontalOpen, setHorizontalOpen] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);
  const [unmountOpen, setUnmountOpen] = useState(false);

  return (
    <DemoPage
      title="Collapse"
      description="Animates content between a collapsed size and its natural auto size, vertically or horizontally."
    >
      <DemoSection
        title="Accordion list"
        description="The Material 3 pattern: an expandable list row whose button owns aria-expanded and aria-controls."
      >
        <div className="collapse-demo__list">
          {faqItems.map((item) => {
            const open = openItem === item.id;
            const triggerId = `${baseId}-trigger-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;

            return (
              <div key={item.id} className="collapse-demo__item">
                <button
                  id={triggerId}
                  type="button"
                  className="collapse-demo__trigger"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenItem(open ? null : item.id)}
                >
                  <span>{item.title}</span>
                  <CaretDownIcon aria-hidden="true" />
                </button>
                <Collapse
                  isOpen={open}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                >
                  <div className="collapse-demo__body">{item.body}</div>
                </Collapse>
              </div>
            );
          })}
        </div>
        <DemoNote>
          Only one row is open at a time here. `Collapse` is controlled by
          `isOpen`; the row owns the button semantics and the panel stays in the
          DOM so its content keeps its state. Closed panels are `inert`, so
          their content is not focusable or clickable.
        </DemoNote>
      </DemoSection>

      <DemoSection
        title="Horizontal orientation"
        description="The same transition on the inline axis using an auto width."
      >
        <div className="collapse-demo__toolbar">
          <Button
            fill={horizontalOpen ? fillOptions.tonal : fillOptions.outline}
            onClick={() => setHorizontalOpen((value) => !value)}
          >
            {horizontalOpen ? "Hide" : "Show"} workspaces
          </Button>
          <Collapse isOpen={horizontalOpen} orientation="horizontal">
            <div className="collapse-demo__cards">
              <div className="collapse-demo__card">Design</div>
              <div className="collapse-demo__card">Engineering</div>
              <div className="collapse-demo__card">Research</div>
            </div>
          </Collapse>
        </div>
      </DemoSection>

      <DemoSection
        title="Collapsed size"
        description="Keep a preview visible while the rest of the content is clipped."
      >
        <DemoRow>
          <Button
            fill={peekOpen ? fillOptions.tonal : fillOptions.outline}
            onClick={() => setPeekOpen((value) => !value)}
          >
            {peekOpen ? "Collapse to preview" : "Expand release notes"}
          </Button>
        </DemoRow>
        <Collapse isOpen={peekOpen} collapsedSize="4.25rem">
          <div className="collapse-demo__peek">
            <h3>Release notes</h3>
            <p>
              The collapsed panel keeps its first 4.25rem visible. The remaining
              content is clipped and revealed when `isOpen` becomes true.
            </p>
            <p>
              Expand and collapse repeatedly: the measured content height is
              reused, so the animation always starts from the current size.
            </p>
          </div>
        </Collapse>
        <DemoNote>
          A non-zero `collapsedSize` is useful for summaries, toolbars, or
          navigation sections that should show a hint of their content.
        </DemoNote>
      </DemoSection>

      <DemoSection
        title="Unmount on exit"
        description="Remove the content after the exit transition when state should not survive."
      >
        <DemoRow>
          <Button
            fill={unmountOpen ? fillOptions.tonal : fillOptions.outline}
            onClick={() => setUnmountOpen((value) => !value)}
          >
            {unmountOpen ? "Close draft" : "Open draft"}
          </Button>
        </DemoRow>
        <Collapse isOpen={unmountOpen} unmountOnExit>
          <DraftField id={`${baseId}-draft`} />
        </Collapse>
        <DemoNote>
          Type a value, close the panel, then open it again. With
          `unmountOnExit`, the field is removed after the collapse finishes and
          its local state starts over.
        </DemoNote>
      </DemoSection>

      <DemoNote>
        Material Design 3 has no standalone Collapse component; it treats
        expand and collapse as motion and composes it into list rows and
        navigation. Kitty follows MUI&apos;s measurement approach so auto-height
        content animates correctly, uses `duration="auto"` by default, and
        respects `prefers-reduced-motion`.
      </DemoNote>
    </DemoPage>
  );
};
