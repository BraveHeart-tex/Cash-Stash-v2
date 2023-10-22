import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBudgets } from "@/app/redux/features/budgetSlice";
import { Skeleton } from "@/components/ui/skeleton";
import BudgetCardf from "./BudgetCard";
import CreateBudgetButton from "./CreateButtons/CreateBudgetButton";

const BudgetStatus = () => {
  const dispatch = useAppDispatch();
  const { budgets, isLoading } = useAppSelector((state) => state.budgetReducer);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-[300px] lg:h-[350px]" />
      </div>
    );
  }

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
      {budgets.map((budget) => (
        <BudgetCardf key={budget.id} budget={budget} />
      ))}
    </div>
  );
};

export default BudgetStatus;
