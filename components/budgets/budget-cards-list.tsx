import { BudgetSelectModel } from "@/lib/database/schema";
import BudgetCard from "@/components/budget-card";

type BudgetCardsListProps = {
  budgets: BudgetSelectModel[];
};

const BudgetCardsList = ({ budgets }: BudgetCardsListProps) => {
  return (
    <div className="h-[500px] overflow-auto pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 pr-2">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
};
export default BudgetCardsList;
