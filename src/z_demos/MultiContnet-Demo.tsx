import { useEffect, useState, type JSX } from "react";
import { MultiContent } from "../components/mulitContent/MultiContent";
import { DiceFiveIcon, DiceFourIcon } from "@phosphor-icons/react";

const ElOptions1: JSX.Element[] = [
  <DiceFourIcon
    width="12rem"
    height="12rem"
    fill="blue"
    style={{ background: "brown" }}
  />,
  <DiceFiveIcon
    width="12rem"
    height="12rem"
    fill="red"
    style={{ background: "navy" }}
  />,
];
// const ElOptions2 = [<DiceOne width="12rem" height="12rem" fill="blue" />, <DiceTwo width="12rem" height="12rem" fill="red" />]
const ElOptions2: JSX.Element[] = [
  <span style={{ background: "brown" }} />,
  <span style={{ background: "grey" }} />,
];

export const MultiContentDemo = () => {
  const [El1, setEl1] = useState<JSX.Element>(ElOptions1[0]!);
  const [El2, setEl2] = useState<JSX.Element>(ElOptions2[0]!);
  useEffect(() => {
    const interval1 = setInterval(() => {
      setEl1((pre) =>
        pre === ElOptions1[0] ? ElOptions1[1]! : ElOptions1[0]!,
      );
    }, 4000);
    const interval2 = setInterval(() => {
      setEl2((pre) =>
        pre === ElOptions2[0] ? ElOptions2[1]! : ElOptions2[0]!,
      );
    }, 6000);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  return (
    <div style={{}}>
      <MultiContent
        transitionTo="bottom"
        width="12rem"
        height="12rem"
        wrapperProps={{
          style: {},
        }}
      >
        {El1}
      </MultiContent>
      <MultiContent
        transitionTo="bottom"
        width="100%"
        height="8rem"
        wrapperProps={{
          style: {
            // width: "12rem",
            // height: "12rem"
          },
        }}
      >
        {El2}
      </MultiContent>
      {/*<MultiContentCss
        transitionTo="left"
      // direction="horizontal"
      >
        {
          El1
        }
      </MultiContentCss>*/}
      {/*<MultiContentCss
        transitionTo={
          (() => {
            const r =Math.random()
if(r<0.25) return "left"
if(r<0.5) return "top"
            if (r < 0.75) return "right"
    return "bottom"
          })()
          }
      >
        {
          <div style={{
            width: "12rem",
            height: "12rem",
          }}>
          {activeNumber}
          </div>
}
      </MultiContentCss>*/}
    </div>
  );
};
