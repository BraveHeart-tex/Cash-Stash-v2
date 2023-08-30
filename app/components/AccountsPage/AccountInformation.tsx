"use client";
import CreateUserAccountOptions, {
  getOptionLabel,
} from "@/lib/CreateUserAccountOptions";
import EditUserAccountModal from "./modals/EditUserAccountModal";
import DeleteUserAccountModal from "./modals/DeleteUserAccountModal";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  setIsEditAccountModalOpen,
  setIsDeleteAccountModalOpen,
  SerializedUserAccount,
} from "@/app/redux/features/userAccountSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Cross1Icon,
  DotsHorizontalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

interface IAccountInformationProps {
  userAccounts: SerializedUserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  const dispatch = useAppDispatch();
  const { isEditAccountModalOpen, isDeleteAccountModalOpen } = useAppSelector(
    (state) => state.userAccountReducer
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {userAccounts && userAccounts?.length > 0 ? (
          userAccounts
            .sort((a, b) => a.id - b.id)
            .map((userAccount) => (
              <Card key={userAccount.id} className="relative">
                <Popover>
                  <PopoverTrigger className="absolute top-2 right-2 mb-2">
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      aria-label="Account actions"
                      className="focus:outline-none outline-none"
                    >
                      <DotsHorizontalIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <h3 className="text-center font-bold text-primary">
                      Account Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center">
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          aria-label="Edit user account"
                          onClick={() =>
                            dispatch(
                              setIsEditAccountModalOpen({
                                isEditAccountModalOpen: !isEditAccountModalOpen,
                                selectedUserAccountId: userAccount.id,
                              })
                            )
                          }
                          className="mr-2 flex items-center gap-2 w-full justify-start"
                        >
                          <Pencil1Icon className="h-5 w-5" />
                          <span className="text-[16px]">Edit</span>
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          aria-label="Delete user account"
                          onClick={() =>
                            dispatch(
                              setIsDeleteAccountModalOpen({
                                isDeleteAccountModalOpen:
                                  !isDeleteAccountModalOpen,
                                selectedUserAccountId: userAccount.id,
                              })
                            )
                          }
                          className="mr-2 flex items-center gap-2 w-full justify-start"
                        >
                          <Cross1Icon />
                          <span className="text-[16px]">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
              You can remove the filter to see all accounts or create a new one
              with this category.
            </p>
          </div>
        )}
      </div>
      <EditUserAccountModal />
      <DeleteUserAccountModal />
    </>
  );
};

export default AccountInformation;
