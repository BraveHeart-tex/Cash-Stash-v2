import GoalsNotFound from "@/components/goals-not-found";
import CreateGoalButton from "@/components/CreateButtons/CreateGoalButton";
import GoalCard from "@/components/GoalCard";
import { getPaginatedGoalsAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";

const GoalsPage = async ({
  searchParams,
}: {
  searchParams: { page: string; query: string };
}) => {
  const pageNumber = parseInt(searchParams.page) || 1;
  const query = searchParams.query || "";

  const result = await getPaginatedGoalsAction({ pageNumber, query });

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl lg:mb-4 text-primary">Goals</h2>
          <CreateGoalButton className="mt-0" />
        </div>
        <div className="flex justify-center lg:items-center flex-col gap-2">
          {result.goals.length > 0 ? (
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {result.goals.map((goal) => (
                  <GoalCard goal={goal} key={goal.id} />
                ))}
              </div>
            </div>
          ) : (
            <GoalsNotFound pageHasParams />
          )}
        </div>
      </div>
      <RoutePaginationControls {...result} />
    </main>
  );
};

export default GoalsPage;
