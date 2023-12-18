"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { getGenericDialogContent } from "@/getGenericModalContent";

const GenericModal = () => {
  const dispatch = useAppDispatch();
  const {
    entityId,
    dialogTitle,
    dialogDescription,
    isGenericModalOpen,
    mode,
    key,
    props,
  } = useAppSelector((state) => state.genericModalReducer);

  if (!key) {
    return null;
  }

  const dialogContentToBeRendered = getGenericDialogContent({
    mode,
    key,
    entityId,
    props,
  });

  return (
    <Dialog
      open={isGenericModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dispatch(closeGenericModal());
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            <p>{dialogDescription}</p>
          </DialogDescription>
        </DialogHeader>
        {dialogContentToBeRendered}
        <DialogFooter>
          <Button variant="ghost" onClick={() => dispatch(closeGenericModal())}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default GenericModal;
