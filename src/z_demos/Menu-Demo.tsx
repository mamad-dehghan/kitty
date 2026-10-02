import { useState } from "react";
import { Link } from "wouter";
import { Button, Menu, Modal } from "../components";
import { Tooltip } from "../components/tooltip/Tooltip";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/theme/types";

export const MenuDemoPage = () => {
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
  const [openM, setOpenM] = useState(false);

  const menuSections = [
    {
      label: "first",
      onClick: () => {
        console.log("clicked-1!");
      },
    },
    {
      label: "not first",
      onClick: () => {
        console.log("clicked-2!");
      },
    },
    {
      label: "second",
      items: [
        {
          label: "third",
          onClick: () => {
            console.log("clicked-3!");
          },
        },
        {
          label: "fourth",
          onClick: (event: any) => {
            event.stopPropagation();
            setOpenM(true);
          },
        },
      ],
    },
  ];

  return (
    <>
      <Link to="/demo/drawer">To</Link>
      <Tooltip title="start">
        <Button
          fill={fillOptions.outline}
          mode={colorOptions.error}
          onClick={(event) => {
            setTargetEl(event.currentTarget);
          }}
        >
          Open
        </Button>
      </Tooltip>
      <Menu
        isOpen={Boolean(targetEl)}
        onClose={() => {
          setTargetEl(null);
        }}
        fitContent
        // compact
        hideLeadingIcon
        position={[{ horizontal: "left", vertical: "bottom" }]}
        margins={{
          container: { X: 4, Y: 4 },
          targetEl: { X: 4, Y: 4 },
        }}
        targetEl={targetEl?.getBoundingClientRect()}
        items={menuSections}
      />
      <Modal isOpen={openM} onClose={() => setOpenM(false)}>
        <Modal.Title>It's a modal</Modal.Title>
        <Modal.Actions>
          <Button
            size={sizeOptions.small}
            fill={fillOptions.outline}
            mode={colorOptions.warning}
            onClick={() => {
              setOpenM(false);
            }}
          >
            close
          </Button>
          <Link to="/demo/drawer">To</Link>
        </Modal.Actions>
      </Modal>
    </>
  );
};
