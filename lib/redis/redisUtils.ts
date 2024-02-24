import { redis } from ".";
import { CACHE_PREFIXES } from "@/lib/constants";
import { Budget, BudgetCategory } from "@prisma/client";

interface Entity {
  [key: string]: any;
}

const mapRedisHashToEntity = <T extends Entity>(
  hash: Record<string, string> | null,
  mappingConfig: { [K in keyof T]: (value: string) => T[K] }
): T | null => {
  if (!hash) {
    return null;
  }

  const mappedEntity: Partial<T> = {};
  for (const [field, mapper] of Object.entries(mappingConfig)) {
    if (hash[field] !== undefined) {
      mappedEntity[field as keyof T] = mapper(hash[field]);
    }
  }

  return mappedEntity as T;
};

export const getAccountKey = (accountId: string) =>
  `${CACHE_PREFIXES.ACCOUNT}:${accountId}`;

export const getTransactionKey = (transactionId: string) => {
  return `${CACHE_PREFIXES.TRANSACTION}:${transactionId}`;
};

export const getBudgetKey = (budgetId: string) => {
  return `${CACHE_PREFIXES.BUDGET}:${budgetId}`;
};

export const getPaginatedAccountsKey = ({
  userId,
  pageNumber = 1,
  query = "",
  category = "",
  sortBy = "",
  sortDirection = "",
  orderByCondition = "",
}: {
  userId: string;
  pageNumber?: number;
  query?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: string;
  orderByCondition?: string;
}) => {
  return (
    CACHE_PREFIXES.PAGINATED_ACCOUNTS +
    JSON.stringify({
      userId,
      pageNumber,
      query,
      category,
      sortBy,
      sortDirection,
      orderByCondition,
    })
  );
};

export const getPaginatedBudgetsKey = ({
  userId,
  pageNumber = 1,
  query = "",
  category = "",
  sortBy = "",
  sortDirection = "",
}: {
  userId: string;
  pageNumber?: number;
  query?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: string;
  orderByCondition?: string;
}) => {
  return (
    CACHE_PREFIXES.PAGINATED_BUDGETS +
    JSON.stringify({
      userId,
      pageNumber,
      query,
      category,
      sortBy,
      sortDirection,
    })
  );
};

export const invalidateCacheKey = async (key: string) => {
  await redis.del(key);
};

export const invalidateKeysByPrefix = async (prefix: string) => {
  const keys = await redis.keys("*");
  const keysToDelete = keys.filter((key) => key.startsWith(prefix));
  await redis.del(keysToDelete);
};

export const mapRedisHashToBudget = (
  budgetFromCache: Record<string, string> | null
): Budget | null => {
  const mappingConfig = {
    id: (value: string) => value,
    name: (value: string) => value,
    budgetAmount: (value: string) => Number(value),
    spentAmount: (value: string) => Number(value),
    userId: (value: string) => value,
    progress: (value: string) => Number(value),
    category: (value: string) => value as BudgetCategory,
    createdAt: (value: string) => new Date(value),
    updatedAt: (value: string) => new Date(value),
  };

  return mapRedisHashToEntity<Budget>(budgetFromCache, mappingConfig);
};
