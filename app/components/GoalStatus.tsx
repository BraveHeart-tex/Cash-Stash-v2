import { SerializedGoal } from "@/app/redux/features/goalSlice";
import GoalCard from "./GoalCard";
import CreateGoalButton from "./CreateButtons/CreateGoalButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";

const GoalStatus = ({ goals }: { goals: SerializedGoal[] }) => {
  if (goals.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div>
          <p className="text-primary">No goals found.</p>
          <CreateGoalButton />
        </div>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresenceClient>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </AnimatePresenceClient>
    </div>
  );
};

export default GoalStatus;
