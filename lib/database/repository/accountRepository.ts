import { getPageSizeAndSkipAmount } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import {
  AccountInsertModel,
  accounts,
  AccountSelectModel,
  transactions,
} from "@/lib/database/schema";
import { and, eq, getTableColumns, like, sql } from "drizzle-orm";

type GetMultipleAccountsParams = {
  userId: string;
  query?: string;
  category?: AccountSelectModel["category"];
  sortBy?: string;
  sortDirection?: string;
  page: number;
};

const accountRepository = {
  async create(accountDto: AccountInsertModel, withReturning?: true) {
    try {
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
    } catch (error) {
      console.error("Error creating account.", error);
      return {
        affectedRows: 0,
        insertId: 0,
        account: null,
      };
    }
  },
  async update(accountId: number, data: Partial<AccountInsertModel>) {
    try {
      const [updateResult] = await db
        .update(accounts)
        .set(data)
        .where(eq(accounts.id, accountId));

      const updatedRow = await this.getById(accountId);

      return {
        affectedRows: updateResult.affectedRows,
        updatedAccount: updatedRow,
      };
    } catch (error) {
      console.error("Error updating account.", error);
      return {
        affectedRows: 0,
        updatedAccount: null,
      };
    }
  },
  async getMultiple({
    userId,
    query,
    category,
    sortBy,
    sortDirection,
    page,
  }: GetMultipleAccountsParams) {
    const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);

    const categoryCondition = category
      ? eq(accounts.category, category)
      : undefined;

    const accountsQuery = db.query.accounts.findMany({
      with: {
        transactions: {
          limit: 10,
        },
      },
      where(fields, operators) {
        const { eq, like, and } = operators;
        return and(
          eq(fields.userId, userId),
          like(fields.name, `%${query}%`),
          categoryCondition
        );
      },
      orderBy(fields, operators) {
        const { desc, asc } = operators;
        const orderByCondition =
          sortBy && sortDirection
            ? sortDirection.toUpperCase() === "DESC"
              ? desc(fields.balance)
              : asc(fields.balance)
            : fields.balance;

        return orderByCondition;
      },
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
          categoryCondition
        )
      );

    try {
      const [userBankAccounts, [totalCount]] = await Promise.all([
        accountsQuery,
        accountCountQuery,
      ]);

      return {
        accounts: userBankAccounts,
        totalCount: totalCount.count,
      };
    } catch (e) {
      console.error("Error fetching accounts", e);
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
      console.error("Error deleting account", e);
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
      console.error("Error fetching account by id", error);
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
      console.error("Error fetching accounts by user id", error);
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
      console.error("Error checking if user has account", error);
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
      console.error("Error getting account balance", e);
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
      console.error(
        "Error fetching accounts with transactions by user id",
        error
      );
      return [];
    }
  },
};

export default accountRepository;
