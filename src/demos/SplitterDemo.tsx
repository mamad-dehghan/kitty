import { Splitter } from "../components";
import {
  DemoFrame,
  DemoNote,
  DemoPage,
  DemoSection,
} from "./DemoLayout";

const Panel = ({ label }: { label: string }) => (
  <div className="demo-panel">{label}</div>
);

export const SplitterDemo = () => {
  return (
    <DemoPage
      title="Splitter"
      description="Resizable two-panel layout with draggable dividers and minimum sizes."
    >
      <DemoSection title="Horizontal">
        <DemoFrame height="320px">
          <Splitter
            layout="horizontal"
            panels={[
              {
                Element: <Panel label="Left panel" />,
                minSize: "120px",
                hideable: true,
              },
              {
                Element: <Panel label="Right panel" />,
                minSize: "120px",
              },
            ]}
          />
        </DemoFrame>
      </DemoSection>

      <DemoSection title="Vertical">
        <DemoFrame height="360px">
          <Splitter
            layout="vertical"
            panels={[
              {
                Element: <Panel label="Top panel" />,
                minSize: "80px",
              },
              {
                Element: <Panel label="Bottom panel" />,
                minSize: "80px",
              },
            ]}
          />
        </DemoFrame>
        <DemoNote>
          Drag the divider to resize. A hideable panel collapses below
          two-thirds of its minimum size.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};
