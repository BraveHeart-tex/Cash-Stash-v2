import { Skeleton } from "@/components/ui/skeleton";

const AccountsPageSkeleton = () => {
  return (
    <div className="p-4 w-full mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex items-center justify-between">
        <Skeleton className="w-[150px] h-[50px]" />
        <Skeleton className="rounded-md w-[120px] h-[50px]" />
      </div>
      <Skeleton className="w-full lg:w-[400px] h-[50px] rounded-md mt-4" />
      <Skeleton className="w-[100px] h-[50px] rounded-md mt-2" />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Skeleton className="w-full h-[200px] rounded-md" />
        <Skeleton className="w-full h-[200px] rounded-md" />
        <Skeleton className="w-full h-[200px] rounded-md" />
      </div>
    </div>
  );
};

export default AccountsPageSkeleton;
