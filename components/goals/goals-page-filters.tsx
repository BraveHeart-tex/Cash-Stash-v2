import { GiPayMoney } from "react-icons/gi";
import RouteFiltersPopover, {
  GenericFilterOption,
} from "@/components/route-filters-popover";
import RouteSearchInput from "@/components/route-search-input";
import { FaPiggyBank } from "react-icons/fa";
import { useTranslations } from "next-intl";

const goalFilters = [
  {
    label: "Sort by Current (High to Low)",
    icon: <GiPayMoney className="mr-auto" />,
    data: {
      sortBy: "currentAmount",
      sortDirection: "desc",
    },
  },
  {
    label: "Sort by Current (Low to High)",
    icon: <GiPayMoney className="mr-auto" />,
    data: {
      sortBy: "currentAmount",
      sortDirection: "asc",
    },
  },
  {
    label: "Sort by Target (High to Low)",
    icon: <FaPiggyBank className="mr-2" />,
    data: {
      sortBy: "goalAmount",
      sortDirection: "desc",
    },
  },
  {
    label: "Sort by Target (Low to High)",
    icon: <FaPiggyBank className="mr-2" />,
    data: {
      sortBy: "goalAmount",
      sortDirection: "asc",
    },
  },
] as const;

type GoalsPageFiltersProps = {
  shouldRenderPopover: boolean;
};

type GoalFilterData = {
  sortBy: string;
  sortDirection: string;
};

const GoalsPageFilters = ({ shouldRenderPopover }: GoalsPageFiltersProps) => {
  const t = useTranslations("Goals");

  const mappedGoals = goalFilters.map((filter) => ({
    ...filter,
    label: t(
      `RouteFiltersPopover.${filter.data.sortBy}.${filter.data.sortDirection}`
    ),
  })) as GenericFilterOption<GoalFilterData>[];

  return (
    <div className="flex items-center justify-between gap-2">
      <RouteSearchInput placeholder={t("routeSearchInputPlaceholder")} />
      {shouldRenderPopover && (
        <RouteFiltersPopover
          options={mappedGoals}
          queryKeys={["sortBy", "sortDirection"]}
        />
      )}
    </div>
  );
};
export default GoalsPageFilters;
