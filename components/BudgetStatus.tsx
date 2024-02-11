import { SerializedBudget } from "@/app/redux/features/budgetSlice";
import BudgetCard from "./BudgetCard";
import CreateBudgetButton from "./CreateButtons/CreateBudgetButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import MotionDiv from "@/components/animation/MotionDiv";

const BudgetStatus = ({ budgets }: { budgets: SerializedBudget[] }) => {
  if (!budgets || budgets.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary">No budgets found.</p>
          <CreateBudgetButton />
        </MotionDiv>
      </article>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresenceClient>
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </AnimatePresenceClient>
    </div>
  );
};

export default BudgetStatus;
