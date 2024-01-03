import { SerializedBudget } from "@/app/redux/features/budgetSlice";
import BudgetCard from "../BudgetCard";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";

interface IBudgetCardsProps {
  budgets: SerializedBudget[] | null;
}

const BudgetCards = ({ budgets }: IBudgetCardsProps) => {
  return (
    <AnimatePresenceClient>
      {budgets?.length
        ? budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))
        : null}
    </AnimatePresenceClient>
  );
};

export default BudgetCards;
