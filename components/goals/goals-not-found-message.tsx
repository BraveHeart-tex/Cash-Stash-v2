import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";
import { useTranslations } from "next-intl";

type GoalsNotFoundMessageProps = {
  pageHasParams: boolean;
};

const GoalsNotFoundMessage = ({ pageHasParams }: GoalsNotFoundMessageProps) => {
  const t = useTranslations("Goals.GoalsNotFoundMessage");

  const heading = t(
    `${pageHasParams ? "pageHasParams" : "noGoalsFound"}.heading`,
  );

  const message = t(
    `${pageHasParams ? "pageHasParams" : "noGoalsFound"}.message`,
  );

  return (
    <div className="w-full pt-6">
      <GenericNotFoundBlock heading={heading} message={message} />
    </div>
  );
};
export default GoalsNotFoundMessage;
