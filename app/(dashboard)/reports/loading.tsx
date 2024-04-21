import { Skeleton } from "@/components/ui/skeleton";

const ReportsPageSkeleton = () => {
  return (
    <div className="mx-auto w-full p-4 lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[30px] w-full lg:w-[400px]" />
        <Skeleton className="h-[30px] w-full rounded-md lg:w-[350px]" />
      </div>
      <div className="mt-6 flex items-center gap-2">
        <Skeleton className="h-[35px] w-[100px]" />
        <Skeleton className="h-[35px] w-[100px]" />
      </div>
      <Skeleton className="mt-2 h-[200px] w-full rounded-md" />
    </div>
  );
};

export default ReportsPageSkeleton;
