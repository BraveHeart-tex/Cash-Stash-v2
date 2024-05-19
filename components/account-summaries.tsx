import AccountCard from "@/components/account-card";
import CreateAccountButton from "@/components/create-buttons/create-account-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/lib/constants";
import { AccountWithTransactions } from "@/typings/accounts";
import { useTranslations } from "next-intl";

type AccountSummariesProps = {
  accounts: AccountWithTransactions[];
};

const AccountSummaries = ({ accounts }: AccountSummariesProps) => {
  const t = useTranslations("Components.AccountSummaries");
  if (accounts.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-primary">{t("noAccountsFound")}</p>
          <CreateAccountButton />
        </div>
      </article>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 pr-2">
        <AnimatePresenceClient>
          {accounts.map((account, index) => (
            <AccountCard account={account} key={account.id + index} />
          ))}
          <Button className="ml-auto mt-2 w-max">
            <Link href={PAGE_ROUTES.ACCOUNTS_ROUTE} className="capitalize">
              {t("seeAllYourAccounts")}
            </Link>
          </Button>
        </AnimatePresenceClient>
      </ul>
    </div>
  );
};

export default AccountSummaries;
