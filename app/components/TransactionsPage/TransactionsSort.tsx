"use client";
import {
  updateFilteredData,
  setSortBy,
  setSortDirection,
} from "@/app/redux/features/transactionsSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GenericSelect from "@/components/GenericSelect";
import { Label } from "@/components/ui/label";

interface ITransactionsSortProps {}

const TransactionsSort = ({}: ITransactionsSortProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSortBy(""));
    dispatch(setSortDirection(""));
  }, [dispatch]);

  const handleSortByChange = (value: string) => {
    dispatch(setSortBy(value as "amount" | "date"));
    dispatch(updateFilteredData());
  };

  const handleSortDirectionChange = (value: string) => {
    dispatch(setSortDirection(value as "asc" | "desc"));
    dispatch(updateFilteredData());
  };

  const sortByOptions = [
    { value: "amount", label: "Amount" },
    { value: "date", label: "Date" },
  ];

  const sortDirectionOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  return (
    <Card className={"w-full lg:w-3/4 mt-4"}>
      <CardHeader>
        <CardTitle>Sort</CardTitle>{" "}
        <CardDescription>Sort transactions by amount or date.</CardDescription>
      </CardHeader>
      <CardContent>
        <h2 className={"font-xl mb-4"}>Sort</h2>
      </CardContent>

      <div className={"grid grid-cols-1 gap-2"}>
        <div>
          <Label>Sort By</Label>
          <GenericSelect
            placeholder={"Sort By"}
            options={sortByOptions}
            onChange={(value) => handleSortByChange(value)}
          />
        </div>
        <div>
          <Label>Sort Direction</Label>
          <GenericSelect
            placeholder={"Sort Direction"}
            options={sortDirectionOptions}
            onChange={(value) => handleSortDirectionChange(value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default TransactionsSort;
