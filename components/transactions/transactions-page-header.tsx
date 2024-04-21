import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";

const TransactionsPageHeader = () => {
  return (
    <header className="mb-4 flex w-full items-center justify-between">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Transactions
      </h1>
      <CreateTransactionButton minimizeOnMobile />
    </header>
  );
};
export default TransactionsPageHeader;
