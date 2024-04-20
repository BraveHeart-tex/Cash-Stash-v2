import CreateCategoryButton from "../create-buttons/create-category-button";

const CategoriesPageHeader = () => {
  return (
    <header className="w-full flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
          Categories
        </h1>
        <CreateCategoryButton />
      </div>
      <p className="text-muted-foreground">
        Create custom categories to group your transactions and budgets.
      </p>
    </header>
  );
};

export default CategoriesPageHeader;
