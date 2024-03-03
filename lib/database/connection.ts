import mysql from "mysql2";

export const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "password123",
  port: 3306,
  database: "cashstash_dev",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  namedPlaceholders: true,
  multipleStatements: true,
});

const asyncPool = pool.promise();

export default asyncPool;
