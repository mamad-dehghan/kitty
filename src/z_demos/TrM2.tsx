import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AppLayer } from "../providers/appLayer/appLayer";
import { useSearchParams } from "wouter";

export const TrModal2 = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button ref={ref}>open</button>
      <Modal2
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <p>body</p>
      </Modal2>
    </>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal2 = ({ isOpen, onClose, children }: ModalProps) => {
  const id = useId();
  const [u] = useSearchParams();

  useEffect(() => {
    if (isOpen) u.set(`modal:${id}`, "true");
    else u.delete(`modal:${id}`);
  }, [id, isOpen]);

  // useEffect(() => {
  //   // Handle escape key
  //   const handleEscape = (event: KeyboardEvent) => {
  //     console.log("in modal");
  //     if (event.key === "Escape") {
  //       // event.stopPropagation();
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener("keydown", handleEscape);
  //     document.getElementById("theme-provider")!.style.overflow = "hidden"; // Prevent background scrolling
  //     blurBottomLayers();
  //   }

  //   return () => {
  //     document.removeEventListener("keydown", handleEscape);
  //     document.getElementById("theme-provider")!.style.overflow = "unset";
  //     blurBottomLayers();
  //   };
  // }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AppLayer
      onClose={onClose}
      closeOnEscape
      blockBottomLayers
      onClick={onClose}
      className="modal-layer"
    >
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </AppLayer>,
    document.getElementById("theme-provider")!,
    id,
  );
};
