import RouteFiltersPopover from "../route-filters-popover";
import RouteSearchInput from "../route-search-input";
import BudgetQueryStringCombobox from "./budget-query-string-combobox";
import { GiPayMoney } from "react-icons/gi";
import { FaPiggyBank } from "react-icons/fa";
import { BudgetSelectModel, CategorySelectModel } from "@/lib/database/schema";

type BudgetsPageFiltersProps = {
  budgets: BudgetSelectModel[];
  initialBudgetCategories: CategorySelectModel[];
};

const routeFilterOptions = [
  {
    label: "Sort by Remaining (Low to High)",
    icon: <FaPiggyBank className="mr-2" />,
    data: {
      sortBy: "progress",
      sortDirection: "desc",
    },
  },
  {
    label: "Sort by Remaining (High to Low)",
    icon: <FaPiggyBank className="mr-2" />,
    data: {
      sortBy: "progress",
      sortDirection: "asc",
    },
  },
  {
    label: "Sort by Spending (High to Low)",
    icon: <GiPayMoney className="mr-auto" />,
    data: {
      sortBy: "spentAmount",
      sortDirection: "desc",
    },
  },
  {
    label: "Sort by Spending (Low to High)",
    icon: <GiPayMoney className="mr-auto" />,
    data: {
      sortBy: "spentAmount",
      sortDirection: "asc",
    },
  },
  {
    label: "Sort by Budget (High to Low)",
    icon: <FaPiggyBank className="mr-2" />,
    data: {
      sortBy: "budgetAmount",
      sortDirection: "desc",
    },
  },
  {
    label: "Sort by Budget (Low to High)",
    icon: <FaPiggyBank className="mr-2" />,
    data: {
      sortBy: "budgetAmount",
      sortDirection: "asc",
    },
  },
];

const BudgetsPageFilters = ({
  budgets,
  initialBudgetCategories,
}: BudgetsPageFiltersProps) => {
  return (
    <div className="flex items-center gap-2 justify-between flex-wrap">
      <div className="flex items-center gap-2">
        <RouteSearchInput label="Search" placeholder="Search budgets by name" />
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
