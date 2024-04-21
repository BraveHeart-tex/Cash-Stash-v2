import CreateBudgetButton from "@/components/create-buttons/create-budget-button";

const BudgetsPageHeader = () => {
  return (
    <header className="mb-4 flex w-full items-center justify-between">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Budgets
      </h1>
      <CreateBudgetButton minimizeOnMobile />
    </header>
  );
};

export default BudgetsPageHeader;
