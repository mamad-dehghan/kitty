import { useRef, useState } from "react";
import { Button, Modal } from "../components";
import { colorOptions, fillOptions } from "../providers/theme/types";
import "./tmodal.scss";

export const ModalDemoPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const rr = useRef<HTMLButtonElement>(null);
  const rr2 = useRef<HTMLButtonElement>(null);

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Wouter Modal Transition Demo</h1>
      <Button mode={colorOptions.warning} fill={fillOptions.outline}>
        open modal
      </Button>
      <Button
        ref={rr}
        mode={colorOptions.error}
        fill={fillOptions.outline}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        open modal
      </Button>
      <Button
        ref={rr2}
        mode={colorOptions.primary}
        fill={fillOptions.fill}
        onClick={() => {
          setIsOpen2(true);
        }}
      >
        open modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        bindButton={rr}
      >
        <p>Hello</p>
      </Modal>

      <Modal
        isOpen={isOpen2}
        onClose={() => {
          setIsOpen2(false);
        }}
        bindButton={rr2}
      >
        <p>Hello</p>
      </Modal>
    </div>
  );
};
