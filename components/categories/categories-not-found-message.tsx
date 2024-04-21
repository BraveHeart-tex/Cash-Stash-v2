import GenericNotFoundBlock from "@/components/ui/generic-not-found-block";

type CategoriesNotFoundMessageProps = {
  pageHasParams?: boolean;
};

const CategoriesNotFoundMessage = ({
  pageHasParams = false,
}: CategoriesNotFoundMessageProps) => {
  const headingVariants: { [key: number]: string } = {
    0: "You don't have any categories created yet.",
    1: "No categories were found for your search",
  };

  const message = `${pageHasParams ? "Remove existing filters or " : ""} Create a categories by clicking the 'Create a category' button.`;

  return (
    <div className="pt-6 w-full">
      <GenericNotFoundBlock
        heading={headingVariants[Number(pageHasParams)]}
        message={message}
      />
    </div>
  );
};

export default CategoriesNotFoundMessage;
