import { SearchParams } from "../transactions/page";
import ReportsPageClient from "./ReportsPageClient";

const ReportsPage = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <main>
      <ReportsPageClient searchParams={searchParams} />
    </main>
  );
};

export default ReportsPage;
