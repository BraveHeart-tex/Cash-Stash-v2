"use client";
import CreateUserAccountForm from "../forms/CreateUserAccountForm";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setIsCreateAccountModalOpen } from "@/app/redux/features/userAccountSlice";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
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
