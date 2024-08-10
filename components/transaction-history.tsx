import AnimatePresenceClient from "@/components/animations/animate-presence";
import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";
import TransactionCard from "@/components/transactions/transaction-card";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/lib/constants";
import { Link } from "@/navigation";
import type { TransactionWithCategoryAndAccountName } from "@/typings/transactions";
import { useTranslations } from "next-intl";

type TransactionHistoryProps = {
  transactions: TransactionWithCategoryAndAccountName[] | null;
};

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const t = useTranslations("Transactions");
  if (!transactions || transactions.length === 0) {
    return (
      <article className="flex h-[540px] flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-primary">
            {t("TransactionsNotFoundMessage.noTransactionsFound.heading")}
          </p>
          <CreateTransactionButton className="mt-3" />
        </div>
      </article>
    );
  }

  return (
    <div className="max-h-[500px] min-h-[500px] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresenceClient>
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </AnimatePresenceClient>
        <Button className="ml-auto w-max">
          <Link href={PAGE_ROUTES.TRANSACTIONS_ROUTE} className="capitalize">
            {t("seeAllTransactionsLinkLabel")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistory;
