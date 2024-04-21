import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";

const TransactionsPageHeader = () => {
  return (
    <header className="flex w-full items-center justify-between mb-4">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Transactions
      </h1>
      <CreateTransactionButton minimizeOnMobile />
    </header>
  );
};
export default TransactionsPageHeader;
