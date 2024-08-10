import { CATEGORY_TYPES } from "@/lib/constants";
import { z } from "zod";

type CategorySchemaMessageConfig = {
  nameRequiredErrorMessage: string;
  nameTooLongErrorMessage: string;
  invalidCategoryTypeErrorMessage: string;
};

export const getCategorySchema = (
  messageConfig: CategorySchemaMessageConfig,
) => {
  const {
    nameRequiredErrorMessage,
    nameTooLongErrorMessage,
    invalidCategoryTypeErrorMessage,
  } = messageConfig;
  return z.object({
    name: z
      .string()
      .min(1, nameRequiredErrorMessage)
      .max(50, nameTooLongErrorMessage),
    type: z.coerce
      .number()
      .min(CATEGORY_TYPES.TRANSACTION, invalidCategoryTypeErrorMessage)
      .max(CATEGORY_TYPES.BUDGET, invalidCategoryTypeErrorMessage)
      .default(CATEGORY_TYPES.TRANSACTION),
  });
};

export type CategorySchemaType = z.infer<ReturnType<typeof getCategorySchema>>;
