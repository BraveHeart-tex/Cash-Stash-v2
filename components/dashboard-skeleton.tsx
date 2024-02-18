import { Skeleton } from "./ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="p-0 lg:p-1 lg.pt-0 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[30rem] w-[30rem]" />
        ))}
      </div>
    </div>
  );
};
export default DashboardSkeleton;
