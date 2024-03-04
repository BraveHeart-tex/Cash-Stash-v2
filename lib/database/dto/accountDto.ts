import { createId } from "@paralleldrive/cuid2";
import { AccountSchemaType } from "@/schemas/account-schema";
import { AccountCategory } from "@/entities/account";

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
): AccountDto => {
  return {
    id: createId(),
    name: validatedData.name,
    balance: validatedData.balance,
    category: validatedData.category,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
