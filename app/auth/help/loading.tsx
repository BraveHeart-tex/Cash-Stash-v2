import { Skeleton } from "@/components/ui/skeleton";

const HelpPageSkeleton = () => {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4 p-4">
      <div className="w-full space-y-2 rounded-md p-2 shadow-sm md:w-[500px]">
        <Skeleton className="mx-auto h-[75px] w-[200px] rounded-md" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-[50px] w-full rounded-md" />
          <Skeleton className="h-[50px] w-full rounded-md" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-[35px] w-[100px] rounded-md" />
          <Skeleton className="h-[35px] w-[100px] rounded-md" />
        </div>
        <Skeleton className="ml-auto h-[35px] w-[100px] rounded-md" />
      </div>
    </div>
  );
};

export default HelpPageSkeleton;
