import AccountsFilter from "@/components/AccountsPage/AccountFilter";
import CreateAccountButton from "@/components/CreateButtons/CreateAccountButton";
import { getPaginatedAccountAction } from "@/actions";
import SearchAccountInput from "@/components/AccountsPage/SearchAccountInput";
import AccountsPaginationControls from "@/components/AccountsPage/AccountsPaginationControls";

const AccountPage = async ({
  searchParams,
}: {
  searchParams: { page: number; query: string };
}) => {
  const pageNumber = searchParams.page || 1;
  const query = searchParams.query || "";

  const result = await getPaginatedAccountAction({ pageNumber, query });

  return (
    <main>
      <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-4xl text-primary">Accounts</h3>
          <CreateAccountButton className="self-start mt-0" />
        </div>
        <SearchAccountInput />
        <div className="flex justify-center items-center flex-col gap-4">
          <div className="w-full">
            <AccountsFilter
              pageHasParams={!!query}
              accounts={result.accounts}
            />
          </div>
        </div>
      </div>
      <AccountsPaginationControls {...result} />
    </main>
  );
};

export default AccountPage;
