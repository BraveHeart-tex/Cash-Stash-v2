import redis from "@/lib/redis/redisConnection";

const redisService = {
  hset: async (key: string, object: Record<string, any>) => {
    return redis.hset(key, object);
  },

  get: async (key: string) => {
    return redis.get(key);
  },

  invalidateKeysByPrefix: async (prefix: string) => {
    const keys = await redis.keys("*");
    const keysToDelete = keys.filter((key) => key.startsWith(prefix));
    if (keysToDelete.length === 0) return;
    return redis.del(keysToDelete);
  },
};

export default redisService;
