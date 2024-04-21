import { GiPayMoney } from "react-icons/gi";
import RouteFiltersPopover from "@/components/route-filters-popover";
import RouteSearchInput from "@/components/route-search-input";
import { FaPiggyBank } from "react-icons/fa";

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
];

type GoalsPageFiltersProps = {
  shouldRenderPopover: boolean;
};

const GoalsPageFilters = ({ shouldRenderPopover }: GoalsPageFiltersProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <RouteSearchInput label="Search" placeholder="Search goals by name" />
      {shouldRenderPopover && (
        <RouteFiltersPopover
          options={goalFilters}
          queryKeys={["sortBy", "sortDirection"]}
        />
      )}
    </div>
  );
};
export default GoalsPageFilters;
