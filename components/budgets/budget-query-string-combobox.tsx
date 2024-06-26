"use client";
import useCategoriesStore from "@/store/categoriesStore";
import QueryStringComboBox from "@/components/query-string-combobox";
import { CATEGORY_TYPES } from "@/lib/constants";
import { useEffect } from "react";
import { CategorySelectModel } from "@/lib/database/schema";
import { useTranslations } from "next-intl";

type BudgetQueryStringComboboxProps = {
  initialBudgetCategories: CategorySelectModel[];
};

const BudgetQueryStringCombobox = ({
  initialBudgetCategories,
}: BudgetQueryStringComboboxProps) => {
  const t = useTranslations("Components.BudgetQueryStringCombobox");
  const budgetOptions = useCategoriesStore((state) => state.categories).filter(
    (category) => category.type === CATEGORY_TYPES.BUDGET
  );
  const setCategories = useCategoriesStore((state) => state.setCategories);

  useEffect(() => {
    setCategories(initialBudgetCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBudgetCategories]);

  return (
    <QueryStringComboBox
      dataset={budgetOptions.map((option) => ({
        label: option.name,
        value: option.name,
      }))}
      queryStringKey="category"
      selectLabel={t("label")}
    />
  );
};
export default BudgetQueryStringCombobox;
