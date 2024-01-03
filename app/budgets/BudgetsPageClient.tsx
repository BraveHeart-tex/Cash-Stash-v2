import BudgetCards from "@/app/components/BudgetsPage/BudgetCards";
import { SerializedBudget } from "@/app/redux/features/budgetSlice";
import CreateBudgetButton from "../components/CreateButtons/CreateBudgetButton";
import MotionDiv from "@/components/animation/MotionDiv";

const BudgetsNotFoundMessage = () => (
  <div className="flex flex-col items-start lg:items-center justify-center gap-4">
    <h2 className="inline-block text-lg lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
      No budgets were found.
    </h2>
    <p className="text-sm lg:text-lg">Add a budget to get started!</p>
  </div>
);

const BudgetList = ({ budgets }: { budgets: SerializedBudget[] }) => {
  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-4xl mb-4 text-primary">Budgets</h3>
      </MotionDiv>
      {budgets?.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5, type: "just" }}
          className="lg:text-center"
        >
          <BudgetsNotFoundMessage />
        </MotionDiv>
      )}
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="w-full">
          <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 gap-4">
            <BudgetCards budgets={budgets} />
          </div>
        </div>
        <CreateBudgetButton className="mt-4 self-start" />
      </div>
    </div>
  );
};

export default BudgetList;
