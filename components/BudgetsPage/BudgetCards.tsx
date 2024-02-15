import BudgetCard from "../BudgetCard";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import { Budget } from "@prisma/client";

interface IBudgetCardsProps {
  budgets: Budget[] | null;
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
