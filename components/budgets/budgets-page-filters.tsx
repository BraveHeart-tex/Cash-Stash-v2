import RouteFiltersPopover from "@/components/route-filters-popover";
import RouteSearchInput from "@/components/route-search-input";
import BudgetQueryStringCombobox from "@/components/budgets/budget-query-string-combobox";
import { GiPayMoney } from "react-icons/gi";
import { FaPiggyBank } from "react-icons/fa";
import { BudgetSelectModel, CategorySelectModel } from "@/lib/database/schema";
import { useTranslations } from "next-intl";

type BudgetsPageFiltersProps = {
  budgets: BudgetSelectModel[];
  initialBudgetCategories: CategorySelectModel[];
};

const BudgetsPageFilters = ({
  budgets,
  initialBudgetCategories,
}: BudgetsPageFiltersProps) => {
  const t = useTranslations("Budgets.BudgetsPageFilters");

  const routeFilterOptions = [
    {
      label: t("sortByProgressDesc"),
      icon: <FaPiggyBank className="mr-2" />,
      data: {
        sortBy: "progress",
        sortDirection: "desc",
      },
    },
    {
      label: t("sortByProgressAsc"),
      icon: <FaPiggyBank className="mr-2" />,
      data: {
        sortBy: "progress",
        sortDirection: "asc",
      },
    },
    {
      label: t("sortBySpentAmountDesc"),
      icon: <GiPayMoney className="mr-auto" />,
      data: {
        sortBy: "spentAmount",
        sortDirection: "desc",
      },
    },
    {
      label: t("sortBySpentAmountAsc"),
      icon: <GiPayMoney className="mr-auto" />,
      data: {
        sortBy: "spentAmount",
        sortDirection: "asc",
      },
    },
    {
      label: t("sortByBudgetAmountDesc"),
      icon: <FaPiggyBank className="mr-2" />,
      data: {
        sortBy: "budgetAmount",
        sortDirection: "desc",
      },
    },
    {
      label: t("sortByBudgetAmountAsc"),
      icon: <FaPiggyBank className="mr-2" />,
      data: {
        sortBy: "budgetAmount",
        sortDirection: "asc",
      },
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <RouteSearchInput placeholder={t("routeSearchInputPlaceholder")} />
        <BudgetQueryStringCombobox
          initialBudgetCategories={initialBudgetCategories}
        />
      </div>
      {budgets.length > 1 && (
        <RouteFiltersPopover
          options={routeFilterOptions}
          queryKeys={["sortBy", "sortDirection"]}
        />
      )}
    </div>
  );
};
export default BudgetsPageFilters;
