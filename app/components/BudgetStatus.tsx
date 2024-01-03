import { SerializedBudget } from "@/app/redux/features/budgetSlice";
import BudgetCard from "./BudgetCard";
import CreateBudgetButton from "./CreateButtons/CreateBudgetButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";

const BudgetStatus = ({ budgets }: { budgets: SerializedBudget[] }) => {
  if (!budgets || budgets.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div>
          <p className="text-primary">No budgets found.</p>
          <CreateBudgetButton />
        </div>
      </article>
    );
  }

  return (
    <div>
      <AnimatePresenceClient>
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </AnimatePresenceClient>
    </div>
  );
};

export default BudgetStatus;
