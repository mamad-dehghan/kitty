import { useState } from "react";
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
