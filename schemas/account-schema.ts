import { accounts } from "@/lib/database/schema";
import { z } from "zod";

type MessageConfig = {
  balanceErrorMessage: string;
  categoryRequiredErrorMessage: string;
  categoryInvalidTypeError: string;
  nameErrorMessage: string;
};

export const getAccountSchema = (messageConfig: MessageConfig) => {
  const {
    balanceErrorMessage,
    categoryRequiredErrorMessage,
    categoryInvalidTypeError,
    nameErrorMessage,
  } = messageConfig;

  return z.object({
    balance: z.coerce
      .number({
        invalid_type_error: balanceErrorMessage,
        required_error: balanceErrorMessage,
      })
      .transform((val) => (isNaN(val) ? 0 : val))
      .default(0),
    category: z
      .enum(accounts.category.enumValues, {
        required_error: categoryRequiredErrorMessage,
        invalid_type_error: categoryInvalidTypeError,
      })
      .superRefine((val, ctx) => {
        if (!val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: categoryRequiredErrorMessage,
            path: ["category"],
          });
        }
      }),
    name: z.string().min(1, nameErrorMessage),
  });
};

export type AccountSchemaType = z.infer<ReturnType<typeof getAccountSchema>>;
