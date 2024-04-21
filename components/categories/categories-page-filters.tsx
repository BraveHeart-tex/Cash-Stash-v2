import RouteSearchInput from "@/components/route-search-input";
import QueryStringComboBox from "@/components/query-string-combobox";
import { CATEGORY_TYPES } from "@/lib/constants";

const CategoriesPageFilters = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <RouteSearchInput label="Search" placeholder="Search goals by name" />
      <QueryStringComboBox
        queryStringKey="type"
        dataset={[
          {
            label: "Budget",
            value: CATEGORY_TYPES.BUDGET.toString(),
          },
          {
            label: "Transaction",
            value: CATEGORY_TYPES.TRANSACTION.toString(),
          },
        ]}
        renderAsSelect
        selectLabel="Category Type"
      />
    </div>
  );
};

export default CategoriesPageFilters;
