import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_CONNECTION_STRING!);

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
