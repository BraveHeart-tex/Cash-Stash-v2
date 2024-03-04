import { createId } from "@paralleldrive/cuid2";
import { TransactionSchemaType } from "@/schemas/transaction-schema";
import { TransactionCategory } from "@/entities/transaction";

export interface TransactionDto {
  id: string;
  userId: string;
  amount: number;
  category: TransactionCategory;
  description: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createTransactionDto = (
  validatedData: TransactionSchemaType,
  userId: string
): TransactionDto => {
  return {
    id: createId(),
    category: validatedData.category,
    userId: userId,
    amount: validatedData.amount,
    description: validatedData.description,
    accountId: validatedData.accountId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
