import AccountsFilter from "@/app/components/AccountsPage/AccountFilter";
import CreateAccountButton from "../components/CreateButtons/CreateAccountButton";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";
import MotionDiv from "@/components/animation/MotionDiv";

export default async function AccountsPage() {
  const result = await getGenericListByCurrentUser<SerializedUserAccount>({
    tableName: "userAccount",
  });

  return (
    <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: 200, scale: 1.2 }}
        transition={{ duration: 0.3, type: "just" }}
      >
        <h3 className="text-4xl mb-4 text-primary">Accounts</h3>
      </MotionDiv>
      <div className="flex justify-center items-center flex-col gap-4">
        <div className="w-full">
          <AccountsFilter accounts={result?.data || []} />
        </div>
        <CreateAccountButton className={"self-start"} />
      </div>
    </div>
  );
}
