import { GoalSelectModel } from "@/lib/database/schema";
import GoalCard from "@/components/goals/goal-card";

type GoalCardsListProps = {
  goals: GoalSelectModel[];
};

const GoalCardsList = ({ goals }: GoalCardsListProps) => {
  return (
    <div
      className="mt-2 grid h-[calc(100vh-450px)] grid-cols-1 gap-4 overflow-auto overflow-y-auto pb-4 pr-2 pt-2 lg:h-[calc(100vh-400px)] lg:grid-cols-2 xl:grid-cols-3"
      style={{
        gridAutoRows: "min-content",
      }}
    >
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};
export default GoalCardsList;
