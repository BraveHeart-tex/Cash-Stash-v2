import { GoalSelectModel } from "@/lib/database/schema";
import GoalCard from "./goal-card";

type GoalCardsListProps = {
  goals: GoalSelectModel[];
};

const GoalCardsList = ({ goals }: GoalCardsListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 pr-2 pt-2 overflow-y-auto max-h-[500px]">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};
export default GoalCardsList;
