import BudgetList from "@/components/BudgetsPage/BudgetsList";
import { getPaginatedBudgetsAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { NotificationCategory } from "@prisma/client";

const BudgetsPage = async ({ searchParams }: { searchParams: { page: string; query: string; category: string } }) => {
  const pageNumber = parseInt(searchParams.page) || 1;
  const query = searchParams.query || "";
  const category = (searchParams.category || "") as NotificationCategory;
  const result = await getPaginatedBudgetsAction({
    pageNumber,
    query,
    category,
  });

  return (
    <main>
      <BudgetList budgets={result.budgets} pageHasParams={!!(query || category)} />
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default BudgetsPage;
