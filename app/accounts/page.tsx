import CreateAccountButton from "@/components/CreateButtons/CreateAccountButton";
import { getPaginatedAccountAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";
import RouteSearchInput from "@/components/route-search-input";
import AccountCard from "@/components/AccountCard";
import RouteSelectFilter from "@/components/route-select-filter";
import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import { UserAccountCategory } from "@prisma/client";

const AccountPage = async ({
  searchParams,
}: {
  searchParams: { page: string; query: string; category: string };
}) => {
  const pageNumber = parseInt(searchParams.page) || 1;
  const query = searchParams.query || "";
  const category = (searchParams.category || "") as UserAccountCategory;

  const result = await getPaginatedAccountAction({
    pageNumber,
    query,
    category,
  });

  const selectDataset = Object.entries(CreateUserAccountOptions).map(
    ([key, value]) => ({
      label: value,
      value: key,
    })
  );

  return (
    <main>
      <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-4xl text-primary">Accounts</h3>
          <CreateAccountButton className="self-start mt-0" />
        </div>
        <RouteSearchInput placeholder="Search accounts by name" />
        <div className={"grid lg:grid-cols-6"}>
          <RouteSelectFilter
            dataset={selectDataset}
            queryStringKey="category"
            selectLabel="Account Category"
          />

          <div className="h-[500px] lg:pr-4 col-span-5 mt-2 lg:mt-0 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
              {result.accounts.map((budget) => (
                <AccountCard key={budget.id} account={budget} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <RoutePaginationControls {...result} />
    </main>
  );
};

export default AccountPage;
