"use client";
import { Button } from "@/components/ui/button";
import { TransactionSelectModel } from "@/lib/database/schema";
import { cn } from "@/lib/utils/stringUtils/cn";
import { generateLabelFromEnumValue } from "@/lib/utils/stringUtils/generateLabelFromEnumValue";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { FaArrowsUpDown } from "react-icons/fa6";

type TransactionWithAccount = Pick<
  TransactionSelectModel,
  "amount" | "category" | "createdAt" | "description"
> & { accountName: string };

export const transactionTableColumns: ColumnDef<TransactionWithAccount>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.getValue("createdAt")),
        "dd MMM yyyy HH:mm"
      );
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div
          className={cn(
            "font-medium",
            amount > 0 ? "text-success" : "text-destructive"
          )}
        >
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "accountName",
    header: "Account",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const value = row.getValue("category") as string;

      return <div>{generateLabelFromEnumValue(value)}</div>;
    },
  },
];
