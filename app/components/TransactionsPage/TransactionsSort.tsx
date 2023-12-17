"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GenericSelect from "@/components/GenericSelect";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ITransactionsSortProps {}

const TransactionsSort = ({}: ITransactionsSortProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortByChange = (value: string) => {
    handleSortChange(value, "sortBy");
  };

  const handleSortDirectionChange = (value: string) => {
    handleSortChange(value, "sortDirection");
  };

  const sortByOptions = [
    { value: "amount", label: "Amount" },
    { value: "createdAt", label: "Date" },
  ];

  const sortDirectionOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const handleSortChange = (value: string, key: "sortBy" | "sortDirection") => {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    currentSearchParams.set(key, value);
    const search = currentSearchParams.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <Card className={"w-full lg:w-3/4 mt-4"}>
      <CardHeader>
        <CardTitle className={"text-lg"}>Sort</CardTitle>{" "}
        <CardDescription>Sort transactions by amount or date.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={"grid grid-cols-1 gap-2"}>
          <div>
            <Label className="text-[14px] xl:text-md font-semibold">
              Sort By
            </Label>
            <GenericSelect
              placeholder={"Sort By"}
              options={sortByOptions}
              onChange={(value) => handleSortByChange(value)}
              selectLabel={"Sort By"}
            />
          </div>
          <div>
            <Label className="text-[14px] xl:text-md font-semibold">
              Sort Direction
            </Label>
            <GenericSelect
              placeholder={"Sort Direction"}
              options={sortDirectionOptions}
              onChange={(value) => handleSortDirectionChange(value)}
              selectLabel={"Sort Direction"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsSort;
