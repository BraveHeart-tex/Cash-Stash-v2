import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Account, Transaction } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTransactionsForAccount } from "@/actions/account";
import AccountCard from "@/components/account-card";
import TransactionCard from "@/components/transactions/transaction-card";
import { FaSpinner } from "react-icons/fa";

interface ILatestAccountTransactionsDialogProps {
  selectedAccount: Account | null;
  onClose: () => void;
}

const LatestAccountTransactionsDialog = ({
  onClose,
  selectedAccount,
}: ILatestAccountTransactionsDialogProps) => {
  let [isPending, startTransition] = useTransition();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const visible = !!selectedAccount;

  const title = `Latest Transactions For : ${selectedAccount?.name || ""}`;
  const description = `You can see the last ${transactions.length} transactions for this
  account below.`;

  useEffect(() => {
    if (selectedAccount) {
      startTransition(async () => {
        const response = await getTransactionsForAccount(selectedAccount.id);
        setTransactions(response);
      });
    }
  }, [selectedAccount]);

  const renderLoadingState = () => {
    return (
      <div className="flex items-center justify-center h-48">
        <FaSpinner className="animate-spin" />
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <div className="flex items-center justify-center h-48">
        No transactions found for this account.
      </div>
    );
  };

  if (isMobile) {
    return (
      <Drawer
        open={visible}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            {selectedAccount && (
              <>
                <AccountCard showPopover={false} account={selectedAccount} />
                <div className="max-h-[400px] overflow-auto">
                  {transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={{
                        ...transaction,
                        createdAt: new Date(transaction.createdAt),
                        updatedAt: new Date(transaction.updatedAt),
                        accountName: selectedAccount.name,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            {isPending && renderLoadingState()}
            {!isPending && transactions.length === 0 && renderEmptyState()}
          </div>
          <DrawerFooter className="pt-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={visible}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {selectedAccount && (
          <>
            <AccountCard showPopover={false} account={selectedAccount} />
            <div className="max-h-[400px] overflow-auto">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={{
                    ...transaction,
                    createdAt: new Date(transaction.createdAt),
                    updatedAt: new Date(transaction.updatedAt),
                    accountName: selectedAccount.name,
                  }}
                />
              ))}
            </div>
          </>
        )}
        {isPending && renderLoadingState()}
        {!isPending && transactions.length === 0 && renderEmptyState()}
      </DialogContent>
    </Dialog>
  );
};
export default LatestAccountTransactionsDialog;
