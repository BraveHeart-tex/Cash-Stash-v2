"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBudgets } from "@/app/redux/features/budgetSlice";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";

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
            className="font-semibold text-md mt-3 hover:bg-foreground hover:text-muted"
            onClick={() => dispatch(setSelectedTab("Budgets"))}
          >
            Get started by creating a budget
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div>
      {budgets.map((budget) => (
        <div
          key={budget.category}
          className="mb-4 rounded-md p-2 shadow-xl bg-card"
        >
          <p className="font-bold mb-2">
            {budget.category.charAt(0).toUpperCase() +
              budget.category.toLowerCase().slice(1)}
          </p>
          <Progress
            value={(budget.spentAmount / budget.budgetAmount) * 100}
            indicatorClassName={
              budget.spentAmount / budget.budgetAmount > 0.7
                ? "bg-red-300"
                : budget.spentAmount / budget.budgetAmount > 0.4
                ? "bg-orange-300"
                : "bg-green-300"
            }
          />
          <p className="mt-2 text-md">
            Spent: {budget.spentAmount}₺ / Budget: {budget.budgetAmount}₺
          </p>
        </div>
      ))}
    </div>
  );
};

export default BudgetStatus;
