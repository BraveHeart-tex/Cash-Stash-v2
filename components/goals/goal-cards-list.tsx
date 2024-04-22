import { GoalSelectModel } from "@/lib/database/schema";
import GoalCard from "@/components/goals/goal-card";

type GoalCardsListProps = {
  goals: GoalSelectModel[];
};

const GoalCardsList = ({ goals }: GoalCardsListProps) => {
  return (
    <div className="mt-2 h-[calc(100vh-400px)] overflow-y-auto pb-4 pr-2 pt-2 lg:h-[calc(100vh-400px)]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};
export default GoalCardsList;
