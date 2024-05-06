"use client";
import { CategorySelectModel } from "@/lib/database/schema";
import useCategoriesStore from "@/store/categoriesStore";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CategoryForm from "@/components/categories/category-form";
import { CATEGORY_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { useTranslations } from "next-intl";

type CreateBudgetCategoryPopoverProps = {
  // eslint-disable-next-line no-unused-vars
  onSave: (values: CategorySelectModel) => void;
};

const CreateBudgetCategoryPopover = ({
  onSave,
}: CreateBudgetCategoryPopoverProps) => {
  const t = useTranslations("Components.CreateBudgetCategoryPopover");
  const [open, setOpen] = useState(false);
  const addCategory = useCategoriesStore((state) => state.addCategory);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" size="icon">
          <FaPlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[500]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t("title")}</h4>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <CategoryForm
            showTypeOptions={false}
            afterSave={(values) => {
              setOpen(false);
              addCategory(values);
              onSave(values);
            }}
            defaultTypeValue={CATEGORY_TYPES.BUDGET}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBudgetCategoryPopover;
