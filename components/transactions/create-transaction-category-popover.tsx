"use client";
import CategoryForm from "@/components/categories/category-form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { CategorySelectModel } from "@/lib/database/schema";
import useCategoriesStore from "@/store/categoriesStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

type CreateTransactionCategoryPopoverProps = {
  onSave: (values: CategorySelectModel) => void;
};

const CreateTransactionCategoryPopover = ({
  onSave,
}: CreateTransactionCategoryPopoverProps) => {
  const t = useTranslations("Components.CreateTransactionCategoryPopover");
  const [open, setOpen] = useState(false);
  const addCategory = useCategoriesStore((state) => state.addCategory);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" size="icon" variant="outline">
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
            defaultTypeValue={CATEGORY_TYPES.TRANSACTION}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default CreateTransactionCategoryPopover;
