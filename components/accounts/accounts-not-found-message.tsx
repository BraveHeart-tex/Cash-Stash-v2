import GenericNotFoundBlock from "../ui/generic-not-found-block";

type AccountsNotFoundMessageProps = {
  pageHasParams: boolean;
};

const AccountsNotFoundMessage = ({
  pageHasParams,
}: AccountsNotFoundMessageProps) => {
  const headingVariants: { [key: number]: string } = {
    0: "You don't have any budgets created yet.",
    1: "No budgets were found for your search",
  };

  const message = `${pageHasParams ? "Remove existing filters or " : ""} Create a budget by clicking the 'Create a budget' button.`;

  return (
    <div className="pt-6 w-full">
      <GenericNotFoundBlock
        heading={headingVariants[Number(pageHasParams)]}
        message={message}
      />
    </div>
  );
};

export default AccountsNotFoundMessage;
