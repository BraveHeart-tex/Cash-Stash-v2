import { getPaginatedBudgets } from "@/server/budget";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { getCategoriesByType } from "@/server/category";
import { CATEGORY_TYPES } from "@/lib/constants";
import BudgetsPageHeader from "@/components/budgets/budgets-page-header";
import BudgetsPageFilters from "@/components/budgets/budgets-page-filters";
import BudgetCardsList from "@/components/budgets/budget-cards-list";
import BudgetsNotFoundMessage from "@/components/budgets/budgets-not-found-message";

type BudgetsPageSearchParamsType = {
  page: string;
  query: string;
  category: string;
  sortBy: string;
  sortDirection: string;
};

type BudgetsPageProps = {
  searchParams: BudgetsPageSearchParamsType;
};

const BudgetsPage = async ({ searchParams }: BudgetsPageProps) => {
  const actionParams = {
    pageNumber: parseInt(searchParams.page) || 1,
    query: searchParams.query || "",
    category: searchParams.category,
    sortBy: searchParams.sortBy || "",
    sortDirection: searchParams.sortDirection || "",
  };

  const pageHasParams = Object.values(searchParams)
    .filter((param) => param !== searchParams.page)
    .some((param) => param);

  const [budgetsResponse, initialBudgetCategories] = await Promise.all([
    getPaginatedBudgets(actionParams),
    getCategoriesByType(CATEGORY_TYPES.BUDGET),
  ]);

  const { budgets, totalPages } = budgetsResponse;

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <BudgetsPageHeader />
        <BudgetsPageFilters
          initialBudgetCategories={initialBudgetCategories || []}
          budgets={budgets}
        />
        {budgets.length === 0 ? (
          <BudgetsNotFoundMessage pageHasParams={pageHasParams} />
        ) : (
          <BudgetCardsList budgets={budgets} />
        )}
      </div>
      {totalPages > 1 && <RoutePaginationControls {...budgetsResponse} />}
    </main>
  );
};

export default BudgetsPage;
