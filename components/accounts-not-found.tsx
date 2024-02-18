"use client";
import GenericNotFound from "@/components/generic-not-found";

const AccountsNotFound = ({ pageHasParams }: { pageHasParams: boolean }) => {
  return (
    <GenericNotFound
      renderTitle={({ className }) => (
        <h3 className={className}>
          {pageHasParams
            ? "No accounts were found for your search"
            : "You don't have any accounts yet."}
        </h3>
      )}
      renderMessage={({ className }) => (
        <p className={className}>
          {pageHasParams && "Remove existing filters or "}
          Create an account by clicking the "Create an account" button.
        </p>
      )}
    />
  );
};
export default AccountsNotFound;
