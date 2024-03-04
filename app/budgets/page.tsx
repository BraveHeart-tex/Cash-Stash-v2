import { getPaginatedBudgets } from "@/actions/budget";
import BudgetList from "@/components/budgets/budget-list";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { BudgetCategory } from "@/entities/budget";

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
    category: searchParams.category as BudgetCategory,
    sortBy: searchParams.sortBy || "",
    sortDirection: searchParams.sortDirection || "",
  };

  const pageHasParams = Object.values(searchParams)
    .filter((param) => param !== searchParams.page)
    .some((param) => param);

  const result = await getPaginatedBudgets(actionParams);

  return (
    <main>
      <BudgetList budgets={result.budgets} pageHasParams={pageHasParams} />
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default BudgetsPage;
