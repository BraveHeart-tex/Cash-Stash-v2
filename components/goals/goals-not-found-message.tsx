import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";

type GoalsNotFoundMessageProps = {
  pageHasParams: boolean;
};

const GoalsNotFoundMessage = ({ pageHasParams }: GoalsNotFoundMessageProps) => {
  const headingVariants: { [key: number]: string } = {
    0: "You don't have any goals created yet.",
    1: "No goals were found for your search",
  };

  const message = `${pageHasParams ? "Remove existing filters or " : ""} Create a goal by clicking the 'Create a goal' button.`;

  return (
    <div className="w-full pt-6">
      <GenericNotFoundBlock
        heading={headingVariants[Number(pageHasParams)]}
        message={message}
      />
    </div>
  );
};
export default GoalsNotFoundMessage;
