import { Skeleton } from "@/components/ui/skeleton";

const ReportsPageSkeleton = () => {
  return (
    <div className="p-4 w-full mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full lg:w-[400px] h-[30px]" />
        <Skeleton className="w-full rounded-md lg:w-[350px] h-[30px]" />
      </div>
      <div className="flex items-center gap-2 mt-6">
        <Skeleton className="w-[100px] h-[35px]" />
        <Skeleton className="w-[100px] h-[35px]" />
      </div>
      <Skeleton className="w-full h-[200px] rounded-md mt-2" />
    </div>
  );
};

export default ReportsPageSkeleton;
