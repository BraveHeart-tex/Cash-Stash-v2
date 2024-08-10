import { CACHE_PREFIXES } from "@/lib/constants";
import type { GoalSelectModel } from "@/lib/database/schema";
import redisService from "@/lib/redis/redisService";
import type { BudgetWithCategory } from "@/typings/budgets";

type Entity = {
  [key: string]: unknown;
};

type MappingConfig<T> = {
  [K in keyof T]: (value: string) => T[K];
};

const mapRedisHashToEntity = <T extends Entity>(
  hash: Record<string, string> | null,
  mappingConfig: MappingConfig<T>,
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

export const generateCachePrefixWithUserId = (
  prefix: string,
  userId: string,
) => {
  return `${prefix}:${userId}`;
};

export const getVerifyVerificationCodeRateLimitKey = (ipAddress: string) => {
  return `${CACHE_PREFIXES.VERIFY_VERIFICATION_CODE_RATE_LIMIT}:${ipAddress}`;
};

export const getSendVerificationCodeRateLimitKey = (ipAddress: string) => {
  return `${CACHE_PREFIXES.SEND_VERIFICATION_CODE_RATE_LIMIT}:${ipAddress}`;
};

export const getAccountKey = (accountId: number) =>
  `${CACHE_PREFIXES.ACCOUNT}:${accountId}`;

export const getTransactionKey = (transactionId: number) => {
  return `${CACHE_PREFIXES.TRANSACTION}:${transactionId}`;
};

export const getBudgetKey = (budgetId: number) => {
  return `${CACHE_PREFIXES.BUDGET}:${budgetId}`;
};

export const getGoalKey = (goalId: number) => {
  return `${CACHE_PREFIXES.GOAL}:${goalId}`;
};

export const getLoginRateLimitKey = (ipAddress: string) => {
  return `${CACHE_PREFIXES.LOGIN_RATE_LIMIT}:${ipAddress}`;
};

export const getSignUpRateLimitKey = (userId: string, ipAddress: string) => {
  return `${CACHE_PREFIXES.SIGN_UP_RATE_LIMIT}:${userId}:${ipAddress}`;
};

export const getAccountTransactionsKey = (accountId: number) => {
  return `${CACHE_PREFIXES.ACCOUNT_TRANSACTIONS}:${accountId}`;
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
    generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_ACCOUNTS, userId) +
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
  category = 0,
  sortBy = "",
  sortDirection = "",
}: {
  userId: string;
  pageNumber?: number;
  query?: string;
  category?: number;
  sortBy?: string;
  sortDirection?: string;
  orderByCondition?: string;
}) => {
  return (
    generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, userId) +
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

export const getPaginatedGoalsKeys = ({
  userId,
  pageNumber = 1,
  query = "",
  sortBy = "",
  sortDirection = "",
}: {
  userId: string;
  pageNumber?: number;
  query?: string;
  sortBy?: string;
  sortDirection?: string;
}) => {
  return (
    generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, userId) +
    JSON.stringify({
      userId,
      pageNumber,
      query,
      sortBy,
      sortDirection,
    })
  );
};

export const getPaginatedTransactionsKey = ({
  userId,
  transactionType,
  accountId,
  sortBy,
  sortDirection,
  query,
  pageNumber,
  categoryId,
}: {
  userId: string;
  transactionType?: string;
  accountId?: number;
  sortBy?: string;
  sortDirection?: string;
  query?: string;
  pageNumber?: number;
  categoryId?: number;
}) => {
  return (
    generateCachePrefixWithUserId(
      CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
      userId,
    ) +
    JSON.stringify({
      userId,
      transactionType,
      accountId,
      sortBy,
      sortDirection,
      query,
      pageNumber,
      categoryId,
    })
  );
};

export const mapRedisHashToBudget = (
  budgetFromCache: Record<string, string> | null,
): BudgetWithCategory | null => {
  const mappingConfig = {
    id: (value: string) => Number(value),
    name: (value: string) => value,
    budgetAmount: (value: string) => Number(value),
    spentAmount: (value: string) => Number(value),
    userId: (value: string) => value,
    progress: (value: string) => Number(value),
    category: (value: string) => value as BudgetWithCategory["category"],
    categoryId: (value: string) => Number(value),
    createdAt: (value: string) => new Date(value).toISOString(),
    updatedAt: (value: string) => new Date(value).toISOString(),
  };

  return mapRedisHashToEntity<BudgetWithCategory>(
    budgetFromCache,
    mappingConfig,
  );
};

export const mapRedisHashToGoal = (
  goalFromCache: Record<string, string> | null,
): GoalSelectModel | null => {
  const mappingConfig = {
    id: (value: string) => Number(value),
    name: (value: string) => value,
    goalAmount: (value: string) => Number(value),
    currentAmount: (value: string) => Number(value),
    userId: (value: string) => value,
    createdAt: (value: string) => new Date(value).toISOString(),
    updatedAt: (value: string) => new Date(value).toISOString(),
    progress: (value: string) => Number(value),
  };

  return mapRedisHashToEntity<GoalSelectModel>(goalFromCache, mappingConfig);
};

export const checkRateLimitGeneric = async (key: string) => {
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const checkRateLimit = async (ipAddress: string) => {
  const key = getLoginRateLimitKey(ipAddress);
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const checkIPBasedSendVerificationCodeRateLimit = async (
  ipAddress: string,
) => {
  const key = getSendVerificationCodeRateLimitKey(ipAddress);
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const checkUserIdBasedSendVerificationCodeRateLimit = async (
  userId: string,
) => {
  const key = `${CACHE_PREFIXES.SEND_VERIFICATION_CODE_RATE_LIMIT}:${userId}`;
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const checkSignUpRateLimit = async (
  userId: string,
  ipAddress: string,
) => {
  const key = getSignUpRateLimitKey(userId, ipAddress);
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const verifyVerificationCodeRateLimit = async (ipAddress: string) => {
  const key = getVerifyVerificationCodeRateLimitKey(ipAddress);
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const verifyResetPasswordLinkRequestRateLimit = async (
  ipAddress: string,
) => {
  const key = `${CACHE_PREFIXES.RESET_PASSWORD_LINK_REQUEST_RATE_LIMIT}:${ipAddress}`;
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const checkIpBasedTwoFactorAuthRateLimit = async (ipAddress: string) => {
  const key = `${CACHE_PREFIXES.TWO_FACTOR_AUTH_RATE_LIMIT}:${ipAddress}`;
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};

export const checkUserIdBasedTwoFactorAuthRateLimit = async (
  userId: string,
) => {
  const key = `${CACHE_PREFIXES.TWO_FACTOR_AUTH_RATE_LIMIT}:${userId}`;
  const count = await redisService.incr(key);
  if (count === 1) {
    await redisService.expire(key, 60);
  }
  return count;
};
