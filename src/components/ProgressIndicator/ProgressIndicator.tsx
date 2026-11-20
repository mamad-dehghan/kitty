import classNames from "classnames";
import {
  type CSSProperties,
  type HTMLAttributes,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { colorOptions, sizeOptions } from "../../providers/Theme/types";
import { variantClasses } from "../../providers/Theme/variants";
import {
  PROGRESS_GAP,
  buildCircularWavePath,
  buildLinearWavePath,
  getCircularTokens,
  getLinearTokens,
  getProgressRatio,
} from "./geometry";
import "./ProgressIndicator.scss";

type CSSVariables = CSSProperties & Record<`--${string}`, string | number>;

export interface IProgressIndicatorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** @default "linear" */
  type?: "linear" | "circular";
  value: number;
  /** @default 1 */
  max?: number;
  /** @default colorOptions.primary */
  colorMode?: colorOptions;
  /** @default sizeOptions.medium */
  size?: sizeOptions;
  /** Use the Material 3 Expressive wavy geometry. @default false */
  wave?: boolean;
}

const useElementWidth = (enabled: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      const nextWidth = element.getBoundingClientRect().width;

      setWidth((currentWidth) =>
        Math.abs(currentWidth - nextWidth) > 0.1 ? nextWidth : currentWidth,
      );
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);

    observer.observe(element);

    return () => observer.disconnect();
  }, [enabled]);

  return { ref, width };
};

type LinearWaveProps = {
  width: number;
  height: number;
  thickness: number;
  amplitude: number;
  wavelength: number;
  ratio: number;
};

const LinearWave = ({
  width,
  height,
  thickness,
  amplitude,
  wavelength,
  ratio,
}: LinearWaveProps) => {
  const path = useMemo(
    () =>
      buildLinearWavePath({
        width,
        thickness,
        amplitude,
        wavelength,
      }),
    [width, thickness, amplitude, wavelength],
  );

  if (width <= 0 || !path.d || path.totalLength <= 0) {
    return null;
  }

  const startX = thickness / 2;
  const endX = Math.max(
    startX,
    Math.min(width - thickness / 2, ratio * width - thickness / 2),
  );
  const activeLength = ratio > 0 ? Math.max(path.lengthAtX(endX), 0.01) : 0;

  return (
    <svg
      className="progress-indicator__wave"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="progress-indicator__wave-path"
        d={path.d}
        fill="none"
        strokeWidth={thickness}
        style={{
          strokeDasharray: `${activeLength} ${path.totalLength}`,
          strokeDashoffset: 0,
          opacity: ratio > 0 ? 1 : 0,
        }}
      />
    </svg>
  );
};

type CircularProgressProps = {
  diameter: number;
  thickness: number;
  amplitude: number;
  wavelength: number;
  ratio: number;
  wave: boolean;
};

const CircularProgress = ({
  diameter,
  thickness,
  amplitude,
  wavelength,
  ratio,
  wave,
}: CircularProgressProps) => {
  const center = diameter / 2;
  const radius = (diameter - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapPercent = ((PROGRESS_GAP + thickness) / circumference) * 100;
  const activePercent = ratio * 100;
  const trackStartPercent =
    ratio === 0 ? 0 : Math.min(100, activePercent + gapPercent);
  const trackLengthPercent =
    ratio === 0 ? 100 : Math.max(0, 100 - gapPercent - trackStartPercent);
  const trackOffset = ratio === 0 ? 0 : -trackStartPercent;
  const wavePath = useMemo(
    () =>
      wave
        ? buildCircularWavePath({
            diameter,
            thickness,
            amplitude,
            wavelength,
          })
        : null,
    [wave, diameter, thickness, amplitude, wavelength],
  );

  const activeDash =
    wavePath && wavePath.totalLength > 0
      ? `${
          ratio > 0
            ? Math.max(wavePath.lengthAtAngle(ratio * Math.PI * 2), 0.01)
            : 0
        } ${wavePath.totalLength}`
      : `${activePercent} 100`;

  return (
    <svg
      className="progress-indicator__circular"
      viewBox={`0 0 ${diameter} ${diameter}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="progress-indicator__circular-track"
        cx={center}
        cy={center}
        r={radius}
        pathLength={100}
        fill="none"
        strokeWidth={thickness}
        transform={`rotate(-90 ${center} ${center})`}
        style={{
          strokeDasharray: `${trackLengthPercent} 100`,
          strokeDashoffset: trackOffset,
          opacity: ratio >= 1 ? 0 : 1,
        }}
      />

      {wavePath && wavePath.totalLength > 0 ? (
        <path
          className="progress-indicator__circular-active"
          d={wavePath.d}
          fill="none"
          strokeWidth={thickness}
          style={{
            strokeDasharray: activeDash,
            strokeDashoffset: 0,
            opacity: ratio > 0 ? 1 : 0,
          }}
        />
      ) : (
        <circle
          className="progress-indicator__circular-active"
          cx={center}
          cy={center}
          r={radius}
          pathLength={100}
          fill="none"
          strokeWidth={thickness}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            strokeDasharray: `${activePercent} 100`,
            strokeDashoffset: 0,
            opacity: ratio > 0 ? 1 : 0,
          }}
        />
      )}
    </svg>
  );
};

export const ProgressIndicator = ({
  type = "linear",
  value,
  max = 1,
  colorMode = colorOptions.primary,
  size = sizeOptions.medium,
  wave = false,
  className,
  style,
  ...others
}: IProgressIndicatorProps) => {
  const ratio = getProgressRatio(value, max);
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const safeValue = Number.isFinite(value) ? value : 0;
  const isLinear = type === "linear";
  const linearTokens = getLinearTokens(size, wave);
  const circularTokens = getCircularTokens(size, wave);
  const { ref, width } = useElementWidth(isLinear && wave);
  const variables: CSSVariables = {
    "--kitty-progress-ratio": String(ratio),
    "--pi-thickness": `${
      isLinear ? linearTokens.thickness : circularTokens.thickness
    }px`,
    "--pi-gap": `${PROGRESS_GAP}px`,
    ...(isLinear
      ? { "--pi-height": `${linearTokens.height}px` }
      : { "--pi-size": `${circularTokens.diameter}px` }),
  };
  const rootStyle: CSSProperties = { ...variables, ...style };

  return (
    <div
      ref={ref}
      className={classNames(
        "progress-indicator",
        `progress-indicator--${type}`,
        wave && "progress-indicator--wave",
        variantClasses({ colorMode, size }),
        className,
      )}
      style={rootStyle}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={Math.max(0, Math.min(safeMax, safeValue))}
      {...others}
    >
      {isLinear && wave ? (
        <LinearWave
          width={width}
          height={linearTokens.height}
          thickness={linearTokens.thickness}
          amplitude={linearTokens.amplitude}
          wavelength={linearTokens.wavelength}
          ratio={ratio}
        />
      ) : null}

      {!isLinear ? (
        <CircularProgress
          diameter={circularTokens.diameter}
          thickness={circularTokens.thickness}
          amplitude={circularTokens.amplitude}
          wavelength={circularTokens.wavelength}
          ratio={ratio}
          wave={wave}
        />
      ) : null}
    </div>
  );
};
