import redis from "@/lib/redis/redisConnection";

const redisService = {
  hset: async (key: string, object: Record<string, any>) => {
    return redis.hset(key, object);
  },

  hgetall: async (key: string) => {
    return redis.hgetall(key);
  },

  get: async (key: string) => {
    return redis.get(key);
  },

  del: async (key: string) => {
    return redis.del(key);
  },

  set: async (
    key: string,
    data: string,
    secondsToken?: "EX" | "PX" | "NX" | "XX",
    seconds?: number
  ) => {
    if (!secondsToken || !seconds) {
      return redis.set(key, data);
    }

    return redis.set(key, data, secondsToken as any, seconds);
  },

  invalidateKeysByPrefix: async (prefix: string) => {
    const keys = await redis.keys("*");
    const keysToDelete = keys.filter((key) => key.startsWith(prefix));
    if (keysToDelete.length === 0) return;
    return redis.del(keysToDelete);
  },

  invalidateMultipleKeysByPrefix: async (prefixes: string[]) => {
    const keys = await redis.keys("*");
    const keysToDelete = keys.filter((key) =>
      prefixes.some((prefix) => key.startsWith(prefix))
    );
    if (keysToDelete.length === 0) return;
    return redis.del(keysToDelete);
  },
};

export default redisService;
