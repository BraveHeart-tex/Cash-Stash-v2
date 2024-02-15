import BudgetList from "./BudgetsList";
import { getPaginatedBudgetsAction } from "@/actions";

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
      <BudgetList budgets={result.budgets} />
    </main>
  );
};

export default BudgetsPage;
