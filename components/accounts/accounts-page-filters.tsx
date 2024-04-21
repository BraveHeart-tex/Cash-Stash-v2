import QueryStringComboBox from "@/components/query-string-combobox";
import RouteFiltersPopover from "@/components/route-filters-popover";
import RouteSearchInput from "@/components/route-search-input";
import {
  AccountSelectModel,
  accounts as accountsTable,
} from "@/lib/database/schema";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";
import { BsSortDown, BsSortUp } from "react-icons/bs";

type AccountsPageFiltersProps = {
  accounts: AccountSelectModel[];
};

const AccountsPageFilters = ({ accounts }: AccountsPageFiltersProps) => {
  const selectDataset = generateOptionsFromEnums(
    accountsTable.category.enumValues
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <RouteSearchInput
          label="Search"
          placeholder="Search accounts by name"
        />
        <QueryStringComboBox
          dataset={selectDataset}
          queryStringKey="category"
          selectLabel="Account Category"
        />
      </div>
      {accounts.length > 1 && (
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
  );
};
export default AccountsPageFilters;
