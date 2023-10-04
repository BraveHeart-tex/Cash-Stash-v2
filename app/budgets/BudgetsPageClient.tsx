"use client";
import BudgetCards from "@/app/components/BudgetsPage/BudgetCards";
import { fetchBudgets } from "@/app/redux/features/budgetSlice";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const BudgetsPageClient = () => {
  const { budgets, isLoading } = useAppSelector((state) => state.budgetReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h3 className="text-4xl mb-4 text-primary">Budgets</h3>
      {!isLoading && budgets?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="inline-block text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-800">
            No budgets were found.
          </h2>
          <p>Add a budget to get started!</p>
        </div>
      )}
      <div className="flex flex-col gap-4 items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 gap-4">
              <BudgetCards budgets={budgets} />
            </div>
          </div>
        )}
        <Button
          onClick={() =>
            dispatch(
              openGenericModal({
                mode: "create",
                key: "budget",
                dialogTitle: "Create a budget",
                dialogDescription:
                  "Fill out the form below to create a budget.",
                entityId: 0,
              })
            )
          }
        >
          Create Budget
        </Button>
      </div>
    </div>
  );
};

export default BudgetsPageClient;
