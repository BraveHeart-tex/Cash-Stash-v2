"use client";
import CreateUserAccountForm from "../forms/CreateUserAccountForm";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setIsCreateAccountModalOpen } from "@/app/redux/features/userAccountSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CreateUserAccountModal = () => {
  const dispatch = useAppDispatch();
  const { isCreateAccountModalOpen } = useAppSelector(
    (state) => state.userAccountReducer
  );

  return (
    <Dialog
      open={isCreateAccountModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dispatch(setIsCreateAccountModalOpen(false));
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Create a new account to track your expenses.
          </DialogDescription>
        </DialogHeader>
        <CreateUserAccountForm />
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => dispatch(setIsCreateAccountModalOpen(false))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserAccountModal;
