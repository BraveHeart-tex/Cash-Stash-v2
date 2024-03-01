import { ITransactionPageSearchParams } from "../transactions/page";
import ReportsPageClient from "./ReportsPageClient";

const ReportsPage = ({
  searchParams,
}: {
  searchParams: ITransactionPageSearchParams;
}) => {
  return (
    <main>
      <ReportsPageClient searchParams={searchParams} />
    </main>
  );
};

export default ReportsPage;
