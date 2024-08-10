import logger from "@/lib/utils/logger";
import Redis from "ioredis";

let instance: RedisService;

class RedisService extends Redis {
  private constructor() {
    super(process.env.REDIS_CONNECTION_STRING as string);
  }

  static getInstance(): RedisService {
    if (!instance) {
      instance = new RedisService();
    }
    return instance;
  }

  async invalidateKeysStartingWith(prefix: string) {
    const keys = await this.keys("*");
    const keysToDelete = keys.filter((key) => key.startsWith(prefix));
    if (keysToDelete.length === 0) return;
    return this.del(keysToDelete);
  }

  async invalidateKeysMatchingPrefixes(prefixes: string[]) {
    const keys = await this.keys("*");
    const keysToDelete = keys.filter((key) =>
      prefixes.some((prefix) => key.startsWith(prefix)),
    );
    if (keysToDelete.length === 0) return;
    return this.del(keysToDelete);
  }

  async invalidateKeysByUserId(userId: string) {
    const stream = this.scanStream();
    stream.on("data", async (keys) => {
      const keysToDelete = keys.filter((key: string) => key.includes(userId));
      if (keysToDelete.length === 0) return;
      await this.del(keysToDelete);
    });
  }
}

const redisService = RedisService.getInstance();

redisService.on("connect", () => {
  logger.info("redisService client connected.");
});

redisService.on("ready", () => {
  logger.info("redisService client is ready.");
});

redisService.on("error", (error) => {
  logger.error("redisService client error", error.message);
});

redisService.on("end", () => {
  logger.info("redisService client disconnected.");
});

process.on("SIGINT", () => {
  redisService.quit();
});

export default redisService;
