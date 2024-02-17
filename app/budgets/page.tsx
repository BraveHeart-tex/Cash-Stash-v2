import BudgetList from "@/components/BudgetsPage/BudgetsList";
import { getPaginatedBudgetsAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { NotificationCategory } from "@prisma/client";

const BudgetsPage = async ({
  searchParams,
}: {
  searchParams: {
    page: string;
    query: string;
    category: string;
    sortBy: string;
    sortDirection: string;
  };
}) => {
  const actionParams = {
    pageNumber: parseInt(searchParams.page) || 1,
    query: searchParams.query || "",
    category: searchParams.category as NotificationCategory,
    sortBy: searchParams.sortBy || "",
    sortDirection: searchParams.sortDirection || "",
  };

  const pageHasParams = !!Object.values(searchParams).filter(
    (param) => param !== searchParams.page
  ).length;

  const result = await getPaginatedBudgetsAction(actionParams);

  return (
    <main>
      <BudgetList budgets={result.budgets} pageHasParams={pageHasParams} />
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default BudgetsPage;
