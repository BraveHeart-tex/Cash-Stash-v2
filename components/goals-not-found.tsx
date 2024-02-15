"use client";
import GenericNotFound from "@/components/NotFound";

const GoalsNotFound = ({ pageHasParams }: { pageHasParams: boolean }) => {
  return (
    <GenericNotFound
      renderTitle={({ className }) => (
        <h3 className={className}>
          {pageHasParams
            ? "No goals were found for your search"
            : "You don't have any financial goals yet."}
        </h3>
      )}
      renderMessage={({ className }) => (
        <p className={className}>
          {pageHasParams && "Remove existing filters or "}
          Create a financial goal by clicking the "Create a goal" button.
        </p>
      )}
    />
  );
};
export default GoalsNotFound;
