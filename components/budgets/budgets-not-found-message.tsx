import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";

const BudgetsNotFoundMessage = ({
  pageHasParams,
}: {
  pageHasParams: boolean;
}) => {
  return (
    <div className="pt-6 w-full">
      <GenericNotFoundBlock
        heading={
          pageHasParams
            ? "No budgets were found for your search"
            : "You don't have any budgets setup yet."
        }
        message={`${pageHasParams && "Remove existing filters or "} Create a budget by clicking the 'Create a budget' button.`}
      />
    </div>
  );
};
export default BudgetsNotFoundMessage;
