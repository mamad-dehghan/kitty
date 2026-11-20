import { Divider } from "../components";
import {
  DemoPage,
  DemoSection,
} from "./DemoLayout";

const box = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  width: "100%",
  maxWidth: "24rem",
  padding: "0.75rem",
  border: "1px dashed hsl(var(--outline))",
  borderRadius: "var(--radius-medium)",
} as const;

export const DividerDemo = () => {
  return (
    <DemoPage
      title="Divider"
      description="Hairline separator with intent, centered and full-width variants."
    >
      <DemoSection title="Types">
        <div style={box}>
          <span>Intent</span>
          <Divider />
          <span>Centered</span>
          <Divider type="center" />
          <span>Full width</span>
          <Divider type="fullWidth" />
        </div>
      </DemoSection>

      <DemoSection title="Inside content">
        <div style={box}>
          <p>Section one</p>
          <Divider type="fullWidth" />
          <p>Section two</p>
          <Divider type="fullWidth" />
          <p>Section three</p>
        </div>
      </DemoSection>
    </DemoPage>
  );
};
