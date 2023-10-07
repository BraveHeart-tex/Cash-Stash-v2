"use client";
import CreateUserAccountOptions, {
  getOptionLabel,
} from "@/lib/CreateUserAccountOptions";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  SerializedUserAccount,
  fetchCurrentUserAccounts,
} from "@/app/redux/features/userAccountSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { deleteAccountByIdAction } from "@/actions";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import ActionPopover from "@/components/ActionPopover";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";

interface IAccountInformationProps {
  userAccounts: SerializedUserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  const dispatch = useAppDispatch();

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {userAccounts && userAccounts?.length > 0 ? (
          userAccounts
            .sort((a, b) => a.id - b.id)
            .map((userAccount) => (
              <Card key={userAccount.id} className="relative">
                <ActionPopover
                  popoverHeading={"Account Actions"}
                  onEditActionClick={() => {
                    dispatch(
                      openGenericModal({
                        mode: "edit",
                        key: "account",
                        dialogTitle: "Edit an account",
                        dialogDescription:
                          "Fill out the form below to edit an account.",
                        entityId: userAccount.id,
                      })
                    );
                  }}
                  onDeleteActionClick={() =>
                    handleDeleteAccount(userAccount.id)
                  }
                />
                <CardHeader className="text-primary">
                  <h2 className="text-lg font-bold">{userAccount.name}</h2>
                  <CardDescription>
                    <p className="text-lg capitalize">
                      Account type:{" "}
                      {getOptionLabel(
                        CreateUserAccountOptions,
                        userAccount.category
                      )}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-primary">
                  <p className="font-bold">
                    Account Balance: ${userAccount.balance}
                  </p>
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="my-4">
            <h3 className="text-lg text-primary">No accounts found</h3>
            <p>
              You can remove existing filters to see all accounts or create a
              new one with this category.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountInformation;
