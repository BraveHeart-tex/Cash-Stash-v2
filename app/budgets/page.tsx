import BudgetList from "@/components/BudgetsPage/BudgetsList";
import { getPaginatedBudgetsAction } from "@/actions";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { NotificationCategory } from "@prisma/client";

const BudgetsPage = async ({
  searchParams,
}: {
  searchParams: { page: number; query: string; category: string };
}) => {
  const pageNumber = searchParams.page || 1;
  const query = searchParams.query || "";
  const category = (searchParams.category || "") as NotificationCategory;
  const result = await getPaginatedBudgetsAction({
    pageNumber,
    query,
    category,
  });

  return (
    <main>
      <BudgetList
        budgets={result.budgets}
        pageHasParams={!!(query || category)}
      />
      <RoutePaginationControls {...result} />
    </main>
  );
};

export default BudgetsPage;
