import MotionDiv from "@/components/animations/motion-div";
import { ITransactionPageSearchParams } from "../transactions/page";
import ResponsiveChartContainer from "../chart-container";
import { getChartData } from "@/actions";
import { getPaginatedTransactions } from "@/actions/transaction";
import { DataTable } from "@/components/ui/data-table";
import { transactionTableColumns } from "@/components/reports/transactions-data-table/transaction-table-columns";

const ReportsPage = async ({
  searchParams,
}: {
  searchParams: ITransactionPageSearchParams;
}) => {
  const {
    transactionType = "all",
    accountId = "",
    sortBy = "createdAt",
    sortDirection = "desc",
  } = searchParams;

  const [chartDataResponse, transactionsResult] = await Promise.all([
    getChartData(),
    getPaginatedTransactions({
      transactionType: transactionType as "all" | "income" | "expense",
      accountId: parseInt(accountId),
      sortBy: sortBy as "createdAt" | "amount",
      sortDirection: sortDirection as "asc" | "desc",
      pageNumber: 1,
    }),
  ]);

  const data = chartDataResponse.data || [];

  return (
    <main className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: 200, scale: 1.2 }}
        transition={{ duration: 0.5, type: "just" }}
      >
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-4xl text-primary">Reports</h3>
          <p className="text-muted-foreground">
            Take a look at your overall financial performance and see how your
            spending is doing.
          </p>
        </div>
        {/* TODO: Filter by account, sort by amount*/}
        <DataTable
          columns={transactionTableColumns}
          data={transactionsResult.transactions}
          searchConfig={{
            column: "description",
            placeholder: "Search transactions by description...",
          }}
        />
        <div className="mt-4">
          <ResponsiveChartContainer monthlyTransactionsData={data} />
        </div>
      </MotionDiv>
    </main>
  );
};

export default ReportsPage;
