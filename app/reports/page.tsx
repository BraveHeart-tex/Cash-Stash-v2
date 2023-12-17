import { SearchParams } from "../transactions/page";
import ReportsPageClient from "./ReportsPageClient";

const ReportsPage = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <main>
      {/* @ts-expect-error React Server Component */}
      <ReportsPageClient searchParams={searchParams} />
    </main>
  );
};

export default ReportsPage;
