import { getChartDataAction } from "@/actions";
import Dashboard from "./components/Dashboard";

export default async function Home() {
  const { data } = await getChartDataAction();
  return (
    <main>
      <Dashboard monthlyTransactionData={data ?? []} />
    </main>
  );
}
