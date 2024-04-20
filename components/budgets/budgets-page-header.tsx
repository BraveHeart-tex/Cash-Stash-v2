import CreateBudgetButton from "../create-buttons/create-budget-button";

const BudgetsPageHeader = () => {
  return (
    <header className="flex w-full items-center justify-between mb-4">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Budgets
      </h1>
      <CreateBudgetButton className="mt-0" />
    </header>
  );
};

export default BudgetsPageHeader;
