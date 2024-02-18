import CreateAccountButton from "@/components/CreateButtons/create-account-button";
import { getPaginatedAccounts } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";
import RouteSearchInput from "@/components/route-search-input";
import AccountCard from "@/components/account-card";
import RouteSelectFilter from "@/components/route-select-filter";
import ACCOUNT_OPTIONS from "@/lib/CreateUserAccountOptions";
import { AccountCategory } from "@prisma/client";
import MotionDiv from "@/components/animations/motion-div";
import AccountsNotFound from "@/components/accounts-not-found";
import RouteFiltersPopover from "@/components/route-filters-popover";
import { BsSortDown, BsSortUp } from "react-icons/bs";

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
  const category = (searchParams.category || "") as AccountCategory;
  const sortBy = searchParams.sortBy || "";
  const sortDirection = searchParams.sortDirection || "";

  const result = await getPaginatedAccounts({
    pageNumber,
    query,
    category,
    sortBy,
    sortDirection,
  });

  const selectDataset = Object.entries(ACCOUNT_OPTIONS).map(([key, value]) => ({
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
        {result.accounts.length > 1 && (
          <div className="flex items-center justify-between gap-2">
            <RouteSearchInput placeholder="Search accounts by name" />
            <RouteFiltersPopover
              options={[
                {
                  label: "Sort by balance (Low to High)",
                  icon: <BsSortUp />,
                  data: {
                    sortBy: "balance",
                    sortDirection: "asc",
                  },
                },
                {
                  label: "Sort by balance (High to Low)",
                  icon: <BsSortDown />,
                  data: {
                    sortBy: "balance",
                    sortDirection: "desc",
                  },
                },
              ]}
              queryKeys={["sortBy", "sortDirection"]}
            />
          </div>
        )}
        <div className={"grid lg:grid-cols-6"}>
          <RouteSelectFilter
            dataset={selectDataset}
            queryStringKey="category"
            selectLabel="Account Category"
          />
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
