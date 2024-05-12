import CreateGoalButton from "@/components/create-buttons/create-goal-button";
import { useTranslations } from "next-intl";

const GoalsPageHeader = () => {
  const t = useTranslations("Goals");
  return (
    <header className="mb-4 flex items-center justify-between">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        {t("pageTitle")}
      </h1>
      <CreateGoalButton minimizeOnMobile />
    </header>
  );
};

export default GoalsPageHeader;
