import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: 3306,
  database: process.env.DATABASE_NAME,
  namedPlaceholders: true,
  multipleStatements: true,
});

export const db = drizzle(poolConnection);
