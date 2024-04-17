import CreateTransactionButton from "../create-buttons/create-transaction-button";

const TransactionsPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between mb-4">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Transactions
      </h1>
      <CreateTransactionButton className="mt-0" />
    </div>
  );
};
export default TransactionsPageHeader;
