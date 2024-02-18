import BudgetCard from "@/components/budget-card";
import CreateBudgetButton from "@/components/create-buttons/create-budget-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import MotionDiv from "@/components/animations/motion-div";
import { Budget } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BudgetStatus = ({ budgets }: { budgets: Budget[] }) => {
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
    <div className="flex flex-col space-y-2">
      <AnimatePresenceClient>
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
        <Button className="w-max mt-2 ml-auto">
          <Link href="/budgets">See all your budgets</Link>
        </Button>
      </AnimatePresenceClient>
    </div>
  );
};

export default BudgetStatus;
