import GoalCard from "@/components/goals/goal-card";
import CreateGoalButton from "@/components/create-buttons/create-goal-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { PAGE_ROUTES } from "@/lib/constants";
import { GoalSelectModel } from "@/lib/database/schema";
import { useTranslations } from "next-intl";

type GoalStatusProps = { goals: GoalSelectModel[] };

const GoalStatus = ({ goals }: GoalStatusProps) => {
  const t = useTranslations("Goals");
  if (goals.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-primary">
            {t("GoalsNotFoundMessage.noGoalsFound.heading")}
          </p>
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
        <Button className="ml-auto mt-2 w-max">
          <Link href={PAGE_ROUTES.GOALS_ROUTE} className="capitalize">
            {t("allGoalsLinkLabel")}
          </Link>
        </Button>
      </AnimatePresenceClient>
    </div>
  );
};

export default GoalStatus;
