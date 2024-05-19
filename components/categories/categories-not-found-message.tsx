import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";
import { useTranslations } from "next-intl";

type CategoriesNotFoundMessageProps = {
  pageHasParams?: boolean;
};

const CategoriesNotFoundMessage = ({
  pageHasParams = false,
}: CategoriesNotFoundMessageProps) => {
  const t = useTranslations("Categories.CategoriesNotFoundMessage");
  const prefix = pageHasParams
    ? "pageHasParams"
    : ("noCategoriesFound" as const);
  const heading = t(`${prefix}.heading`);
  const message = t(`${prefix}.message`);

  return (
    <div className="w-full pt-6">
      <GenericNotFoundBlock heading={heading} message={message} />
    </div>
  );
};

export default CategoriesNotFoundMessage;
