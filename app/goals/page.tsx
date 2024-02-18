import GoalsNotFound from "@/components/goals-not-found";
import CreateGoalButton from "@/components/create-buttons/create-goal-button";
import GoalCard from "@/components/goal-card";
import RoutePaginationControls from "@/components/route-pagination-controls";
import RouteSearchInput from "@/components/route-search-input";
import RouteFiltersPopover from "@/components/route-filters-popover";
import { GiPayMoney } from "react-icons/gi";
import { FaPiggyBank } from "react-icons/fa";
import { getPaginatedGoals } from "@/actions";

const GoalsPage = async ({
  searchParams,
}: {
  searchParams: {
    page: string;
    query: string;
    sortBy: string;
    sortDirection: string;
  };
}) => {
  const actionParams = {
    pageNumber: parseInt(searchParams.page) || 1,
    query: searchParams.query || "",
    sortBy: searchParams.sortBy || "",
    sortDirection: searchParams.sortDirection || "",
  };

  const result = await getPaginatedGoals(actionParams);

  const pageHasParams = !!Object.values(searchParams)
    .filter((param) => param !== searchParams.page)
    .some((param) => param);

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl text-primary">Goals</h2>
          <CreateGoalButton className="mt-0" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <RouteSearchInput placeholder="Search goals by name" />
          {result.goals.length > 1 && (
            <RouteFiltersPopover
              options={[
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
              ]}
              queryKeys={["sortBy", "sortDirection"]}
            />
          )}
        </div>
        <div className="h-[500px] lg:pr-4 mt-2 lg:mt-0 overflow-auto w-full">
          {result.goals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 pr-2">
              {result.goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <GoalsNotFound pageHasParams={pageHasParams} />
          )}
        </div>
      </div>
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default GoalsPage;
