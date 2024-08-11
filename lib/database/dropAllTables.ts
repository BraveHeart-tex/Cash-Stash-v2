import { db } from "@/lib/database/connection";
import logger from "@/lib/utils/logger";
import { sql } from "drizzle-orm";

const dropAllTables = async () => {
  if (process.env.NODE_ENV !== "development") return;
  await db.transaction(async (trx) => {
    await trx.execute(
      sql`
        START TRANSACTION;
          SET @tables = NULL;
          SELECT GROUP_CONCAT(table_name) INTO @tables
          FROM information_schema.tables
          WHERE table_schema = DATABASE();

          SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
          PREPARE stmt FROM @tables;
          EXECUTE stmt;
          DEALLOCATE PREPARE stmt;
        COMMIT;
      `,
    );
  });
};

dropAllTables()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.info("All tables dropped successfully.");
    process.exit(0);
  });
