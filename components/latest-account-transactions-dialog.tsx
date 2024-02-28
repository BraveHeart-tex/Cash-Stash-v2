import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Account, Transaction } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTransactionsForAccount } from "@/data/account";
import AccountCard from "./account-card";

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

  const title = `Latest Transactions For : ${selectedAccount?.name}`;
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
              <AccountCard showPopover={false} account={selectedAccount} />
            )}
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
          <AccountCard showPopover={false} account={selectedAccount} />
        )}
      </DialogContent>
    </Dialog>
  );
};
export default LatestAccountTransactionsDialog;
