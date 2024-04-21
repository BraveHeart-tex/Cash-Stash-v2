import { Skeleton } from "@/components/ui/skeleton";

const SettingsPageSkeleton = () => {
  return (
    <div className="mx-auto w-full p-4 lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[30px] w-[70%] lg:w-[400px]" />
        <Skeleton className="h-[30px] w-full rounded-md lg:w-[350px]" />
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="flex flex-col gap-1" key={index}>
            <Skeleton className="mt-2 h-[40px] w-[70%] rounded-md lg:w-[300px]" />
            <Skeleton className="mt-2 h-[40px] w-full rounded-md lg:w-[600px]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPageSkeleton;
