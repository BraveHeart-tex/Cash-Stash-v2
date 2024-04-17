import RoutePaginationControls from "@/components/route-pagination-controls";
import { getPaginatedGoals } from "@/server/goal";
import GoalsPageHeader from "@/components/goals/goals-page-header";
import GoalsPageFilters from "@/components/goals/goals-page-filters";
import GoalsNotFoundMessage from "@/components/goals/goals-not-found-message";
import GoalCardsList from "@/components/goals/goal-cards-list";

type GoalsPageSearchParamsType = {
  page: string;
  query: string;
  sortBy: string;
  sortDirection: string;
};

type GoalsPageProps = {
  searchParams: GoalsPageSearchParamsType;
};

const GoalsPage = async ({ searchParams }: GoalsPageProps) => {
  const actionParams = {
    pageNumber: parseInt(searchParams.page) || 1,
    query: searchParams.query || "",
    sortBy: searchParams.sortBy || "",
    sortDirection: searchParams.sortDirection || "",
  };

  const goalsResponse = await getPaginatedGoals(actionParams);

  const pageHasParams = Object.values(searchParams).some((param) => param);

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <GoalsPageHeader />
        <GoalsPageFilters
          shouldRenderPopover={goalsResponse.goals.length > 1}
        />
        {goalsResponse.goals.length > 0 ? (
          <GoalCardsList goals={goalsResponse.goals} />
        ) : (
          <GoalsNotFoundMessage pageHasParams={pageHasParams} />
        )}
      </div>
      {goalsResponse.totalPages > 1 && (
        <RoutePaginationControls {...goalsResponse} />
      )}
    </main>
  );
};

export default GoalsPage;
