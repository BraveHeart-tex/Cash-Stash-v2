import { AccountSchemaType } from "@/schemas/account-schema";
import { AccountInsertModel } from "@/lib/database/schema";

export const createAccountDto = (
  validatedData: AccountSchemaType,
  userId: string
): AccountInsertModel => {
  return {
    name: validatedData.name,
    balance: validatedData.balance,
    category: validatedData.category,
    userId: userId,
  };
};
