import { MusicNotesMinusIcon } from "@phosphor-icons/react";
import { AppBar } from "../components/appBar/AppBar";
import { fillOptions, sizeOptions } from "../providers";
import { IconButton } from "../components";
import { ArrowArcLeftIcon } from "@phosphor-icons/react";

export const AppbarDemoPage = () => {
  return (<div style={{ height: "100%", overflow: "scroll" }}>
    <AppBar
      left={[
        <>
          <IconButton size={sizeOptions.small} fill={fillOptions.fill} Icon={ArrowArcLeftIcon} />
          <MusicNotesMinusIcon />
        </>
      ]}
      center={{
        align: "center",
        type: sizeOptions.large,
        heading: "Heading",
        subtitle: "Lorem ipsun."
      }}
      right={[]}
    />
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??s
    <br />??s
    <br />??s
    <br />??s
    <br />??sc
    <br />??sct
    <br />??scty
    <br />??sctyu
    <br />??sctyu
    <br />??ctyui
    <br />??ctyuil
    <br />??
    <br />??
    <br />??
    <br />??
    <br />??s
    <br />??s
    <br />??s
    <br />??s
    <br />??sc
    <br />??sct
    <br />??scty
    <br />??sctyu
    <br />??sctyu
    <br />??ctyui
    <br />??ctyuil
    <br />??ctyuil
    <br />??ctyuil
    <br />??tyuil
    <br />??yuil
    <br />??uil
    <br />??il
    <br />??il
    <br />??l
    <br />??
    <div style={{ height: "100vh" }}></div>
    <div style={{ height: "100vh" }}></div>
    <div style={{ height: "100vh" }}></div>
    <div style={{ height: "100vh" }}></div>
    <div style={{ height: "100vh" }}></div>
    <div style={{ height: "100vh" }}></div>
    <div style={{ height: "100vh" }}></div>
    <div style={{ height: "100vh" }}></div>
  </div>)
}
