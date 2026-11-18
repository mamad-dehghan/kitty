import { Splitter } from "../components/Splitter/Splitter";

const panels = [
  {
    Element: <div style={{ backgroundColor: "blue" }}></div>,
    hideable: true,
    minSize: "120px",
  },
  {
    Element: <div style={{ backgroundColor: "lime" }}></div>,
    hideable: false,
    minSize: "120px",
  },
  {
    Element: <div style={{ backgroundColor: "yellowgreen" }}></div>,
    hideable: false,
    minSize: "120px",
  },
] as const;

export const SplitterDemo = () => {
  return (
    <div
      style={{
        // display: "flex",
        width: "100%",
        height: "100%",
        paddingTop: "12rem",
      }}
    >
      <Splitter
        panels={[
          {
            Element: <div style={{ backgroundColor: "yellowgreen" }}></div>,
            hideable: false,
            minSize: "120px",
          },
          {
            Element: <Splitter panels={panels} layout="vertical" />,
            hideable: false,
            minSize: "140px",
          },
        ]}
        layout="horizontal"
      />
    </div>
  );
};
