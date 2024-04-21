import { FaCalendar, FaMoneyBill } from "react-icons/fa";
import QueryStringComboBox from "@/components/query-string-combobox";
import RouteFiltersPopover from "@/components/route-filters-popover";
import RouteSearchInput from "@/components/route-search-input";
import { QueryStringComboboxItem } from "@/server/types";

type TransactionsPageFiltersProps = {
  shouldRenderPopover: boolean;
  accountsFilterDataset: QueryStringComboboxItem[];
  categoryFilterDataset: QueryStringComboboxItem[];
};

const transactionsFilterOptions = [
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
];

const TransactionsPageFilters = ({
  shouldRenderPopover,
  accountsFilterDataset,
  categoryFilterDataset,
}: TransactionsPageFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <RouteSearchInput label="Search" placeholder="Search by description" />
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
      {shouldRenderPopover && (
        <div className="ml-auto self-end">
          <RouteFiltersPopover
            triggerLabel="Sort By"
            options={transactionsFilterOptions}
            queryKeys={["sortBy", "sortDirection"]}
          />
        </div>
      )}
    </div>
  );
};
export default TransactionsPageFilters;
