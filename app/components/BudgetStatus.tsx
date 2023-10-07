"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBudgets } from "@/app/redux/features/budgetSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";
import { FaMoneyBillAlt } from "react-icons/fa";
import BudgetCardf from "./BudgetCard";

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
          <Button
            className="font-semibold text-md mt-3 flex items-center gap-[14px]"
            onClick={() => dispatch(setSelectedTab({ selectedTab: "Budgets" }))}
          >
            <FaMoneyBillAlt size={18} /> Create a budget
          </Button>
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
