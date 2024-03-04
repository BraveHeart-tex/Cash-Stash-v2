import {
  ModifyQuery,
  ModifyQueryWithSelect,
  SelectQuery,
} from "@/lib/database/queryUtils";
import { Transaction } from "@/entities/transaction";
import { TransactionDto } from "@/lib/database/dto/transactionDto";
import asyncPool from "@/lib/database/connection";
import { Account } from "@/entities/account";

interface ICreateTransactionReturnType {
  affectedRows: number;
  updatedAccount?: Account;
}

const create = async (
  data: TransactionDto
): Promise<ICreateTransactionReturnType> => {
  try {
    await asyncPool.query("START TRANSACTION;");
    const accountBalanceResponse = await SelectQuery<{ balance: number }>(
      "SELECT balance FROM Account WHERE id = ?",
      [data.accountId]
    );

    if (accountBalanceResponse.length === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        affectedRows: 0,
      };
    }

    const newBalance = accountBalanceResponse[0].balance + data.amount;

    const insertResult = await ModifyQuery(
      "INSERT INTO `Transaction` SET :data",
      {
        data,
      }
    );

    if (insertResult.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        affectedRows: 0,
      };
    }

    const updateAccountResult = await ModifyQueryWithSelect<Account>(
      "UPDATE Account SET balance = :balance WHERE id = :accountId; SELECT * FROM Account WHERE id = :accountId;",
      {
        balance: newBalance,
        accountId: data.accountId,
      }
    );

    if (updateAccountResult.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        affectedRows: 0,
      };
    }

    await asyncPool.query("COMMIT;");

    const { affectedRows, updatedRow: updatedAccount } = updateAccountResult;
    return {
      affectedRows,
      updatedAccount,
    };
  } catch (error) {
    console.error(error);
    return {
      affectedRows: 0,
    };
  }
};

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
  create,
};

export default transactionRepository;
