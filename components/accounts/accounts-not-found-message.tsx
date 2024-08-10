import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";
import { useTranslations } from "next-intl";

type AccountsNotFoundMessageProps = {
  pageHasParams: boolean;
};

const AccountsNotFoundMessage = ({
  pageHasParams,
}: AccountsNotFoundMessageProps) => {
  const t = useTranslations("Accounts.AccountsNotFoundMessage");

  const heading = t(
    `${pageHasParams ? "pageHasParams" : "noAccountsFound"}.heading`,
  );
  const message = t(
    `${pageHasParams ? "pageHasParams" : "noAccountsFound"}.message`,
  );

  return (
    <div className="w-full pt-6">
      <GenericNotFoundBlock heading={heading} message={message} />
    </div>
  );
};

export default AccountsNotFoundMessage;
