"use client";

import { Skeleton } from "@/components/ui/skeleton";

const FormLoadingSpinner = () => {
  return (
    <div className="h-[20vh] flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default FormLoadingSpinner;
