import GoalsNotFound from "@/components/goals-not-found";
import CreateGoalButton from "@/components/CreateButtons/CreateGoalButton";
import GoalCard from "@/components/GoalCard";
import { getPaginatedGoalsAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";
import RouteSearchInput from "@/components/route-search-input";

const GoalsPage = async ({ searchParams }: { searchParams: { page: string; query: string } }) => {
  const pageNumber = parseInt(searchParams.page) || 1;
  const query = searchParams.query || "";

  const result = await getPaginatedGoalsAction({ pageNumber, query });

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl text-primary">Goals</h2>
          <CreateGoalButton className="mt-0" />
        </div>
        <RouteSearchInput placeholder="Search goals by name" />
        <div className="h-[500px] lg:pr-4 mt-2 lg:mt-0 overflow-auto w-full">
          {result.goals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 pr-2">
              {result.goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <GoalsNotFound pageHasParams={!!query} />
          )}
        </div>
      </div>
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default GoalsPage;
