"use client";
import { TransactionSelectModel } from "@/lib/database/schema";
import { cn } from "@/lib/utils/stringUtils/cn";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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
        new Date(row.original.createdAt),
        "dd/MM/yyyy HH:mm"
      );
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
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
  },
];
