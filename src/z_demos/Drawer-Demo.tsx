import { useState } from "react";
import { Link } from "wouter";
import { Badge, Button, Drawer } from "../components";
import { Tooltip } from "../components/tooltip/Tooltip";
import { fillOptions } from "../providers/theme/types";

export const DrawerDemoPage = () => {
  const [openD, setOpenD] = useState(false);
  return (
    <>
      <Link to="/demo/menu">To</Link>
      <div style={{ margin: "8rem" }}>
        <Tooltip title="drawer">
          <Button
            fill={fillOptions.tonal}
            onClick={() => {
              setOpenD(true);
            }}
          >
            Second
          </Button>
        </Tooltip>
      </div>
      <Drawer
        direction="bottom"
        onClose={() => {
          setOpenD(false);
        }}
        isOpen={openD}
      >
        <div className="inside">
          <Badge value={12}>
            <Button>you are amazing!!</Button>
          </Badge>
          <br />
          <Button>you are amazing!!</Button>
          <br />
          <Button>you are amazing!!</Button>
          <br />
          <Button>you are amazing!!</Button>
          <br />
        </div>
      </Drawer>
    </>
  );
};
