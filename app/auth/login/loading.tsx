import { Skeleton } from "@/components/ui/skeleton";

const LoginPageSkeleton = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 gap-4">
      <div className="w-full md:w-[700px] space-y-2 shadow-sm p-2 rounded-md">
        <Skeleton className="mx-auto w-[200px] h-[75px] rounded-md" />
        <Skeleton className="w-full h-[50px] rounded-md" />
        <Skeleton className="w-full h-[50px] rounded-md" />
        <Skeleton className="w-full h-[50px] rounded-md" />
        <div className="flex items-center justify-between">
          <Skeleton className="w-[100px] h-[50px] rounded-md" />
          <Skeleton className="w-[100px] h-[50px] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default LoginPageSkeleton;
