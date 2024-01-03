import { getChartDataAction, searchTransactions } from "@/actions";
import ReportTable from "../components/ReportsPage/ReportTable";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";
import { SearchParams } from "../transactions/page";
import MotionDiv from "@/components/animation/MotionDiv";

const ReportsPageClient = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const {
    transactionType = "all",
    accountId = "",
    sortBy = "createdAt",
    sortDirection = "desc",
  } = searchParams;

  const [chartDataResponse, userAccountsResponse, userTransactionsResponse] =
    await Promise.all([
      getChartDataAction(),
      getGenericListByCurrentUser<SerializedUserAccount>({
        tableName: "userAccount",
        serialize: true,
      }),
      searchTransactions({
        transactionType: transactionType as "all" | "income" | "expense",
        accountId,
        sortBy: sortBy as "createdAt" | "amount",
        sortDirection: sortDirection as "asc" | "desc",
      }),
    ]);

  const data = chartDataResponse.data || [];
  let userAccountsResult = userAccountsResponse?.data || [];
  let userTransactionsResult = userTransactionsResponse?.transactions || [];

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: 200, scale: 1.2 }}
        transition={{ duration: 0.5, type: "just" }}
      >
        <h3 className="text-4xl mb-4 text-primary">Reports</h3>
        <ReportTable
          monthlyTransactionsData={data}
          currentUserAccounts={userAccountsResult}
          transactions={userTransactionsResult}
        />
      </MotionDiv>
    </div>
  );
};

export default ReportsPageClient;
