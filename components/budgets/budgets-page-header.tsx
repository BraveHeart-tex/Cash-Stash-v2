import CreateBudgetButton from "@/components/create-buttons/create-budget-button";
import { useTranslations } from "next-intl";

const BudgetsPageHeader = () => {
  const t = useTranslations("Budgets");

  return (
    <header className="mb-4 flex w-full items-center justify-between">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        {t("pageTitle")}
      </h1>
      <CreateBudgetButton
        internalizationConfig={{
          buttonLabel: t("createBudgetButtonLabel"),
        }}
        minimizeOnMobile
      />
    </header>
  );
};

export default BudgetsPageHeader;
