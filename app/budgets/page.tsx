import BudgetList from "@/components/BudgetsPage/BudgetsList";
import { getPaginatedBudgetsAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";

const BudgetsPage = async ({
  searchParams,
}: {
  searchParams: { page: number; query: string };
}) => {
  const pageNumber = searchParams.page || 1;
  const query = searchParams.query || "";
  const result = await getPaginatedBudgetsAction({ pageNumber, query });

  return (
    <main>
      <BudgetList budgets={result.budgets} pageHasParams={!!query} />
      <RoutePaginationControls {...result} />
    </main>
  );
};

export default BudgetsPage;
