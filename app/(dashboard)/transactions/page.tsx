import { getPaginatedTransactions } from "@/server/transaction";
import TransactionList from "@/components/transactions/transaction-list";
import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";
import TransactionsNotFound from "@/components/transactions-not-found";
import RouteSearchInput from "@/components/route-search-input";
import { FaCalendar, FaMoneyBill } from "react-icons/fa";
import QueryStringComboBox from "@/components/query-string-combobox";
import { getCurrentUserAccountsThatHaveTransactions } from "@/server/account";
import RouteFiltersPopover from "@/components/route-filters-popover";
import { createGetPaginatedTransactionsParams } from "@/lib/utils/misc";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";
import { transactions } from "@/lib/database/schema";
import RoutePaginationControls from "@/components/route-pagination-controls";

export type TransactionPageSearchParams = {
  transactionType?: string;
  accountId?: string;
  sortBy?: string;
  sortDirection?: string;
  category?: string;
  page?: string;
  query?: string;
};

type TransactionsPageProps = {
  searchParams: TransactionPageSearchParams;
};

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const actionParams = createGetPaginatedTransactionsParams(searchParams);

  const [transactionsResponse, usersAccounts] = await Promise.all([
    getPaginatedTransactions(actionParams),
    getCurrentUserAccountsThatHaveTransactions(),
  ]);

  const accountsFilterDataset = usersAccounts.map((account) => ({
    label: account.name,
    value: account.id.toString(),
  }));

  const categoryFilterDataset = generateOptionsFromEnums(
    transactions.category.enumValues
  );

  const pageHasParams = Object.keys(actionParams)
    .filter((key) => key !== "page")
    .some((key: string) => actionParams[key as keyof typeof actionParams]);

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center gap-2 justify-between mb-4 flex-wrap">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-primary">
            Transactions
          </h1>
          <CreateTransactionButton className="mt-0" />
        </div>
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <RouteSearchInput
              label="Search"
              placeholder="Search by description"
            />
            <QueryStringComboBox
              dataset={accountsFilterDataset}
              queryStringKey="accountId"
              selectLabel="Account"
            />
            <QueryStringComboBox
              dataset={categoryFilterDataset}
              queryStringKey="category"
              selectLabel="Category"
            />
          </div>
          {usersAccounts.length > 1 && (
            <RouteFiltersPopover
              triggerLabel="Sort By"
              options={[
                {
                  label: "Sort by Amount (Low to High)",
                  icon: <FaMoneyBill className="mr-2" />,
                  data: {
                    sortBy: "amount",
                    sortDirection: "asc",
                  },
                },
                {
                  label: "Sort by Amount (High to Low)",
                  icon: <FaMoneyBill className="mr-2" />,
                  data: {
                    sortBy: "amount",
                    sortDirection: "desc",
                  },
                },
                {
                  label: "Sort by Newest to Oldest",
                  icon: <FaCalendar className="mr-2" />,
                  data: {
                    sortBy: "createdAt",
                    sortDirection: "desc",
                  },
                },
                {
                  label: "Sort by Oldest to Newest",
                  icon: <FaCalendar className="mr-2" />,
                  data: {
                    sortBy: "createdAt",
                    sortDirection: "asc",
                  },
                },
              ]}
              queryKeys={["sortBy", "sortDirection"]}
            />
          )}
        </div>

        <div className="h-[500px] lg:pr-4 mt-2 lg:mt-0 overflow-auto w-full">
          {transactionsResponse.transactions.length > 0 ? (
            <TransactionList transactions={transactionsResponse.transactions} />
          ) : (
            <TransactionsNotFound pageHasParams={pageHasParams} />
          )}
        </div>
      </div>
      {transactionsResponse.totalPages > 1 && (
        <RoutePaginationControls {...transactionsResponse} />
      )}
    </main>
  );
};

export default TransactionsPage;
