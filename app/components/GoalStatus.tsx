"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchGoals } from "@/app/redux/features/goalSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";
import { FaBullseye } from "react-icons/fa";
import GoalCard from "./GoalCard";

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
            className="font-semibold text-md mt-3 flex items-center gap-[14px]"
            onClick={() => dispatch(setSelectedTab({ selectedTab: "Goals" }))}
          >
            <FaBullseye size={18} />
            Create a goal
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default GoalStatus;
