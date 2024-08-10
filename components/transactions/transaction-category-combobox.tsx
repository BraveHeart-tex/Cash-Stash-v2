"use client";
import QueryStringComboBox from "@/components/query-string-combobox";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { CategorySelectModel } from "@/lib/database/schema";
import useCategoriesStore from "@/store/categoriesStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type TransactionCategoryComboboxProps = {
  initialTransactionCategories: CategorySelectModel[];
};

const TransactionCategoryCombobox = ({
  initialTransactionCategories,
}: TransactionCategoryComboboxProps) => {
  const t = useTranslations("Components.TransactionCategoryCombobox");
  const budgetOptions = useCategoriesStore((state) => state.categories).filter(
    (category) => category.type === CATEGORY_TYPES.TRANSACTION,
  );
  const setCategories = useCategoriesStore((state) => state.setCategories);

  useEffect(() => {
    setCategories(initialTransactionCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTransactionCategories]);

  return (
    <QueryStringComboBox
      dataset={budgetOptions.map((option) => ({
        label: option.name,
        value: option.id.toString(),
      }))}
      queryStringKey="categoryId"
      selectLabel={t("label")}
    />
  );
};
export default TransactionCategoryCombobox;
