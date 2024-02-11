import AccountsFilter from "@/components/AccountsPage/AccountFilter";
import CreateAccountButton from "@/components/CreateButtons/CreateAccountButton";
import { getPaginatedAccountAction } from "@/actions";
import SearchAccountInput from "@/components/SearchAccountInput";

const AccountPage = async ({
  searchParams,
}: {
  searchParams: { page: number; query: string };
}) => {
  const pageNumber = searchParams.page || 1;
  const query = searchParams.query || "";

  const result = await getPaginatedAccountAction({ pageNumber, query });

  console.log(query);

  return (
    <main>
      <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <h3 className="text-4xl mb-4 text-primary">Accounts</h3>
        <SearchAccountInput />
        <div className="flex justify-center items-center flex-col gap-4">
          <div className="w-full">
            <AccountsFilter accounts={result.accounts} />
          </div>
        </div>
        <CreateAccountButton className="self-start" />
      </div>
    </main>
  );
};

export default AccountPage;
