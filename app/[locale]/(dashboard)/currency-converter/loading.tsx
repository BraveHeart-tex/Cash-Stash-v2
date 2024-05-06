import { Skeleton } from "@/components/ui/skeleton";

const CurrencyConverterPageSkeleton = () => {
  return (
    <div className="mx-auto p-4 lg:max-w-[1300px] xl:max-w-[1600px]">
      <Skeleton className="h-[50px] w-[150px]" />
      <Skeleton className="mt-4 h-[50px] w-full rounded-md lg:w-[400px]" />
      <Skeleton className="mt-2 h-[50px] w-full rounded-md lg:w-[500px]" />
      <Skeleton className="mt-2 h-[300px] w-full rounded-md lg:h-[500px]" />
    </div>
  );
};

export default CurrencyConverterPageSkeleton;
