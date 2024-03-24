import { db } from "@/lib/database/connection";
import { currencies } from "@/lib/database/schema";

const currentRepository = {
  async getCurrencies() {
    return await db.select().from(currencies);
  },
};

export default currentRepository;
