import { getPageSizeAndSkipAmount } from "@/lib/utils";
import { db } from "@/lib/database/connection";
import { accounts } from "@/lib/database/schema";
import {
  and,
  asc,
  desc,
  eq,
  InferInsertModel,
  InferSelectModel,
  like,
  sql,
} from "drizzle-orm";

export type AccountInsertModel = InferInsertModel<typeof accounts>;
export type AccountSelectModel = InferSelectModel<typeof accounts>;

interface IGetMultipleAccountsParams {
  userId: string;
  query?: string;
  category?: AccountSelectModel["category"];
  sortBy?: string;
  sortDirection?: string;
  page: number;
}

const getMultiple = async ({
  userId,
  query,
  category,
  sortBy,
  sortDirection,
  page,
}: IGetMultipleAccountsParams) => {
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

  const accountsQuery = db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, userId),
        like(accounts.name, `%${query}%`),
        categoryCondition
      )
    )
    .orderBy(orderByCondition)
    .limit(pageSize)
    .offset(skipAmount);

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
};

const create = async (accountDto: AccountInsertModel, withReturning?: true) => {
  try {
    const [result] = await db.insert(accounts).values(accountDto);

    if (withReturning && result.affectedRows) {
      const account = await getBankAccountById(result.insertId);
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
};

const update = async (accountId: number, data: Partial<AccountInsertModel>) => {
  try {
    const [updateResult] = await db
      .update(accounts)
      .set(data)
      .where(eq(accounts.id, accountId));

    const updatedRow = await getBankAccountById(accountId);

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
};

const deleteById = async (accountId: number) => {
  try {
    const [result] = await db
      .delete(accounts)
      .where(eq(accounts.id, accountId));

    return result.affectedRows;
  } catch (e) {
    console.error("Error deleting account", e);
    return 0;
  }
};

const getBankAccountById = async (accountId: number) => {
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
};

const getBankAccountsByUserId = async (userId: string) => {
  try {
    return await db.select().from(accounts).where(eq(accounts.userId, userId));
  } catch (error) {
    console.error("Error fetching accounts by user id", error);
    return [];
  }
};

const checkIfUserHasBankAccount = async (userId: string) => {
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
};

const accountRepository = {
  create,
  update,
  getMultiple,
  deleteById,
  getByUserId: getBankAccountsByUserId,
  checkIfUserHasAccount: checkIfUserHasBankAccount,
};

export default accountRepository;
