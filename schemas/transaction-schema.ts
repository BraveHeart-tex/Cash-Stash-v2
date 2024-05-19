import { z } from "zod";

type TransactionMessageConfig = {
  amountRequiredErrorMessage: string;
  amountInvalidErrorMessage: string;
  descriptionRequiredErrorMessage: string;
  descriptionTooLongErrorMessage: string;
  categoryRequiredErrorMessage: string;
  accountRequiredErrorMessage: string;
};

export const getTransactionSchema = (
  messageConfig: TransactionMessageConfig
) => {
  const {
    amountRequiredErrorMessage,
    amountInvalidErrorMessage,
    descriptionRequiredErrorMessage,
    descriptionTooLongErrorMessage,
    categoryRequiredErrorMessage,
    accountRequiredErrorMessage,
  } = messageConfig;
  return z.object({
    amount: z.number({
      required_error: amountRequiredErrorMessage,
      invalid_type_error: amountInvalidErrorMessage,
    }),
    description: z
      .string()
      .min(1, descriptionRequiredErrorMessage)
      .max(100, descriptionTooLongErrorMessage),
    categoryId: z.coerce
      .number({
        required_error: categoryRequiredErrorMessage,
        invalid_type_error: categoryRequiredErrorMessage,
      })
      .min(1, categoryRequiredErrorMessage)
      .positive({
        message: categoryRequiredErrorMessage,
      })
      .default(0),
    accountId: z.coerce
      .number({
        required_error: accountRequiredErrorMessage,
        invalid_type_error: accountRequiredErrorMessage,
      })
      .positive({ message: accountRequiredErrorMessage })
      .default(0),
  });
};

export type TransactionSchemaType = z.infer<
  ReturnType<typeof getTransactionSchema>
>;
