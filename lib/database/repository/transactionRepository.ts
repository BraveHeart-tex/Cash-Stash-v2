import {
  accounts,
  AccountSelectModel,
  categories,
  TransactionInsertModel,
  transactions,
  TransactionSelectModel,
} from "@/lib/database/schema";
import { db } from "@/lib/database/connection";
import accountRepository from "@/lib/database/repository/accountRepository";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  like,
  lt,
  sql,
  getTableColumns,
} from "drizzle-orm";
import { getPageSizeAndSkipAmount } from "@/lib/constants";
import logger from "@/lib/utils/logger";

type CreateTransactionReturnType = {
  affectedRows: number;
  updatedAccount?: AccountSelectModel | null;
  createdTransaction?: TransactionSelectModel | null;
};

type GetMultipleTransactionsParams = {
  page: number;
  userId: string;
  query?: string;
  categoryId?: number;
  sortBy?: string;
  sortDirection?: string;
  transactionType?: string;
  accountId?: number;
};

const transactionRepository = {
  async getByAccountId(accountId: number) {
    try {
      return await db
        .select()
        .from(transactions)
        .where(eq(transactions.accountId, accountId))
        .limit(10)
        .orderBy(desc(transactions.createdAt));
    } catch (e) {
      logger.error("getByAccountId error", e);
      return [];
    }
  },
  async create(
    data: TransactionInsertModel
  ): Promise<CreateTransactionReturnType> {
    try {
      return await db.transaction(async (trx) => {
        const { amount, accountId } = data;
        const accountBalance =
          await accountRepository.getAccountBalance(accountId);

        const newBalance = accountBalance + amount;

        const [insertTransactionResponse] = await trx
          .insert(transactions)
          .values(data);

        if (!insertTransactionResponse.affectedRows) {
          await trx.rollback();
          return {
            affectedRows: 0,
            updatedAccount: null,
            createdTransaction: null,
          };
        }

        const { affectedRows, updatedAccount } = await accountRepository.update(
          accountId,
          {
            balance: newBalance,
          }
        );

        if (!affectedRows || !updatedAccount) {
          await trx.rollback();
          return {
            affectedRows: 0,
            updatedAccount: null,
            createdTransaction: null,
          };
        }

        const [createdTransaction] = await trx
          .select()
          .from(transactions)
          .where(eq(transactions.id, insertTransactionResponse.insertId));

        return {
          affectedRows,
          updatedAccount,
          createdTransaction,
        };
      });
    } catch (error) {
      logger.error("create transaction error", error);
      return {
        affectedRows: 0,
        updatedAccount: null,
        createdTransaction: null,
      };
    }
  },
  async update(
    oldAccountData: {
      oldAccountId: number;
      oldAmount: number;
      accountId: number;
      amount: number;
    },
    transactionDto: Partial<TransactionSelectModel> & { id: number }
  ) {
    try {
      return await db.transaction(async (trx) => {
        const [updateOldAccountResponse] = await trx
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} - ${oldAccountData.oldAmount}`,
          })
          .where(eq(accounts.id, oldAccountData.oldAccountId));

        if (!updateOldAccountResponse.affectedRows) {
          logger.error("Error updating old account", updateOldAccountResponse);
          trx.rollback();
          return {
            affectedRows: 0,
            updatedTransaction: null,
          };
        }

        const [updateNewAccountResponse] = await trx
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${oldAccountData.amount}`,
          })
          .where(eq(accounts.id, oldAccountData.accountId));

        if (!updateNewAccountResponse.affectedRows) {
          logger.error("Error updating new account", updateNewAccountResponse);
          trx.rollback();
          return {
            affectedRows: 0,
            updatedTransaction: null,
          };
        }

        const [updateTransactionResponse] = await trx
          .update(transactions)
          .set(transactionDto)
          .where(eq(transactions.id, transactionDto.id));

        if (!updateTransactionResponse.affectedRows) {
          logger.error("Error updating transaction");
          await trx.rollback();
          return {
            affectedRows: 0,
            updatedTransaction: null,
          };
        }

        const [updatedTransaction] = await trx
          .select()
          .from(transactions)
          .where(eq(transactions.id, transactionDto.id));

        return {
          affectedRows: updateTransactionResponse.affectedRows,
          updatedTransaction,
        };
      });
    } catch (error) {
      logger.error("Error updating transaction", error);
      return {
        affectedRows: 0,
        updatedTransaction: null,
      };
    }
  },
  async deleteById(transaction: TransactionSelectModel) {
    try {
      return await db.transaction(async (trx) => {
        const [deleteTransactionResult] = await db
          .delete(transactions)
          .where(eq(transactions.id, transaction.id));

        if (!deleteTransactionResult.affectedRows) {
          await trx.rollback();
          return {
            affectedRows: 0,
          };
        }

        const [updateAccountResult] = await trx.update(accounts).set({
          balance: sql`${accounts.balance} - ${transaction.amount}`,
        });

        if (!updateAccountResult.affectedRows) {
          await trx.rollback();
          return {
            affectedRows: 0,
          };
        }

        return {
          affectedRows: deleteTransactionResult.affectedRows,
        };
      });
    } catch (error) {
      logger.error("Error getting account by id", error);
      return {
        affectedRows: 0,
      };
    }
  },
  async getMultiple({
    page,
    userId,
    query,
    categoryId,
    sortBy,
    sortDirection,
    transactionType,
    accountId,
  }: GetMultipleTransactionsParams) {
    const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);

    let transactionTypeCondition = undefined;
    let transactionOrderByCondition = desc(transactions.createdAt);

    if (sortBy && sortDirection) {
      const sortByOptions = ["createdAt", "amount"];
      const sortDirections = ["asc", "desc"];

      const validSortBy = sortByOptions.includes(sortBy) ? sortBy : "createdAt";
      const validSortDirection = sortDirections.includes(
        sortDirection.toLowerCase()
      )
        ? sortDirection
        : "desc";

      switch (validSortBy) {
        case "createdAt":
          transactionOrderByCondition =
            validSortDirection === "asc"
              ? asc(transactions.createdAt)
              : desc(transactions.createdAt);
          break;
        case "amount":
          transactionOrderByCondition =
            validSortDirection === "asc"
              ? asc(transactions.amount)
              : desc(transactions.amount);
          break;
        default:
          transactionOrderByCondition = desc(transactions.createdAt);
          break;
      }
    }

    if (transactionType === "income") {
      transactionTypeCondition = gt(transactions.amount, 0);
    }

    if (transactionType === "expense") {
      transactionTypeCondition = lt(transactions.amount, 0);
    }

    const transactionsQuery = db
      .select({
        ...getTableColumns(transactions),
        accountName: accounts.name,
        category: categories.name,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.categoryId, categoryId || transactions.categoryId),
          eq(transactions.accountId, accountId || transactions.accountId),
          like(transactions.description, `%${query}%`),
          transactionTypeCondition
        )
      )
      .orderBy(transactionOrderByCondition)
      .limit(pageSize)
      .offset(skipAmount);

    const transactionsCountQuery = db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.accountId, accountId || transactions.accountId),
          eq(transactions.categoryId, categoryId || transactions.categoryId),
          like(transactions.description, `%${query}%`),
          transactionTypeCondition
        )
      );

    try {
      const [transactions, [totalCountResponse]] = await Promise.all([
        transactionsQuery,
        transactionsCountQuery,
      ]);

      const totalCount = totalCountResponse.count;

      return {
        transactions,
        totalCount,
      };
    } catch (error) {
      logger.error("Error getting transactions", error);
      return {
        transactions: [],
        totalCount: 0,
      };
    }
  },
};

export default transactionRepository;
