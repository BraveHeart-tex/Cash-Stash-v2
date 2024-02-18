"use client";

import GenericNotFound from "./generic-not-found";

const TransactionsNotFound = ({
  pageHasParams,
}: {
  pageHasParams: boolean;
}) => {
  return (
    <GenericNotFound
      renderTitle={({ className }) => (
        <h3 className={className}>
          {pageHasParams
            ? "No transactions found for your search"
            : "You don't have any transactions yet."}
        </h3>
      )}
      renderMessage={({ className }) => (
        <p className={className}>
          {pageHasParams && "Remove existing filters or "}
          Create a transaction by clicking the "Create Transaction" button.
        </p>
      )}
    />
  );
};
export default TransactionsNotFound;
