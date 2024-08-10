import QueryStringComboBox from "@/components/query-string-combobox";
import RouteFiltersPopover from "@/components/route-filters-popover";
import RouteSearchInput from "@/components/route-search-input";
import {
  type AccountSelectModel,
  accounts as accountsTable,
} from "@/lib/database/schema";
import { useTranslations } from "next-intl";
import { BsSortDown, BsSortUp } from "react-icons/bs";

type AccountsPageFiltersProps = {
  accounts: AccountSelectModel[];
};

const AccountsPageFilters = ({ accounts }: AccountsPageFiltersProps) => {
  const t = useTranslations("Accounts");
  const accountCategoryT = useTranslations("Enums.AccountCategory");

  const selectDataset = accountsTable.category.enumValues.map((category) => ({
    label: accountCategoryT(category),
    value: category,
  }));

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <RouteSearchInput placeholder={t("routeSearchInputPlaceholder")} />
        <QueryStringComboBox
          dataset={selectDataset}
          queryStringKey="category"
          selectLabel={t("queryStringComboBoxSelectLabel")}
        />
      </div>
      {accounts.length > 1 && (
        <RouteFiltersPopover
          options={[
            {
              label: t("RouteFiltersPopover.sortByBalanceAsc"),
              icon: <BsSortUp />,
              data: {
                sortBy: "balance",
                sortDirection: "asc",
              },
            },
            {
              label: t("RouteFiltersPopover.sortByBalanceDesc"),
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
