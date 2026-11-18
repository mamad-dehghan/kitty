import { LoadingIndicator } from "../components/LoadingIndicator/LoadingIndicator";
import { ProgressIndicator } from "../components/ProgressIndicator/ProgressIndicator";

export const LoadingDemo = () => {
  return (
    <>
      <ProgressIndicator type="linear" value={97} max={100} />
      <LoadingIndicator size={320} frame={false} />
    </>
  );
};
