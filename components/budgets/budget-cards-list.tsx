import BudgetCard from "@/components/budget-card";
import type { BudgetWithCategory } from "@/typings/budgets";

type BudgetCardsListProps = {
  budgets: BudgetWithCategory[];
};

const BudgetCardsList = ({ budgets }: BudgetCardsListProps) => {
  return (
    <div className="mt-2 h-[calc(100vh-450px)] overflow-auto lg:h-[calc(100vh-400px)]">
      <div className="grid grid-cols-1 gap-4 pb-4 pr-2 lg:grid-cols-2 xl:grid-cols-3">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
};
export default BudgetCardsList;
