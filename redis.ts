import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_CONNECTION_STRING!);

redis.on("connect", () => {
  console.log("Redis connected");
});

export default redis;
