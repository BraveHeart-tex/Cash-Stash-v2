import QueryStringComboBox, {
  type QueryStringComboboxItem,
} from "@/components/query-string-combobox";
import RouteFiltersPopover, {
  type GenericFilterOption,
} from "@/components/route-filters-popover";
import RouteSearchInput from "@/components/route-search-input";
import TransactionCategoryCombobox from "@/components/transactions/transaction-category-combobox";
import { CATEGORY_TYPES } from "@/lib/constants";
import { getCategoriesByType } from "@/server/category";
import { getTranslations } from "next-intl/server";
import { FaCalendar, FaMoneyBill } from "react-icons/fa";

type TransactionsPageFiltersProps = {
  shouldRenderPopover: boolean;
  accountsFilterDataset: QueryStringComboboxItem[];
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
] as const;

type TransactionFilterData = {
  sortBy: string;
  sortDirection: string;
};

const TransactionsPageFilters = async ({
  shouldRenderPopover,
  accountsFilterDataset,
}: TransactionsPageFiltersProps) => {
  const t = await getTranslations("Transactions");
  const initialTransactionCategories = await getCategoriesByType(
    CATEGORY_TYPES.TRANSACTION,
  );

  const translatedOptions = transactionsFilterOptions.map((option) => ({
    ...option,
    label: t(
      `RouteFiltersPopover.${option.data.sortBy}.${option.data.sortDirection}`,
    ),
  })) as GenericFilterOption<TransactionFilterData>[];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <RouteSearchInput placeholder={t("routeSearchInputPlaceholder")} />
      <QueryStringComboBox
        dataset={accountsFilterDataset}
        queryStringKey="accountId"
        selectLabel={t("queryStringComboBoxSelectLabel")}
      />
      <TransactionCategoryCombobox
        initialTransactionCategories={initialTransactionCategories || []}
      />
      {shouldRenderPopover && (
        <div className="ml-auto self-end">
          <RouteFiltersPopover
            triggerLabel={t("RouteFiltersPopover.label")}
            options={translatedOptions}
            queryKeys={["sortBy", "sortDirection"]}
          />
        </div>
      )}
    </div>
  );
};
export default TransactionsPageFilters;
