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
import { useRouter } from "@/navigation";
import { CategoryType } from "@/typings/categories";
import { useTranslations } from "next-intl";

type CategoryCardProps = {
  category: CategorySelectModel;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const t = useTranslations("Components.CategoryCard");
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
      dialogTitle: t("editCategoryDialogTitle"),
      dialogDescription: t("editCategoryDialogMessage"),
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
      title: t("deleteCategoryDialogTitle"),
      message: t("deleteCategoryDialogMessage", { formattedCategoryType }),
      primaryActionLabel: t("deleteCategoryDialogPrimaryActionLabel"),
      onConfirm: () => {
        startTransition(async () => {
          const response = await deleteCategory({
            id: category.id,
            type: category.type as CategoryType,
          });
          if (!response) {
            toast.error(t("deleteCategoryAnErrorOccurred"));
          }

          toast.success(t("deleteCategorySuccess"));
          router.refresh();
        });
      },
    });
  };

  return (
    <motion.article
      layoutId={`${category.id}-category-card`}
      className="border-1 relative flex flex-col gap-2 rounded-md border bg-card p-4 shadow-sm"
    >
      <ActionPopover
        heading={t("categoryActions.heading")}
        positionAbsolute
        options={[
          {
            icon: FaEdit,
            label: t("categoryActions.edit"),
            onClick: handleEditCategory,
          },
          {
            icon: FaTrash,
            label: t("categoryActions.delete"),
            onClick: handleDeleteCategory,
          },
        ]}
      />
      <h3 className="mb-2 font-medium text-primary">
        <span className="text-muted-foreground">
          {t("categoryNameDataLabel")}:{" "}
        </span>
        {category.name}
      </h3>
      <p>
        <span className="font-medium text-muted-foreground">
          {t("categoryTypeDataLabel")}:{" "}
        </span>
        <span className="font-medium text-foreground/80">
          {formattedCategoryType}
        </span>
      </p>
    </motion.article>
  );
};

export default CategoryCard;
