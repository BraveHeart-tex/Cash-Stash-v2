"use client";

import { CATEGORY_TYPES } from "@/lib/constants";
import { CategorySelectModel } from "@/lib/database/schema";
import { motion } from "framer-motion";

type CategoryCardProps = {
  category: CategorySelectModel;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const categoryTypeKeys = Object.keys(
    CATEGORY_TYPES
  ) as (keyof typeof CATEGORY_TYPES)[];

  let formattedCategoryType = categoryTypeKeys
    .find((key) => CATEGORY_TYPES[key] === category.type)
    ?.toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <motion.article
      layoutId={`${category.id}-category-card`}
      className={
        "flex flex-col gap-2 p-4 shadow-sm border-1 rounded-md relative bg-card border"
      }
    >
      <h3 className="font-semibold mb-2 text-primary">
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
