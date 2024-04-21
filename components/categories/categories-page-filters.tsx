import RouteSearchInput from "@/components/route-search-input";

const CategoriesPageFilters = () => {
  return (
    <div className="flex items-center justify-between gap-2">
      <RouteSearchInput label="Search" placeholder="Search goals by name" />
    </div>
  );
};

export default CategoriesPageFilters;
