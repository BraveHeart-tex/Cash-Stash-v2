import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";

type BudgetsNotFoundMessageProps = {
  pageHasParams: boolean;
};

const BudgetsNotFoundMessage = ({
  pageHasParams,
}: BudgetsNotFoundMessageProps) => {
  const headingVariants: { [key: number]: string } = {
    0: "You don't have any budgets created yet.",
    1: "No budgets were found for your search",
  };

  const message = `${pageHasParams ? "Remove existing filters or " : ""} Create a budget by clicking the 'Create a budget' button.`;

  return (
    <div className="w-full pt-6">
      <GenericNotFoundBlock
        heading={headingVariants[Number(pageHasParams)]}
        message={message}
      />
    </div>
  );
};
export default BudgetsNotFoundMessage;
