import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";
import { useTranslations } from "next-intl";

const TransactionsPageHeader = () => {
  const t = useTranslations("Transactions");
  return (
    <header className="mb-4 flex w-full items-center justify-between">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        {t("pageTitle")}
      </h1>
      <CreateTransactionButton minimizeOnMobile />
    </header>
  );
};
export default TransactionsPageHeader;
