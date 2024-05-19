import RouteSearchInput from "@/components/route-search-input";
import QueryStringComboBox from "@/components/query-string-combobox";
import { CATEGORY_TYPES } from "@/lib/constants";
import { useTranslations } from "next-intl";

const CategoriesPageFilters = () => {
  const t = useTranslations("Categories.CategoriesPageFilters");

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <RouteSearchInput placeholder={t("routeSearchInputPlaceholder")} />
      <QueryStringComboBox
        queryStringKey="type"
        dataset={[
          {
            label: t("queryStringComboBox.budget"),
            value: CATEGORY_TYPES.BUDGET.toString(),
          },
          {
            label: t("queryStringComboBox.transaction"),
            value: CATEGORY_TYPES.TRANSACTION.toString(),
          },
        ]}
        renderAsSelect
        selectLabel={t("queryStringComboBox.label")}
      />
    </div>
  );
};

export default CategoriesPageFilters;
