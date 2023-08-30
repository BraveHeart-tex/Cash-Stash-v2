"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchCurrentUserAccounts,
  setIsDeleteAccountModalOpen,
} from "@/app/redux/features/userAccountSlice";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { deleteAccountByIdAction } from "@/actions";

const DeleteUserAccountModal = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const { isDeleteAccountModalOpen, selectedUserAccountId } = useAppSelector(
    (state) => state.userAccountReducer
  );
  const { toast } = useToast();

  const onSubmit = async (id: number) => {
    startTransition(async () => {
      const result = await deleteAccountByIdAction(id);

      if (result.error) {
        console.log(result.error);
        toast({
          title: "An error occurred.",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        });
      } else {
        dispatch(fetchCurrentUserAccounts());
        toast({
          title: "Account deleted.",
          description: "The account has been deleted.",
          variant: "default",
          duration: 5000,
        });
        dispatch(setIsDeleteAccountModalOpen(false));
      }
    });
  };

  return (
    <Dialog
      open={isDeleteAccountModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dispatch(setIsDeleteAccountModalOpen(false));
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            <p>Are you sure you want to delete this account?</p>
            <p className="mt-2 font-semibold underline">
              Please note that this action cannot be undone.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            disabled={isPending}
            variant="destructive"
            type="submit"
            onClick={() => onSubmit(selectedUserAccountId as number)}
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            onClick={() => dispatch(setIsDeleteAccountModalOpen(false))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserAccountModal;
