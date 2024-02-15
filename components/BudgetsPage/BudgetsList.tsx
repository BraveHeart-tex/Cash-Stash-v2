import BudgetsNotFoundMessage from "@/components/BudgetsPage/BudgetsNotFoundMessage";
import CreateBudgetButton from "@/components/CreateButtons/CreateBudgetButton";
import MotionDiv from "@/components/animation/MotionDiv";
import { Budget } from "@prisma/client";
import RouteSearchInput from "@/components/route-search-input";
import BudgetCard from "@/components/BudgetCard";

const BudgetList = ({
  budgets,
  pageHasParams,
}: {
  budgets: Budget[];
  pageHasParams: boolean;
}) => {
  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex w-full items-center justify-between mb-4">
        <h3 className="text-4xl text-primary">Budgets</h3>
        <CreateBudgetButton className="mt-0" />
      </div>
      <RouteSearchInput placeholder="Search budgets by name" />
      {budgets?.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5, type: "just" }}
          className="lg:text-center"
        >
          <BudgetsNotFoundMessage pageHasParams={pageHasParams} />
        </MotionDiv>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-auto pb-4">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
