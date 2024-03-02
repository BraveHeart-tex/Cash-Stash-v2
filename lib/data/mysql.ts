import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "password123",
  port: 3306,
  database: "cashstash_dev",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  namedPlaceholders: true,
  multipleStatements: true,
});

export default connection;
