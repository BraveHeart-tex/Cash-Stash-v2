import CreateAccountButton from "@/components/create-buttons/create-account-button";
import { getPaginatedAccounts } from "@/actions/account";
import RoutePaginationControls from "@/components/route-pagination-controls";
import RouteSearchInput from "@/components/route-search-input";
import AccountCard from "@/components/account-card";
import RouteSelectFilter from "@/components/route-select-filter";
import MotionDiv from "@/components/animations/motion-div";
import AccountsNotFound from "@/components/accounts-not-found";
import RouteFiltersPopover from "@/components/route-filters-popover";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { AccountCategory } from "@/entities/account";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";
import { accounts } from "@/lib/database/schema";

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

  const selectDataset = generateOptionsFromEnums(accounts.category.enumValues);

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px] mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-4xl text-primary">Accounts</h3>
          <CreateAccountButton className="self-start mt-0" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <RouteSearchInput placeholder="Search accounts by name" />
          {result.accounts.length > 1 && (
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
          )}
        </div>
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
              {result.accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
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
