"use client";
import GenericNotFound from "../NotFound";

const BudgetsNotFoundMessage = ({ pageHasParams }: { pageHasParams: boolean }) => {
  return (
    <GenericNotFound
      renderTitle={({ className }) => (
        <h3 className={className}>
          {pageHasParams ? "No budgets found for your search" : "You don't have any budgets yet."}
        </h3>
      )}
      renderMessage={({ className }) => (
        <p className={className}>
          {pageHasParams && "Remove existing filters or "}
          Create a budget by clicking the "Create a budget" button.
        </p>
      )}
    />
  );
};
export default BudgetsNotFoundMessage;
