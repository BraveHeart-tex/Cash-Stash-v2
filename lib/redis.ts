import Redis from "ioredis";
import { CACHE_PREFIXES } from "@/lib/constants";

const redis = new Redis(process.env.REDIS_CONNECTION_STRING!);

export const getAccountKey = (accountId: string) =>
  `${CACHE_PREFIXES.ACCOUNT}:${accountId}`;

export const getTransactionKey = (transactionId: string) => {
  return `${CACHE_PREFIXES.TRANSACTION}:${transactionId}`;
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

export const invalidateCacheKey = async (key: string) => {
  await redis.del(key);
};

export const invalidateCachedPaginatedAccounts = async () => {
  const keys = await redis.keys("*");
  const paginatedAccountKeys = keys.filter((key) =>
    key.startsWith(CACHE_PREFIXES.PAGINATED_ACCOUNTS)
  );
  await redis.del(paginatedAccountKeys);
};

redis.on("connect", () => {
  console.log("Redis client connected.");
});

redis.on("ready", () => {
  console.log("Redis client is ready.");
});

redis.on("error", (error) => {
  console.error("Redis client error", error.message);
});

redis.on("end", () => {
  console.log("Redis client disconnected.");
});

process.on("SIGINT", () => {
  redis.quit();
});

export default redis;
