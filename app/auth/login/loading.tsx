import { Skeleton } from "@/components/ui/skeleton";

const LoginPageSkeleton = () => {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4 p-4">
      <div className="w-full space-y-2 rounded-md p-2 shadow-sm md:w-[700px]">
        <Skeleton className="mx-auto h-[75px] w-[200px] rounded-md" />
        <Skeleton className="h-[50px] w-full rounded-md" />
        <Skeleton className="h-[50px] w-full rounded-md" />
        <Skeleton className="h-[50px] w-full rounded-md" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-[50px] w-[100px] rounded-md" />
          <Skeleton className="h-[50px] w-[100px] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default LoginPageSkeleton;
