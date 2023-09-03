import ReportsPageClient from "./ReportsPageClient";
import { getChartDataAction } from "@/actions";

const ReportsPage = async () => {
  const { data } = await getChartDataAction();

  return (
    <main>
      <ReportsPageClient monthlyTransactionsData={data ?? []} />
    </main>
  );
};

export default ReportsPage;
