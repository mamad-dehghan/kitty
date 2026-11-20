import { useRef, useState } from "react";
import { Button, Modal } from "../components";
import { colorOptions, fillOptions } from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

export const ModalDemo = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [boundOpen, setBoundOpen] = useState(false);
  const [boundTrigger, setBoundTrigger] = useState<"profile" | "settings">(
    "profile",
  );

  return (
    <DemoPage
      title="Modal"
      description="View-transition powered dialog composed from Title, HelpText, Body and Actions."
    >
      <DemoSection title="Basic modal">
        <DemoRow>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
        </DemoRow>

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <Modal.Title>Delete message?</Modal.Title>
          <Modal.HelpText>
            This action cannot be undone.
          </Modal.HelpText>
          <Modal.Body>
            <p>The message and its attachments will be removed for everyone.</p>
          </Modal.Body>
          <Modal.Actions>
            <Button
              fill={fillOptions.link}
              colorMode={colorOptions.primary}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              fill={fillOptions.fill}
              colorMode={colorOptions.error}
              onClick={() => setOpen(false)}
            >
              Delete
            </Button>
          </Modal.Actions>
        </Modal>
      </DemoSection>

      <DemoSection
        title="Bound to the trigger button"
        description="Pass the clicked button ref to transitionSourceRef so the modal morphs out of it when opening and back into it when closing."
      >
        <DemoRow>
          <Button
            ref={profileButtonRef}
            onClick={() => {
              setBoundTrigger("profile");
              setBoundOpen(true);
            }}
          >
            Open profile
          </Button>
          <Button
            ref={settingsButtonRef}
            fill={fillOptions.outline}
            onClick={() => {
              setBoundTrigger("settings");
              setBoundOpen(true);
            }}
          >
            Open settings
          </Button>
        </DemoRow>

        <Modal
          isOpen={boundOpen}
          onClose={() => setBoundOpen(false)}
          transitionSourceRef={
            boundTrigger === "profile" ? profileButtonRef : settingsButtonRef
          }
        >
          <Modal.Title>Account settings</Modal.Title>
          <Modal.HelpText>
            Opened from the {boundTrigger === "profile" ? "profile" : "settings"}{" "}
            button.
          </Modal.HelpText>
          <Modal.Body>
            <p>
              The view transition starts on the clicked button and returns to it
              on close.
            </p>
          </Modal.Body>
          <Modal.Actions>
            <Button fill={fillOptions.link} onClick={() => setBoundOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setBoundOpen(false)}>Save</Button>
          </Modal.Actions>
        </Modal>

        <DemoNote>
          transitionSourceRef receives the ref of whichever button opened the
          modal. Swap between the two buttons to see the transition morph from
          each one.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Confirmation flow">
        <DemoRow>
          <Button
            colorMode={colorOptions.warning}
            fill={fillOptions.outline}
            onClick={() => setConfirmOpen(true)}
          >
            Leave without saving
          </Button>
        </DemoRow>

        <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <Modal.Title>Unsaved changes</Modal.Title>
          <Modal.Body>
            <p>Do you want to discard the draft?</p>
          </Modal.Body>
          <Modal.Actions>
            <Button
              fill={fillOptions.link}
              onClick={() => setConfirmOpen(false)}
            >
              Keep editing
            </Button>
            <Button
              colorMode={colorOptions.error}
              onClick={() => setConfirmOpen(false)}
            >
              Discard
            </Button>
          </Modal.Actions>
        </Modal>

        <DemoNote>
          Modals block lower layers and close on Escape or a backdrop click.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};
