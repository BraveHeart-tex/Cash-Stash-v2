"use client";
import GoalCard from "@/app/components/GoalsPage/GoalCard";
import { useEffect } from "react";
import { SerializedGoal, fetchGoals } from "@/app/redux/features/goalSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";
import { Skeleton } from "@/components/ui/skeleton";

const GoalsPageClient = () => {
  const { goals, isLoading } = useAppSelector((state) => state.goalReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const renderNoGoalsState = () => (
    <div className="flex justify-center items-center flex-col gap-4">
      <h3 className="inline-block text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        No goals were found.
      </h3>
      <p>Add a goal to get started!</p>
    </div>
  );

  const renderLoadingState = () => <Skeleton className="h-[200px] w-full" />;

  const renderGoals = () => (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <GoalCard goals={goals as SerializedGoal[]} />
      </div>
    </div>
  );

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h2 className="text-4xl mb-4 text-primary">Goals</h2>
      <div className="flex justify-center items-center flex-col gap-2">
        {isLoading ? renderLoadingState() : renderGoals()}
        {!isLoading && goals?.length === 0 ? renderNoGoalsState() : null}
        <Button
          className="mt-4 self-start"
          onClick={() =>
            dispatch(
              openGenericModal({
                mode: "create",
                dialogTitle: "Create Goal",
                dialogDescription:
                  "Create a new goal by filling out the form below.",
                entityId: 0,
                key: "goal",
              })
            )
          }
        >
          Create Goal
        </Button>
      </div>
    </div>
  );
};

export default GoalsPageClient;
