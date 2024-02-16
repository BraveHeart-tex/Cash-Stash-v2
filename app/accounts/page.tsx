import CreateAccountButton from "@/components/CreateButtons/CreateAccountButton";
import { getPaginatedAccountAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";
import RouteSearchInput from "@/components/route-search-input";
import AccountCard from "@/components/AccountCard";
import RouteSelectFilter from "@/components/route-select-filter";
import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import { UserAccountCategory } from "@prisma/client";
import MotionDiv from "@/components/animation/MotionDiv";
import AccountsNotFound from "@/components/accounts-not-found";
import RouteFiltersPopover from "@/components/route-filters-popover";

const AccountPage = async ({
  searchParams,
}: {
  searchParams: {
    page: string;
    query: string;
    category: string;
    sortBy: string;
    sortDirection: string;
  };
}) => {
  const pageNumber = parseInt(searchParams.page) || 1;
  const query = searchParams.query || "";
  const category = (searchParams.category || "") as UserAccountCategory;
  const sortBy = searchParams.sortBy || "";
  const sortDirection = searchParams.sortDirection || "";

  const result = await getPaginatedAccountAction({
    pageNumber,
    query,
    category,
    sortBy,
    sortDirection,
  });

  const selectDataset = Object.entries(CreateUserAccountOptions).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  return (
    <main>
      <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px] mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-4xl text-primary">Accounts</h3>
          <CreateAccountButton className="self-start mt-0" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <RouteSearchInput placeholder="Search accounts by name" />
          <RouteFiltersPopover
            options={[
              {
                id: "1",
                label: "Sort by balance ascending",
                data: {
                  sortBy: "balance",
                  sortDirection: "asc",
                },
              },
              {
                id: "2",
                label: "Sort by balance descending",
                data: {
                  sortBy: "balance",
                  sortDirection: "desc",
                },
              },
            ]}
            queryKeys={["sortBy", "sortDirection"]}
          />
        </div>
        <div className={"grid lg:grid-cols-6"}>
          <RouteSelectFilter dataset={selectDataset} queryStringKey="category" selectLabel="Account Category" />
          {result.accounts.length === 0 && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.5, type: "just" }}
              className="lg:text-center lg:col-span-6 col-span-6 w-full lg:mt-0"
            >
              <AccountsNotFound pageHasParams={!!(query || category)} />
            </MotionDiv>
          )}

          <div className="h-[500px] lg:pr-4 col-span-5 mt-2 lg:mt-0 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
              {result.accounts.map((budget) => (
                <AccountCard key={budget.id} account={budget} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default AccountPage;
