import MotionDiv from "@/components/animations/motion-div";
import { ITransactionPageSearchParams } from "../transactions/page";
import { getChartData } from "@/actions";
import { getPaginatedTransactions } from "@/actions/transaction";
import { DataTable } from "@/components/ui/data-table";
import { transactionTableColumns } from "@/components/reports/transactions-data-table/transaction-table-columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeAndExpenseChart from "@/components/income-expense-chart";

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
          <h1 className="text-4xl text-primary">Reports</h1>
          <p className="text-muted-foreground">
            Take a look at your overall financial performance and see how your
            spending is doing.
          </p>
        </div>
        <Tabs defaultValue="transactions">
          <TabsList className="rounded-b-none border border-b-0 mr-12 w-full md:w-auto justify-start overflow-x-auto overflow-y-hidden scrollbar-hide">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="incomeAndExpenses">
              Income vs Expenses
            </TabsTrigger>
          </TabsList>
          <div className="lg:p-4 p-2 border rounded-r-lg rounded-bl-lg rounded-tr-none md:rounded-tr-lg">
            <TabsContent value="transactions">
              <div>
                <p className="text-muted-foreground">
                  Below table shows all your transactions. You can filter by
                  account, sort by amount and date.
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
            </TabsContent>
            <TabsContent value="incomeAndExpenses">
              <div className="mt-4">
                <IncomeAndExpenseChart monthlyTransactionsData={data} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </MotionDiv>
    </main>
  );
};

export default ReportsPage;
