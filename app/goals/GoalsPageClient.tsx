"use client";
import { useEffect } from "react";
import { fetchGoals } from "@/app/redux/features/goalSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import GoalCard from "../components/GoalCard";
import CreateGoalButton from "../components/CreateButtons/CreateGoalButton";

const GoalsPageClient = () => {
  const { goals, isLoading } = useAppSelector((state) => state.goalReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const renderNoGoalsState = () => (
    <div className="flex justify-center items-start lg:items-center flex-col gap-4">
      <h3 className="inline-block text-lg lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        No goals were found.
      </h3>
      <p>Add a goal to get started!</p>
    </div>
  );

  const renderLoadingState = () => <Skeleton className="h-20 w-full" />;

  const renderGoals = () => (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {goals?.map((goal) => (
          <GoalCard goal={goal} key={goal.id} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h2 className="text-4xl lg:mb-4 text-primary">Goals</h2>
      <div className="flex justify-center lg:items-center flex-col gap-2">
        {isLoading ? renderLoadingState() : renderGoals()}
        {!isLoading && !goals ? renderNoGoalsState() : null}
        <CreateGoalButton className="mt-4 self-start" />
      </div>
    </div>
  );
};

export default GoalsPageClient;
