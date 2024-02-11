import { getGenericListByCurrentUser } from "@/actions/generic";
import BudgetList from "./BudgetsPage";
import { SerializedBudget } from "../redux/features/budgetSlice";

const BudgetsPage = async () => {
  const result = await getGenericListByCurrentUser<SerializedBudget>({
    tableName: "budget",
  });

  return (
    <main>
      <BudgetList budgets={result?.data || []} />
    </main>
  );
};

export default BudgetsPage;
