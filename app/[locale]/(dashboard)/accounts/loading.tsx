import { Skeleton } from "@/components/ui/skeleton";

const AccountsPageSkeleton = () => {
  return (
    <div className="mx-auto w-full p-4 lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-[50px] w-[150px]" />
        <Skeleton className="h-[50px] w-[120px] rounded-md" />
      </div>
      <Skeleton className="mt-4 h-[50px] w-full rounded-md lg:w-[400px]" />
      <Skeleton className="mt-2 h-[50px] w-[100px] rounded-md" />
      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-[200px] w-full rounded-md" />
      </div>
    </div>
  );
};

export default AccountsPageSkeleton;
