import BudgetCard from "@/components/budget-card";
import CreateBudgetButton from "@/components/create-buttons/create-budget-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { PAGE_ROUTES } from "@/lib/constants";
import { BudgetWithCategory } from "@/typings/budgets";
import { useTranslations } from "next-intl";

type BudgetStatusProps = {
  budgets: BudgetWithCategory[];
};

const BudgetStatus = ({ budgets }: BudgetStatusProps) => {
  const t = useTranslations("Budgets");
  if (!budgets || budgets.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-primary">No budgets found.</p>
          <CreateBudgetButton
            internalizationConfig={{
              buttonLabel: t("createBudgetButtonLabel"),
              dialogTitle: t("createBudgetDialogTitle"),
              dialogDescription: t("createBudgetDialogDescription"),
            }}
          />
        </div>
      </article>
    );
  }

  return (
    <div className="flex flex-col space-y-2 pr-2">
      <AnimatePresenceClient>
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
        <Button className="ml-auto mt-2 w-max">
          <Link href={PAGE_ROUTES.BUDGETS_ROUTE}>See all your budgets</Link>
        </Button>
      </AnimatePresenceClient>
    </div>
  );
};

export default BudgetStatus;
