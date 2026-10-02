import { useState } from "react";
import { BottomSheet } from "../components/appBar/BottomSheet";
import { Button } from "../components";

export const BottomSheetDemoPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </Button>
      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <p>This is main content of bottom sheet1</p>
        <hr />
        <p>This is main content of bottom sheet2</p>
        <hr />
        <p>This is main content of bottom sheet3</p>
        <hr />
        <p>This is main content of bottom sheet3</p>
        <hr />
        <p>This is main content of bottom sheet3</p>
        <hr />
        <p>This is main content of bottom sheet3</p>
        <hr />
        <p>This is main content of bottom sheet3</p>
        <hr />
        <p>This is main content of bottom sheet3</p>
        <hr />
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
        <p>This is main content of bottom sheet3</p>
      </BottomSheet>
    </>
  );
};
