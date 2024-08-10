import AccountCardContent from "@/components/account-card-content";
import TransactionCard from "@/components/transactions/transaction-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { AccountSelectModel } from "@/lib/database/schema";
import type { TransactionWithCategoryAndAccountName } from "@/typings/transactions";
import { useMediaQuery } from "usehooks-ts";

type LatestAccountTransactionsDialogProps = {
  selectedAccount:
    | (AccountSelectModel & {
        transactions: TransactionWithCategoryAndAccountName[];
      })
    | null;
  onClose: () => void;
};

const LatestAccountTransactionsDialog = ({
  onClose,
  selectedAccount,
}: LatestAccountTransactionsDialogProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const visible = !!(
    selectedAccount && selectedAccount.transactions.length > 0
  );

  if (!selectedAccount) return null;
  const { transactions } = selectedAccount;

  const title = `Latest Transactions For : ${selectedAccount.name || ""}`;
  const description = `You can see the last ${transactions.length} transaction${transactions.length === 1 ? "" : "s"} for this
  account below.`;

  const renderMainContent = () => {
    return (
      <>
        <AccountCardContent account={selectedAccount} />
        <div className="max-h-[400px] overflow-auto">
          {transactions.map((transaction) => (
            <TransactionCard
              useLayoutId={false}
              key={transaction.id}
              showPopover={false}
              transaction={transaction}
            />
          ))}
        </div>
      </>
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
          <div className="px-4">{renderMainContent()}</div>
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
        {renderMainContent()}
      </DialogContent>
    </Dialog>
  );
};
export default LatestAccountTransactionsDialog;
