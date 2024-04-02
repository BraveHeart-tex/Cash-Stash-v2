import { AccountSchemaType } from "@/schemas/account-schema";
import { AccountCategory } from "@/entities/account";

import { AccountInsertModel } from "@/lib/database/schema";

export interface AccountDto {
  id: string;
  name: string;
  balance: number;
  category: AccountCategory;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

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
