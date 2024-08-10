import { getPageSizeAndSkipAmount } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import {
  type AccountInsertModel,
  type AccountSelectModel,
  accounts,
  transactions,
} from "@/lib/database/schema";
import logger from "@/lib/utils/logger";
import type { AccountWithTransactions } from "@/typings/accounts";
import { and, asc, desc, eq, getTableColumns, like, sql } from "drizzle-orm";

type GetMultipleAccountsParams = {
  userId: string;
  query?: string;
  category?: AccountSelectModel["category"];
  sortBy?: string;
  sortDirection?: string;
  page: number;
};

type GetMultipleAccountsReturnType = {
  accounts: AccountWithTransactions[];
  totalCount: number;
};

const accountRepository = {
  async create(accountDto: AccountInsertModel, withReturning?: true) {
    const [result] = await db.insert(accounts).values(accountDto);

    if (withReturning && result.affectedRows) {
      const account = await this.getById(result.insertId);
      return {
        affectedRows: result.affectedRows,
        insertId: result.insertId,
        account,
      };
    }

    return {
      affectedRows: result.affectedRows,
      insertId: result.insertId,
      account: null,
    };
  },
  async update(accountId: number, data: Partial<AccountInsertModel>) {
    const [updateResult] = await db
      .update(accounts)
      .set(data)
      .where(eq(accounts.id, accountId));

    const updatedRow = await this.getById(accountId);

    return {
      affectedRows: updateResult.affectedRows,
      updatedAccount: updatedRow,
    };
  },
  async getMultiple({
    userId,
    query,
    category,
    sortBy,
    sortDirection,
    page,
  }: GetMultipleAccountsParams): Promise<GetMultipleAccountsReturnType> {
    const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);

    const categoryCondition = category
      ? eq(accounts.category, category)
      : undefined;

    const orderByCondition =
      sortBy && sortDirection
        ? sortDirection.toUpperCase() === "DESC"
          ? desc(accounts.balance)
          : asc(accounts.balance)
        : accounts.balance;

    const accountsQuery = db.query.accounts.findMany({
      with: {
        transactions: {
          limit: 10,
          with: {
            account: {
              columns: {
                name: true,
              },
            },
            category: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      where: and(
        eq(accounts.userId, userId),
        like(accounts.name, `%${query}%`),
        categoryCondition,
      ),
      orderBy: orderByCondition,
      limit: pageSize,
      offset: skipAmount,
    });

    const accountCountQuery = db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, userId),
          like(accounts.name, `%${query}%`),
          categoryCondition,
        ),
      );

    try {
      const [userBankAccounts, [totalCount]] = await Promise.all([
        accountsQuery,
        accountCountQuery,
      ]);

      const mappedUserBankAccounts = userBankAccounts.map((account) => ({
        ...account,
        transactions: account.transactions.map((transaction) => ({
          ...transaction,
          category: transaction?.category?.name,
          accountName: transaction?.account?.name,
        })),
      }));

      return {
        accounts: mappedUserBankAccounts,
        totalCount: totalCount.count,
      };
    } catch (e) {
      logger.error("Error fetching accounts", e);
      return {
        accounts: [],
        totalCount: 0,
      };
    }
  },
  async deleteById(accountId: number) {
    try {
      const [result] = await db
        .delete(accounts)
        .where(eq(accounts.id, accountId));

      return result.affectedRows;
    } catch (e) {
      logger.error("Error deleting account", e);
      return 0;
    }
  },
  async getById(accountId: number) {
    try {
      const [account] = await db
        .select()
        .from(accounts)
        .where(eq(accounts.id, accountId));
      return account;
    } catch (error) {
      logger.error("Error fetching account by id", error);
      return null;
    }
  },
  async getByUserId(userId: string) {
    try {
      return await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, userId));
    } catch (error) {
      logger.error("Error fetching accounts by user id", error);
      return [];
    }
  },
  async checkIfUserHasAccount(userId: string) {
    try {
      const userAccounts = await db
        .select({
          id: accounts.id,
        })
        .from(accounts)
        .where(eq(accounts.userId, userId));

      return userAccounts.length > 0;
    } catch (error) {
      logger.error("Error checking if user has account", error);
      return false;
    }
  },

  async getAccountBalance(accountId: number) {
    try {
      const [account] = await db
        .select({
          balance: accounts.balance,
        })
        .from(accounts)
        .where(eq(accounts.id, accountId));

      return account?.balance ?? 0;
    } catch (e) {
      logger.error("Error getting account balance", e);
      return 0;
    }
  },
  async getAccountsThatHaveTransactions(userId: string) {
    try {
      return await db
        .selectDistinct({
          ...getTableColumns(accounts),
        })
        .from(accounts)
        .innerJoin(transactions, eq(accounts.id, transactions.accountId))
        .where(eq(accounts.userId, userId));
    } catch (error) {
      logger.error(
        "Error fetching accounts with transactions by user id",
        error,
      );
      return [];
    }
  },
};

export default accountRepository;
