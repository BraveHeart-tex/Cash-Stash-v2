import { db } from "@/lib/database/connection";
import logger from "@/lib/utils/logger";
import { sql } from "drizzle-orm";

const truncateAllTables = async () => {
  if (process.env.NODE_ENV !== "development") return;
  await db.transaction(async (trx) => {
    await trx.execute(
      sql`
        START TRANSACTION;

        SET FOREIGN_KEY_CHECKS = 0;

        SET @tables = NULL;

        SELECT GROUP_CONCAT('\\\`', TABLE_NAME, '\\\`') INTO @tables
        FROM information_schema.tables
        WHERE table_schema =
            (SELECT DATABASE())
          SET @tables_sql = CONCAT('TRUNCATE TABLE ', REPLACE(@tables, ',', '; TRUNCATE TABLE '), ';');

        PREPARE stmt
        FROM @tables_sql;

        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

        SET FOREIGN_KEY_CHECKS = 1;

        COMMIT;
      `,
    );
  });
};

truncateAllTables()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.info("All tables truncated successfully.");
    process.exit(0);
  });
