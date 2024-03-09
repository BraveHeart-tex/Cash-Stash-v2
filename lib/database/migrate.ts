import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "@/lib/database/connection";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "./lib/database/migrations",
    });
    console.log("Migrations complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

main();
