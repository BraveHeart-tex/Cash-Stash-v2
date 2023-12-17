"use client";
import { SerializedUserAccount } from "@/app/redux/features/userAccountSlice";
import GenericSelect from "@/components/GenericSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TransactionsFilter = ({
  currentUserAccounts,
}: {
  currentUserAccounts: SerializedUserAccount[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const TransactionTypeOptions = [
    { value: "all", label: "All" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const AccountOptions = [
    { value: "", label: "All" },
    ...(currentUserAccounts?.map((account) => ({
      value: account.id.toString(),
      label: account.name,
    })) ?? []),
  ];

  const handleFilterChange = (
    value: string,
    key: "transactionType" | "accountId"
  ) => {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    currentSearchParams.set(key, value);
    const search = currentSearchParams.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <Card className="min-h-[10rem] w-full lg:w-[75%] mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Filter Transactions</CardTitle>
        <CardDescription>
          Filter transactions by transaction type and account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <Label className="text-[14px] xl:text-md font-semibold">
              By Transaction Type
            </Label>
            <GenericSelect
              placeholder={"Transaction Type"}
              options={TransactionTypeOptions}
              onChange={(value) => {
                handleFilterChange(value, "transactionType");
              }}
              selectLabel={"Transaction Type"}
            />
          </div>
          <div>
            <Label className="text-[14px] xl:text-md font-semibold">
              By Account
            </Label>
            <GenericSelect
              placeholder={"Account"}
              options={AccountOptions}
              onChange={(value) => {
                handleFilterChange(value, "accountId");
              }}
              selectLabel={"Account"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsFilter;
