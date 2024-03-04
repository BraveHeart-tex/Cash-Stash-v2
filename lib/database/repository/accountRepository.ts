import {
  ModifyQuery,
  ModifyQueryWithSelect,
  SelectQuery,
} from "@/lib/database/queryUtils";
import { Account } from "@/entities/account";
import { AccountCategory } from "@prisma/client";
import { getPageSizeAndSkipAmount } from "@/lib/utils";
import { AccountDto } from "@/lib/database/dto/accountDto";

interface IGetMultipleAccountsParams {
  userId: string;
  query?: string;
  category?: AccountCategory;
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

  let accountsQuery =
    "SELECT * FROM Account where userId = :userId and name like :query";
  let totalCountQuery =
    "SELECT COUNT(*) as totalCount FROM Account where userId = :userId and name like :query";

  let accountsQueryParams: {
    userId: string;
    query: string;
    category?: AccountCategory;
    limit?: number;
    offset?: number;
  } = {
    userId: userId,
    query: `%${query}%`,
  };

  let totalCountQueryParams: {
    userId: string;
    query: string;
    category?: AccountCategory;
  } = {
    userId: userId,
    query: `%${query}%`,
  };

  if (category) {
    accountsQuery += ` and category = :category`;
    totalCountQuery += ` and category = :category`;
    accountsQueryParams.category = category;
    totalCountQueryParams.category = category;
  }

  if (sortBy && sortDirection) {
    const validSortDirection =
      sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    accountsQuery += ` ORDER BY balance ${validSortDirection}`;
  }

  accountsQuery += ` LIMIT :limit OFFSET :offset`;
  accountsQueryParams.limit = pageSize;
  accountsQueryParams.offset = skipAmount;

  try {
    const [accounts, totalCount] = await Promise.all([
      SelectQuery<Account>(accountsQuery, accountsQueryParams),
      SelectQuery<{
        totalCount: number;
      }>(totalCountQuery, totalCountQueryParams),
    ]);

    return {
      accounts,
      totalCount: totalCount[0].totalCount as number,
    };
  } catch (e) {
    console.error("Error fetching accounts", e);
    return {
      accounts: [],
      totalCount: 0,
    };
  }
};

const create = async (accountDto: AccountDto) => {
  try {
    const createdAccount = await ModifyQuery(
      "INSERT INTO Account (id, name, balance, category, userId, createdAt, updatedAt) values (:id, :name, :balance, :category, :userId, :createdAt, :updatedAt);",
      accountDto
    );

    return createdAccount.affectedRows;
  } catch (error) {
    console.error("Error creating account.", error);
    return 0;
  }
};

const update = async (accountDto: Partial<AccountDto>) => {
  try {
    const updateResult = await ModifyQueryWithSelect<Account>(
      "UPDATE Account set name = :name, balance = :balance, category = :category, updatedAt = :updatedAt where id = :id; SELECT * from Account where id = :id;",
      accountDto
    );

    return {
      affectedRows: updateResult.affectedRows,
      updatedAccount: updateResult.updatedRow,
    };
  } catch (error) {
    console.error("Error updating account.", error);
    return {
      affectedRows: 0,
      updatedAccount: null,
    };
  }
};

const deleteById = async (accountId: string) => {
  try {
    const deletedAccount = await ModifyQuery(
      "DELETE FROM Account WHERE id = :id",
      {
        id: accountId,
      }
    );

    return deletedAccount.affectedRows;
  } catch (e) {
    console.error("Error deleting account", e);
    return 0;
  }
};

const getByUserId = async (userId: string) => {
  try {
    const accounts = await SelectQuery<Account>(
      "SELECT * FROM Account WHERE userId = :userId",
      {
        userId,
      }
    );

    return accounts;
  } catch (error) {
    console.error("Error fetching accounts by user id", error);
    return [];
  }
};

const checkIfUserHasAccount = async (userId: string) => {
  try {
    const accounts = await SelectQuery<Account>(
      "SELECT id FROM Account WHERE userId = :userId limit 1",
      {
        userId,
      }
    );

    return accounts.length > 0;
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
  getByUserId,
  checkIfUserHasAccount,
};

export default accountRepository;
