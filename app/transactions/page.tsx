import { getPaginatedTransactions } from "@/actions/transaction";
import TransactionList from "@/components/transactions/transaction-list";
import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";
import TransactionsNotFound from "@/components/transactions-not-found";
import RouteSearchInput from "@/components/route-search-input";
import { FaCalendar, FaMoneyBill } from "react-icons/fa";

import RouteSelectFilter from "@/components/route-select-filter";
import { getCurrentUserAccounts } from "@/actions/account";
import { TransactionCategory } from "@prisma/client";
import { Label } from "@/components/ui/label";
import RouteFiltersPopover from "@/components/route-filters-popover";
import { createGetPaginatedTransactionsParams } from "@/lib/utils/misc";
import { generateReadbleEnumLabels } from "@/lib/utils/stringUtils/generateReadbleEnumLabels";

export interface ITransactionPageSearchParams {
  transactionType?: string;
  accountId?: string;
  sortBy?: string;
  sortDirection?: string;
  category?: string;
  page?: string;
  query?: string;
}

const TransactionsPage = async ({
  searchParams,
}: {
  searchParams: ITransactionPageSearchParams;
}) => {
  const actionParams = createGetPaginatedTransactionsParams(searchParams);

  const transactionsResponse = await getPaginatedTransactions(actionParams);
  const usersAccounts = await getCurrentUserAccounts();

  const accountsFilterDataset = usersAccounts.map((account) => ({
    label: account.name,
    value: account.id.toString(),
  }));

  const categoryFilterDataset = generateReadbleEnumLabels({
    enumObj: TransactionCategory,
  });

  const pageHasParams = Object.keys(actionParams)
    .filter((key) => key !== "page")
    .some((key: string) => actionParams[key as keyof typeof actionParams]);

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center gap-2 justify-between mb-4 flex-wrap">
          <h3 className="text-4xl text-primary">Transactions</h3>
          <CreateTransactionButton className="mt-0" />
        </div>
        <div className="flex items-center justify-between">
          <RouteSearchInput placeholder="Search by description" />
        </div>
        {usersAccounts.length > 0 && (
          <div className="flex lg:flex-row lg:items-center gap-2 flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label>Filter by account</Label>
                <RouteSelectFilter
                  dataset={accountsFilterDataset}
                  queryStringKey="accountId"
                  selectLabel="Filter by account"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Filter by category</Label>
                <RouteSelectFilter
                  dataset={categoryFilterDataset}
                  queryStringKey="category"
                  selectLabel="Filter by category"
                />
              </div>
            </div>
            <div className="lg:pt-[20px] lg:ml-auto">
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
            </div>
          </div>
        )}
        <div>
          {transactionsResponse.transactions.length > 0 ? (
            <TransactionList transactions={transactionsResponse.transactions} />
          ) : (
            <TransactionsNotFound pageHasParams={pageHasParams} />
          )}
        </div>
      </div>
    </main>
  );
};

export default TransactionsPage;
