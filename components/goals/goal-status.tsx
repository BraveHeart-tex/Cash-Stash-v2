import GoalCard from "@/components/goals/goal-card";
import CreateGoalButton from "@/components/create-buttons/create-goal-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PAGE_ROUTES } from "@/lib/constants";
import { GoalSelectModel } from "@/lib/database/schema";

type GoalStatusProps = { goals: GoalSelectModel[] };

const GoalStatus = ({ goals }: GoalStatusProps) => {
  if (goals.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-primary">No goals found.</p>
          <CreateGoalButton />
        </div>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-2 pr-2">
      <AnimatePresenceClient>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
        <Button className="w-max mt-2 ml-auto">
          <Link href={PAGE_ROUTES.GOALS_ROUTE}>See all your goals</Link>
        </Button>
      </AnimatePresenceClient>
    </div>
  );
};

export default GoalStatus;
