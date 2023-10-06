"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchGoals } from "@/app/redux/features/goalSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";

const GoalStatus = () => {
  const dispatch = useAppDispatch();
  const { goals, isLoading } = useAppSelector((state) => state.goalReducer);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-[300px] lg:h-[350px]" />
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div>
          <p className="text-primary">No goals found.</p>
          <Button
            className="font-semibold text-md mt-3 hover:bg-foreground hover:text-muted"
            onClick={() => dispatch(setSelectedTab("Goals"))}
          >
            Get started by creating a goal
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div>
      {goals.map((goal) => (
        <div className="mb-4 rounded-md p-2 shadow-xl bg-card" key={goal.name}>
          <Badge className="ml-auto">
            {goal.currentAmount / goal.goalAmount >= 1
              ? "Completed!"
              : `In Progress ${Math.round(
                  (goal.currentAmount / goal.goalAmount) * 100
                )}%`}
          </Badge>
          <div className="mt-2">
            <p className="font-bold mb-2 text-primary">{goal.name}</p>
            <Progress
              value={(goal.currentAmount / goal.goalAmount) * 100}
              indicatorClassName={
                goal.currentAmount / goal.goalAmount > 0.7
                  ? "bg-green-200"
                  : goal.currentAmount / goal.goalAmount > 0.4
                  ? "bg-orange-300"
                  : "bg-red-300"
              }
            />
            <p className="mt-2 text-md text-primary">
              <span className="font-semibold">Current</span>:{" "}
              {goal.currentAmount}₺ / <span className="font-bold">Target</span>:{" "}
              {goal.goalAmount}₺
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalStatus;
