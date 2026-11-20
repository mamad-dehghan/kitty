import { sizeOptions } from "../../providers/Theme/types";

/** Visual gap between the active indicator and the track. */
export const PROGRESS_GAP = 4;

export type LinearTokens = {
  thickness: number;
  height: number;
  amplitude: number;
  wavelength: number;
};

export type CircularTokens = {
  diameter: number;
  thickness: number;
  amplitude: number;
  wavelength: number;
};

const linearThickness: Record<sizeOptions, number> = {
  [sizeOptions.small]: 2,
  [sizeOptions.medium]: 4,
  [sizeOptions.large]: 8,
};

const circularFlatSize: Record<
  sizeOptions,
  { diameter: number; thickness: number }
> = {
  [sizeOptions.small]: { diameter: 24, thickness: 3 },
  [sizeOptions.medium]: { diameter: 40, thickness: 4 },
  [sizeOptions.large]: { diameter: 56, thickness: 5 },
};

export const getLinearTokens = (
  size: sizeOptions,
  wave: boolean,
): LinearTokens => {
  const thickness = linearThickness[size];
  const amplitude = wave ? thickness * 0.75 : 0;

  return {
    thickness,
    height: thickness + amplitude * 2,
    amplitude,
    wavelength: wave ? thickness * 10 : 0,
  };
};

export const getCircularTokens = (
  size: sizeOptions,
  wave: boolean,
): CircularTokens => {
  const base = circularFlatSize[size];

  if (!wave) {
    return { ...base, amplitude: 0, wavelength: 0 };
  }

  return {
    diameter: base.diameter + 8,
    thickness: base.thickness,
    amplitude: base.thickness * 0.4,
    wavelength: base.thickness * 3.75,
  };
};

export const getProgressRatio = (value: number, max: number) => {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const safeValue = Number.isFinite(value) ? value : 0;

  return Math.max(0, Math.min(1, safeValue / safeMax));
};

type QuadraticSegment = {
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x1: number;
  y1: number;
};

type PathSample = {
  x: number;
  length: number;
};

export type LinearWavePath = {
  d: string;
  totalLength: number;
  lengthAtX: (x: number) => number;
};

export type CircularWavePath = {
  d: string;
  totalLength: number;
  lengthAtAngle: (angle: number) => number;
};

const format = (value: number) => String(Math.round(value * 100) / 100);

const quadraticPoint = (segment: QuadraticSegment, t: number) => {
  const inverse = 1 - t;

  return {
    x:
      inverse * inverse * segment.x0 +
      2 * inverse * t * segment.cx +
      t * t * segment.x1,
    y:
      inverse * inverse * segment.y0 +
      2 * inverse * t * segment.cy +
      t * t * segment.y1,
  };
};

const splitQuadratic = (
  segment: QuadraticSegment,
  t: number,
): [QuadraticSegment, QuadraticSegment] => {
  const firstControl = {
    x: segment.x0 + (segment.cx - segment.x0) * t,
    y: segment.y0 + (segment.cy - segment.y0) * t,
  };
  const secondControl = {
    x: segment.cx + (segment.x1 - segment.cx) * t,
    y: segment.cy + (segment.y1 - segment.cy) * t,
  };
  const end = quadraticPoint(segment, t);

  return [
    {
      x0: segment.x0,
      y0: segment.y0,
      cx: firstControl.x,
      cy: firstControl.y,
      x1: end.x,
      y1: end.y,
    },
    {
      x0: end.x,
      y0: end.y,
      cx: secondControl.x,
      cy: secondControl.y,
      x1: segment.x1,
      y1: segment.y1,
    },
  ];
};

/**
 * Builds the active wavy path used by the linear indicator.
 *
 * M3's wave is approximated with quadratic segments, one per half
 * wavelength. The control point reaches `2 * amplitude`, which makes the
 * quadratic peak at exactly `amplitude`.
 */
export const buildLinearWavePath = ({
  width,
  thickness,
  amplitude,
  wavelength,
}: {
  width: number;
  thickness: number;
  amplitude: number;
  wavelength: number;
}): LinearWavePath => {
  const xStart = thickness / 2;
  const xEnd = width - thickness / 2;

  if (
    width <= thickness ||
    xEnd <= xStart ||
    wavelength <= 0 ||
    amplitude <= 0
  ) {
    return { d: "", totalLength: 0, lengthAtX: () => 0 };
  }

  const centerY = thickness / 2 + amplitude;
  const halfWavelength = wavelength / 2;
  const segments: QuadraticSegment[] = [];
  let currentX = xStart;
  let direction = 1;
  let segmentCount = 0;

  while (currentX < xEnd - 0.001 && segmentCount < 10_000) {
    const fullNextX = currentX + halfWavelength;
    const controlX = currentX + halfWavelength / 2;
    const controlY = centerY + direction * amplitude * 2;
    const segment: QuadraticSegment = {
      x0: currentX,
      y0: centerY,
      cx: controlX,
      cy: controlY,
      x1: fullNextX,
      y1: centerY,
    };

    if (fullNextX <= xEnd + 0.001) {
      segments.push(segment);
      currentX = fullNextX;
    } else {
      const t = (xEnd - currentX) / (fullNextX - currentX);
      segments.push(splitQuadratic(segment, t)[0]);
      currentX = xEnd;
    }

    direction *= -1;
    segmentCount += 1;
  }

  let d = `M ${format(xStart)} ${format(centerY)}`;

  for (const segment of segments) {
    d += ` Q ${format(segment.cx)} ${format(segment.cy)} ${format(
      segment.x1,
    )} ${format(segment.y1)}`;
  }

  const samples: PathSample[] = [{ x: xStart, length: 0 }];
  let totalLength = 0;
  let previous = { x: xStart, y: centerY };

  for (const segment of segments) {
    const steps = 16;

    for (let step = 1; step <= steps; step += 1) {
      const point = quadraticPoint(segment, step / steps);
      totalLength += Math.hypot(point.x - previous.x, point.y - previous.y);
      samples.push({ x: point.x, length: totalLength });
      previous = point;
    }
  }

  const lengthAtX = (targetX: number) => {
    if (targetX <= xStart) {
      return 0;
    }

    if (targetX >= xEnd) {
      return totalLength;
    }

    let low = 0;
    let high = samples.length - 1;

    while (low < high - 1) {
      const middle = Math.floor((low + high) / 2);

      if ((samples[middle]?.x ?? Infinity) <= targetX) {
        low = middle;
      } else {
        high = middle;
      }
    }

    const start = samples[low]!;
    const end = samples[high]!;
    const span = end.x - start.x;
    const progress = span === 0 ? 0 : (targetX - start.x) / span;

    return start.length + (end.length - start.length) * progress;
  };

  return { d, totalLength, lengthAtX };
};

/**
 * Builds the active wavy path used by the circular indicator.
 *
 * The waveform is a radial sine with an integer number of lobes so the
 * closed path joins seamlessly. The peaks touch the track's circle and the
 * valleys move inward, matching the M3 expressive ring.
 */
export const buildCircularWavePath = ({
  diameter,
  thickness,
  amplitude,
  wavelength,
}: {
  diameter: number;
  thickness: number;
  amplitude: number;
  wavelength: number;
}): CircularWavePath => {
  const center = diameter / 2;
  const trackRadius = (diameter - thickness) / 2;

  if (trackRadius <= 0 || wavelength <= 0 || amplitude <= 0) {
    return { d: "", totalLength: 0, lengthAtAngle: () => 0 };
  }

  const meanRadius = trackRadius - amplitude;
  const lobes = Math.max(
    4,
    Math.round((2 * Math.PI * trackRadius) / wavelength),
  );
  const sampleCount = Math.max(360, lobes * 24);
  const step = (2 * Math.PI) / sampleCount;
  const firstPoint = {
    x: center,
    y: center - meanRadius,
  };
  const points: Array<{ x: number; y: number }> = [firstPoint];
  const lengths: number[] = [0];
  let totalLength = 0;
  let previousPoint = firstPoint;

  for (let index = 1; index <= sampleCount; index += 1) {
    const angle = index * step;
    const radius = meanRadius + amplitude * Math.sin(lobes * angle);
    const point = {
      x: center + radius * Math.sin(angle),
      y: center - radius * Math.cos(angle),
    };

    points.push(point);
    totalLength += Math.hypot(
      point.x - previousPoint.x,
      point.y - previousPoint.y,
    );
    lengths.push(totalLength);
    previousPoint = point;
  }

  const d =
    `M ${format(firstPoint.x)} ${format(firstPoint.y)} ` +
    points
      .slice(1)
      .map((point) => `L ${format(point.x)} ${format(point.y)}`)
      .join(" ") +
    " Z";

  const lengthAtAngle = (angle: number) => {
    const normalized = Math.max(0, Math.min(Math.PI * 2, angle));
    const position = (normalized / (Math.PI * 2)) * sampleCount;
    const low = Math.floor(position);
    const high = Math.min(sampleCount, low + 1);
    const progress = position - low;
    const start = lengths[low] ?? 0;
    const end = lengths[high] ?? start;

    return start + (end - start) * progress;
  };

  return { d, totalLength, lengthAtAngle };
};
