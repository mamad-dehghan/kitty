import { LoadingIndicator } from "../components";
import {
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

export const LoadingIndicatorDemo = () => {
  return (
    <DemoPage
      title="LoadingIndicator"
      description="Animated SVG that cycles through the exported shape set."
    >
      <DemoSection title="Framed">
        <DemoRow>
          <LoadingIndicator size={64} />
          <LoadingIndicator size={96} />
          <LoadingIndicator size="8rem" />
        </DemoRow>
      </DemoSection>

      <DemoSection title="Without frame">
        <DemoRow>
          <LoadingIndicator size={64} frame={false} />
          <LoadingIndicator size={96} frame={false} />
          <LoadingIndicator size="8rem" frame={false} />
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};
