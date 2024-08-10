import { db } from "@/lib/database/connection";
import { migrate } from "drizzle-orm/mysql2/migrator";

const migrateSchemaChanges = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "./lib/database/migrations",
    });
    console.info("Migrations completed successfully");
  } catch (error) {
    console.error("migrateSchemaChanges error", error);
  } finally {
    process.exit(0);
  }
};

migrateSchemaChanges();
