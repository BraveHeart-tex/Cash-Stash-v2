import { env } from "@/env";
import logger from "@/lib/utils/logger";
import Redis from "ioredis";

let instance: RedisService;

class RedisService extends Redis {
  private constructor() {
    super(env.REDIS_CONNECTION_STRING);
    this.registerEventListeners();
  }

  static getInstance(): RedisService {
    if (!instance) {
      instance = new RedisService();
    }
    return instance;
  }

  private registerEventListeners() {
    this.on("connect", () => {
      logger.info("redisService client connected.");
    });

    this.on("ready", () => {
      logger.info("redisService client is ready.");
    });

    this.on("error", (error) => {
      logger.error("redisService client error", error.message);
    });

    this.on("end", () => {
      logger.info("redisService client disconnected.");
    });

    process.on("SIGINT", () => {
      this.quit();
    });
  }

  private async deleteKeys(keys: string[]) {
    if (keys.length === 0) return;
    await this.del(keys);
  }

  async invalidateKeysStartingWith(prefix: string) {
    try {
      const keys = await this.getKeysMatchingPrefix(prefix);
      this.deleteKeys(keys);
    } catch (error) {
      logger.error(`Failed to invalidate keys with prefix ${prefix}: ${error}`);
    }
  }

  async getKeysMatchingPrefix(prefix: string) {
    const keys: string[] = [];
    let cursor = "0";
    const SCAN_COUNT = 1000;

    do {
      const [newCursor, batchKeys] = await this.scan(
        cursor,
        "MATCH",
        `${prefix}*`,
        "COUNT",
        SCAN_COUNT,
      );
      cursor = newCursor;

      keys.push(...batchKeys);
    } while (cursor !== "0");

    return keys;
  }

  async getKeysMatchingPrefixes(prefixes: string[]) {
    const allKeys = new Set<string>();
    const SCAN_COUNT = 1000;

    for (const prefix of prefixes) {
      let cursor = "0";
      do {
        const [newCursor, keys] = await this.scan(
          cursor,
          "MATCH",
          `${prefix}*`,
          "COUNT",
          SCAN_COUNT,
        );
        cursor = newCursor;
        for (const key of keys) {
          allKeys.add(key);
        }
      } while (cursor !== "0");
    }

    return Array.from(allKeys);
  }

  async invalidateKeysMatchingPrefixes(prefixes: string[]) {
    const keys = await this.getKeysMatchingPrefixes(prefixes);
    if (keys.length === 0) return;
    await this.deleteKeys(keys);
  }

  async invalidateKeysByUserId(userId: string) {
    const stream = this.scanStream();
    const pipeline = this.pipeline();
    stream.on("data", async (keys: string[]) => {
      const keysToDelete = keys.filter((key: string) => key.includes(userId));
      if (keysToDelete.length > 0) {
        for (const key of keysToDelete) {
          pipeline.del(key);
        }
      }
    });

    stream.on("end", async () => {
      await pipeline.exec();
    });

    stream.on("error", (error) => {
      logger.error(
        "Error while scanning keys in invalidateKeysByUserId",
        error,
      );
    });
  }
}

const redisService = RedisService.getInstance();

export default redisService;
