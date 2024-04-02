import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="p-4 w-full mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-[70%] lg:w-[400px] h-[30px]" />
        <Skeleton className="w-full rounded-md lg:w-[350px] h-[30px]" />
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="flex flex-col gap-1" key={index}>
            <Skeleton className="w-[70%] lg:w-[300px] h-[40px] rounded-md mt-2" />
            <Skeleton className="w-full lg:w-[600px] h-[40px] rounded-md mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
