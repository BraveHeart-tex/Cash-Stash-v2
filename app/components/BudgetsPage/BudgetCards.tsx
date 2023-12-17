import { SerializedBudget } from "@/app/redux/features/budgetSlice";
import BudgetCard from "../BudgetCard";

interface IBudgetCardsProps {
  budgets: SerializedBudget[] | null;
}

const BudgetCards = ({ budgets }: IBudgetCardsProps) => {
  return (
    <>
      {budgets?.length
        ? budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))
        : null}
    </>
  );
};

export default BudgetCards;
