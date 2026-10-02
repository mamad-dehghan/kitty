import classNames from 'classnames';
import { useEffect, useState } from 'react';
import SVG from 'react-inlinesvg';
import { _4_side_cookie, _9_side_cookie, oval, pentagon, pill, sunny } from "../../styles/shapes";
import "./loading_indicator.scss";

type props = {
  frame?: boolean;
  size?: number | string;
};

const SHAPES = [_9_side_cookie, oval, _4_side_cookie, sunny, pill, pentagon];
const CHANGE_TIME_MS = 1000;

export const LoadingIndicator = ({ size = "4rem", frame = true }: props) => {
  const [shapeIndex, setShapeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShapeIndex(pre => pre <= 0 ? SHAPES.length - 1 : pre - 1)
    }, CHANGE_TIME_MS);

    return () => {
      clearInterval(interval)
    }
  }, [shapeIndex]);

  return (
    <div
      className={classNames("loading-indicator", frame ? "with-frame" : "without-frame")}
      style={{
        width: size,
      }}
    >
      <SVG
        src={SHAPES[shapeIndex]}
        style={{
          animationDuration: `${CHANGE_TIME_MS}ms`
        }}
      />
    </div>
  );
};
