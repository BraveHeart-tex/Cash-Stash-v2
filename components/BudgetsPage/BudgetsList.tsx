import BudgetCards from "@/components/BudgetsPage/BudgetCards";
import BudgetsNotFoundMessage from "@/components/BudgetsPage/BudgetsNotFoundMessage";
import CreateBudgetButton from "@/components/CreateButtons/CreateBudgetButton";
import MotionDiv from "@/components/animation/MotionDiv";
import { Budget } from "@prisma/client";
import RouteSearchInput from "../route-search-input";

const BudgetList = ({
  budgets,
  pageHasParams,
}: {
  budgets: Budget[];
  pageHasParams: boolean;
}) => {
  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex w-full items-center justify-between mb-4"
      >
        <h3 className="text-4xl text-primary">Budgets</h3>
        <CreateBudgetButton className="mt-0" />
      </MotionDiv>
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
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="w-full">
          <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 gap-4">
            <BudgetCards budgets={budgets} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetList;
