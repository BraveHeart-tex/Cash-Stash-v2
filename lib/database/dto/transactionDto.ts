import { TransactionSchemaType } from "@/schemas/transaction-schema";
import { TransactionInsertModel } from "@/lib/database/schema";

export const createTransactionDto = (
  validatedData: TransactionSchemaType,
  userId: string
): TransactionInsertModel => {
  return {
    categoryId: validatedData.categoryId,
    userId: userId,
    amount: validatedData.amount,
    description: validatedData.description,
    accountId: validatedData.accountId,
    updatedAt: new Date().toISOString(),
  };
};
