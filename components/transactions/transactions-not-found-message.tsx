import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";
import { useTranslations } from "next-intl";

const TransactionsNotFoundMessage = ({
  pageHasParams,
}: {
  pageHasParams: boolean;
}) => {
  const t = useTranslations("Transactions.TransactionsNotFoundMessage");
  const prefix = pageHasParams
    ? "pageHasParams"
    : ("noTransactionsFound" as const);
  const heading = t(`${prefix}.heading`);
  const message = t(`${prefix}.message`);

  return (
    <div className="w-full pt-6">
      <GenericNotFoundBlock heading={heading} message={message} />
    </div>
  );
};
export default TransactionsNotFoundMessage;
