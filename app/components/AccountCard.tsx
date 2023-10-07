import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import {
  SerializedUserAccount,
  fetchCurrentUserAccounts,
} from "../redux/features/userAccountSlice";
import ActionPopover from "@/components/ActionPopover";
import { useAppDispatch } from "../redux/hooks";
import { openGenericModal } from "../redux/features/genericModalSlice";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { deleteAccountByIdAction } from "@/actions";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { cn } from "@/lib/utils";

interface IAccountCardProps {
  account: SerializedUserAccount;
  className?: string;
}

const AccountCard = ({ account, className }: IAccountCardProps) => {
  const dispatch = useAppDispatch();

  const accountCategory = CreateUserAccountOptions[account.category];

  const handleActionCallback = (
    result: Awaited<ReturnType<typeof deleteAccountByIdAction>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result?.error) {
      showErrorToast("An error occurred.", result.error);
    } else {
      dispatch(fetchCurrentUserAccounts());
      showSuccessToast(
        "Account deleted.",
        "Selected account has been deleted."
      );
      dispatch(cleanUp());
    }
  };

  const handleDeleteAccount = (id: number) => {
    dispatch(
      showGenericConfirm({
        title: "Delete Account",
        message: "Are you sure you want to delete this account?",
        primaryActionLabel: "Delete",
        primaryAction: async () => deleteAccountByIdAction(id),
        resolveCallback: handleActionCallback,
      })
    );
  };

  return (
    <div
      className={cn(
        "p-4 rounded-md shadow-lg border w-full cursor-pointer hover:shadow-xl transition duration-300 ease-in-out relative",
        className
      )}
      key={account.name}
    >
      <ActionPopover
        popoverHeading={"Account Actions"}
        onEditActionClick={() => {
          dispatch(
            openGenericModal({
              mode: "edit",
              key: "account",
              dialogTitle: "Edit an account",
              dialogDescription: "Fill out the form below to edit an account.",
              entityId: account.id,
            })
          );
        }}
        onDeleteActionClick={() => handleDeleteAccount(account.id)}
      />
      <p className="font-semibold mb-2 text-primary">
        {account.name}{" "}
        <span className="dark:text-white/60 text-foreground">
          ({accountCategory})
        </span>
      </p>
      <p className="text-md">Balance: {account.balance}₺</p>
    </div>
  );
};
export default AccountCard;
