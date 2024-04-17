import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";

const TransactionsNotFoundMessage = ({
  pageHasParams,
}: {
  pageHasParams: boolean;
}) => {
  const headingVariants: { [key: number]: string } = {
    0: "You don't have any transactions created yet.",
    1: "No transactions were found for your search",
  };

  const message = `${pageHasParams ? "Remove existing filters or " : ""} Create a transaction by clicking the 'Create a transaction' button.`;

  return (
    <div className="pt-6 w-full">
      <GenericNotFoundBlock
        heading={headingVariants[Number(pageHasParams)]}
        message={message}
      />
    </div>
  );
};
export default TransactionsNotFoundMessage;
