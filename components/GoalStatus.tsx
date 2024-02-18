import GoalCard from "./GoalCard";
import CreateGoalButton from "./CreateButtons/CreateGoalButton";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import MotionDiv from "@/components/animations/motion-div";
import { Goal } from "@prisma/client";
import { Button } from "./ui/button";
import Link from "next/link";

const GoalStatus = ({ goals }: { goals: Goal[] }) => {
  if (goals.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary">No goals found.</p>
          <CreateGoalButton />
        </MotionDiv>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresenceClient>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
        <Button className="w-max mt-2 ml-auto">
          <Link href="/goals">See all your goals</Link>
        </Button>
      </AnimatePresenceClient>
    </div>
  );
};

export default GoalStatus;
