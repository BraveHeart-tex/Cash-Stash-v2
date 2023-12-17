import AccountsFilter from "@/app/components/AccountsPage/AccountFilter";
import CreateAccountButton from "../components/CreateButtons/CreateAccountButton";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";

export default async function AccountsPage() {
  const result = await getGenericListByCurrentUser<SerializedUserAccount>({
    tableName: "userAccount",
  });

  return (
    <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h3 className="text-4xl mb-4 text-primary">Accounts</h3>
      <div className="flex justify-center items-center flex-col gap-4">
        <div className="w-full">
          <AccountsFilter accounts={result?.data || []} />
        </div>
        <CreateAccountButton className={"self-start"} />
      </div>
    </div>
  );
}
