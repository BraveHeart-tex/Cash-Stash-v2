import { getPaginatedAccounts } from "@/server/account";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { AccountSelectModel } from "@/lib/database/schema";

import AccountsNotFoundMessage from "@/components/accounts/accounts-not-found-message";
import AccountsPageHeader from "@/components/accounts/accounts-page-header";
import AccountsPageFilters from "@/components/accounts/accounts-page-filters";
import AccountCardsList from "@/components/accounts/account-cards-list";
import { getTranslations } from "next-intl/server";

type AccountsPageSearchParamsType = {
  page: string;
  query: string;
  category: AccountSelectModel["category"];
  sortBy: string;
  sortDirection: string;
};

type AccountPageProps = {
  searchParams: AccountsPageSearchParamsType;
};

const AccountsPage = async ({ searchParams }: AccountPageProps) => {
  const pageNumber = parseInt(searchParams.page) || 1;
  const query = searchParams.query || "";
  const category = searchParams.category || "";
  const sortBy = searchParams.sortBy || "";
  const sortDirection = searchParams.sortDirection || "";

  const result = await getPaginatedAccounts({
    pageNumber,
    query,
    category,
    sortBy,
    sortDirection,
  });
  const { accounts, totalPages } = result;
  const pageHasParams = !!(query || category);
  const t = await getTranslations("Accounts");

  return (
    <main>
      <div className="mx-auto mb-2 p-4 lg:max-w-[1300px] xl:max-w-[1600px]">
        <AccountsPageHeader title={t("pageTitle")} />
        <AccountsPageFilters accounts={accounts} />
        {accounts.length === 0 && (
          <AccountsNotFoundMessage pageHasParams={pageHasParams} />
        )}
        <AccountCardsList accounts={accounts} />
      </div>
      {totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default AccountsPage;
