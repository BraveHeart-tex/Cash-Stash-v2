"use client";

import { CATEGORY_TYPES } from "@/lib/constants";
import { CategorySelectModel } from "@/lib/database/schema";
import { motion } from "framer-motion";
import ActionPopover from "@/components/action-popover";
import { FaEdit, FaTrash } from "react-icons/fa";
import useGenericModalStore from "@/store/genericModalStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { deleteCategory } from "@/server/category";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CategoryType } from "@/typings/categories";

type CategoryCardProps = {
  category: CategorySelectModel;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  let [, startTransition] = useTransition();
  const router = useRouter();
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const categoryTypeKeys = Object.keys(
    CATEGORY_TYPES
  ) as (keyof typeof CATEGORY_TYPES)[];

  let formattedCategoryType = categoryTypeKeys
    .find((key) => CATEGORY_TYPES[key] === category.type)
    ?.toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

  const handleEditCategory = () => {
    openGenericModal({
      dialogTitle: "Edit Category",
      dialogDescription:
        "Edit the category information by using the form below.",
      mode: "edit",
      key: "category",
      data: category,
      entityId: category.id,
      props: {
        afterSave: () => {
          router.refresh();
          closeGenericModal();
        },
      },
    });
  };

  const handleDeleteCategory = () => {
    showGenericConfirm({
      title: "Are you sure you want to delete this category?",
      message: `This action cannot be undone. If there are ${formattedCategoryType}s linked to this category, they will also be deleted.`,
      primaryActionLabel: "Delete",
      onConfirm: () => {
        startTransition(async () => {
          const response = await deleteCategory(
            category.id,
            category.type as CategoryType
          );
          if (!response) {
            toast.error(
              "A problem occurred while deleting the category. Please try again later."
            );
          }

          toast.success("Category deleted successfully.");
          router.refresh();
        });
      },
    });
  };

  return (
    <motion.article
      layoutId={`${category.id}-category-card`}
      className={
        "border-1 relative flex flex-col gap-2 rounded-md border bg-card p-4 shadow-sm"
      }
    >
      <ActionPopover
        heading="Category Actions"
        positionAbsolute
        options={[
          {
            icon: FaEdit,
            label: "Edit",
            onClick: handleEditCategory,
          },
          {
            icon: FaTrash,
            label: "Delete",
            onClick: handleDeleteCategory,
          },
        ]}
      />
      <h3 className="mb-2 font-semibold text-primary">
        <span className="text-muted-foreground">Category Name: </span>
        {category.name}
      </h3>
      <p>
        <span className="text-muted-foreground">Category Type:</span>{" "}
        {formattedCategoryType}
      </p>
    </motion.article>
  );
};

export default CategoryCard;
