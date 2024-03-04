import { SelectQuery } from "@/lib/database/queryUtils";
import { Transaction } from "@/entities/transaction";

const getByAccountId = async (accountId: string) => {
  try {
    const transactions = await SelectQuery<Transaction>(
      `SELECT * FROM TRANSACTION where accountId = :accountId order by createdAt desc limit 10`,
      { accountId }
    );

    return transactions;
  } catch (error) {
    console.error("Error getting account by id", error);
    return [];
  }
};

const transactionRepository = {
  getByAccountId,
};

export default transactionRepository;
