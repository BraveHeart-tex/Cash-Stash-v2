import { Skeleton } from "@/components/ui/skeleton";

const HelpPageSkeleton = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 gap-4">
      <div className="w-full md:w-[500px] space-y-2 shadow-sm p-2 rounded-md">
        <Skeleton className="mx-auto w-[200px] h-[75px] rounded-md" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="w-full h-[50px] rounded-md" />
          <Skeleton className="w-full h-[50px] rounded-md" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="w-[100px] h-[35px] rounded-md" />
          <Skeleton className="w-[100px] h-[35px] rounded-md" />
        </div>
        <Skeleton className="w-[100px] h-[35px] rounded-md ml-auto" />
      </div>
    </div>
  );
};

export default HelpPageSkeleton;
