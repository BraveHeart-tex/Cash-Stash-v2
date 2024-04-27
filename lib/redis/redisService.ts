import Redis from "ioredis";
import logger from "@/lib/utils/logger";

let instance: RedisService;

class RedisService extends Redis {
  private constructor() {
    super(process.env.REDIS_CONNECTION_STRING!);
  }

  static getInstance(): RedisService {
    if (!instance) {
      instance = new RedisService();
    }
    return instance;
  }

  async invalidateKeysByPrefix(prefix: string) {
    const keys = await this.keys("*");
    const keysToDelete = keys.filter((key) => key.startsWith(prefix));
    if (keysToDelete.length === 0) return;
    return this.del(keysToDelete);
  }

  async invalidateMultipleKeysByPrefix(prefixes: string[]) {
    const keys = await this.keys("*");
    const keysToDelete = keys.filter((key) =>
      prefixes.some((prefix) => key.startsWith(prefix))
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
  console.log("redisService client connected.");
});

redisService.on("ready", () => {
  console.log("redisService client is ready.");
});

redisService.on("error", (error) => {
  logger.error("redisService client error", error.message);
});

redisService.on("end", () => {
  console.log("redisService client disconnected.");
});

process.on("SIGINT", () => {
  redisService.quit();
});

export default redisService;
