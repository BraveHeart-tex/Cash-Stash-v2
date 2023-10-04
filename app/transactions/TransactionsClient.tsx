"use client";
import TransactionsFilter from "@/app/components/TransactionsPage/TransactionsFilter";
import TransactionsSort from "@/app/components/TransactionsPage/TransactionsSort";
import TransactionList from "@/app/components/TransactionsPage/TransactionList";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";

const TransactionsClient = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h3 className="text-4xl mb-4 text-primary">Transactions</h3>
      <div className="grid h-[50vh] grid-cols-1 lg:grid-cols-3 lg:grid-rows-1 ">
        <div className="col-span-3 lg:col-span-1">
          <div className="flex justify-center items-start gap-1 flex-col">
            <TransactionsFilter />
            <TransactionsSort />
            <Button
              className="mt-4 font-semibold self-start"
              onClick={() =>
                dispatch(
                  openGenericModal({
                    mode: "create",
                    key: "transaction",
                    dialogTitle: "Create a transaction",
                    dialogDescription:
                      "Fill out the form below to create a transaction.",
                    entityId: 0,
                  })
                )
              }
            >
              Create Transaction
            </Button>
          </div>
        </div>
        <div className="col-span-3 lg:col-span-2">
          <div>
            <TransactionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsClient;
