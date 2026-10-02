import { LoadingIndicator } from "../components/loading/LoadingIndicator";
import { ProgressIndicator } from "../components/loading/ProgressIndicator";

export const LoadingDemoPage = () => {
  return (
    <>
      <ProgressIndicator type="linear" value={97} max={100} />
      <LoadingIndicator size={320} frame={false} />
    </>
  );
};
