import { Skeleton } from "@/components/ui/skeleton";

const CurrencyConverterPageSkeleton = () => {
  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <Skeleton className="w-[150px] h-[50px]" />
      <Skeleton className="w-full lg:w-[400px] h-[50px] rounded-md mt-4" />
      <Skeleton className="w-full lg:w-[500px] h-[50px] rounded-md mt-2" />
      <Skeleton className="w-full h-[300px] lg:h-[500px] rounded-md mt-2" />
    </div>
  );
};

export default CurrencyConverterPageSkeleton;
