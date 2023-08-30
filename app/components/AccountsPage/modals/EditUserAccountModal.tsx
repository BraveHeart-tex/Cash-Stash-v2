"use client";
import EditUserAccountForm from "../forms/EditUserAccountForm";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setIsEditAccountModalOpen } from "@/app/redux/features/userAccountSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditUserAccountModal = () => {
  const { isEditAccountModalOpen, selectedUserAccountId } = useAppSelector(
    (state) => state.userAccountReducer
  );
  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={isEditAccountModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dispatch(setIsEditAccountModalOpen(!isEditAccountModalOpen));
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Edit your existing acconut by using the form below.
          </DialogDescription>
        </DialogHeader>
        <EditUserAccountForm selectedAccountId={selectedUserAccountId} />
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() =>
              dispatch(setIsEditAccountModalOpen(!isEditAccountModalOpen))
            }
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserAccountModal;
