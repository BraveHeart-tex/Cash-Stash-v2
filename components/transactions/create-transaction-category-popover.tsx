"use client";
import { CategorySelectModel } from "@/lib/database/schema";
import useCategoriesStore from "@/store/categoriesStore";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import CategoryForm from "@/components/categories/category-form";
import { CATEGORY_TYPES } from "@/lib/constants";

type CreateTransactionCategoryPopoverProps = {
  // eslint-disable-next-line no-unused-vars
  onSave: (values: CategorySelectModel) => void;
};

const CreateTransactionCategoryPopover = ({
  onSave,
}: CreateTransactionCategoryPopoverProps) => {
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
            <h4 className="font-medium leading-none">
              Add Transaction Category
            </h4>
            <p className="text-sm text-muted-foreground">
              Add a new transaction category by using the form below.
            </p>
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
