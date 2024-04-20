import { CATEGORY_TYPES } from "@/lib/constants";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name is too long"),
  type: z.coerce
    .number()
    .min(CATEGORY_TYPES.TRANSACTION, "Invalid category type")
    .max(CATEGORY_TYPES.BUDGET, "Invalid category type")
    .default(CATEGORY_TYPES.TRANSACTION),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;

export default categorySchema;
