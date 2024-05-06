import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";
import { useTranslations } from "next-intl";

type BudgetsNotFoundMessageProps = {
  pageHasParams: boolean;
};

const BudgetsNotFoundMessage = ({
  pageHasParams,
}: BudgetsNotFoundMessageProps) => {
  const t = useTranslations("Budgets.BudgetsNotFoundMessage");

  const messageKey = pageHasParams ? "pageHasParams" : "noBudgetsFound";

  const heading = t(`${messageKey}.heading`);
  const message = t(`${messageKey}.message`);

  return (
    <div className="w-full pt-6">
      <GenericNotFoundBlock heading={heading} message={message} />
    </div>
  );
};
export default BudgetsNotFoundMessage;
