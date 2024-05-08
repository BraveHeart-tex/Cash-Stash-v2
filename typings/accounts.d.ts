import { AccountSelectModel } from "@/lib/database/schema";
import { AccountSchemaType } from "@/schemas/account-schema";
import {
  BasePaginatedActionParams,
  BaseValidatedResponse,
} from "@/typings/baseTypes";
import { TransactionWithCategoryAndAccountName } from "@/typings/transactions";

export type RegisterBankAccountReturnType = Promise<
  BaseValidatedResponse<AccountSelectModel>
>;

export type UpdateBankAccountReturnType = Promise<
  BaseValidatedResponse<AccountSelectModel>
>;

export type GetPaginatedAccountsReturnType = Promise<
  BasePaginatedResponse & {
    accounts: AccountWithTransactions[];
  }
>;

export type GetPaginatedAccountsParams = BasePaginatedActionParams & {
  sortBy?: string;
  sortDirection?: string;
  category?: AccountSelectModel["category"];
};

export type UpdateBankAccountParams = AccountSchemaType & { accountId: number };

export type AccountWithTransactions = AccountSelectModel & {
  transactions: TransactionWithCategoryAndAccountName[];
};
