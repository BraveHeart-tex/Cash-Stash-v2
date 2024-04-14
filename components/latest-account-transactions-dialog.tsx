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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionCard from "@/components/transactions/transaction-card";
import {
  AccountSelectModel,
  TransactionSelectModel,
} from "@/lib/database/schema";
import AccountCardContent from "./account-card-content";

interface ILatestAccountTransactionsDialogProps {
  selectedAccount:
    | (AccountSelectModel & {
        transactions: TransactionSelectModel[];
      })
    | null;
  onClose: () => void;
}

const LatestAccountTransactionsDialog = ({
  onClose,
  selectedAccount,
}: ILatestAccountTransactionsDialogProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const visible = !!(
    selectedAccount && selectedAccount.transactions.length > 0
  );

  if (!selectedAccount) return null;
  const { transactions } = selectedAccount;

  const title = `Latest Transactions For : ${selectedAccount.name || ""}`;
  const description = `You can see the last ${transactions.length} transaction${transactions.length === 1 ? "" : "s"} for this
  account below.`;

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
            <AccountCardContent account={selectedAccount} />
            <div className="max-h-[400px] overflow-auto">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={{
                    ...transaction,
                    accountName: selectedAccount.name,
                  }}
                />
              ))}
            </div>
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
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AccountCardContent account={selectedAccount} />
        <div className="max-h-[400px] overflow-auto">
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              showPopover={false}
              transaction={{
                ...transaction,
                accountName: selectedAccount.name,
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default LatestAccountTransactionsDialog;
