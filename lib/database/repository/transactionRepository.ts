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

const update = async (
  oldAccountData: {
    oldAccountId: string;
    oldAmount: number;
    accountId: string;
    amount: number;
  },
  transactionDto: Partial<TransactionDto>
) => {
  try {
    await asyncPool.query("START TRANSACTION;");
    const updatedAccountResponse = await ModifyQuery(
      `UPDATE Account SET balance = balance - :oldAmount WHERE id = :oldAccountId; UPDATE Account SET balance = balance + :amount WHERE id = :accountId;`,
      oldAccountData
    );

    if (updatedAccountResponse.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        affectedRows: 0,
      };
    }

    const updateTransactionResponse = await ModifyQueryWithSelect<Transaction>(
      "UPDATE Transaction SET :validatedData WHERE id = :transactionId; SELECT * FROM Transaction WHERE id = :transactionId;",
      {
        validatedData: transactionDto,
        transactionId: transactionDto.id,
      }
    );

    if (updateTransactionResponse.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        affectedRows: 0,
      };
    }

    await asyncPool.query("COMMIT;");

    const { affectedRows, updatedRow } = updateTransactionResponse;

    return {
      affectedRows,
      updatedRow,
    };
  } catch (error) {
    await asyncPool.query("ROLLBACK;");
    console.error(error);
    return {
      affectedRows: 0,
    };
  }
};

const getByAccountId = async (accountId: string) => {
  try {
    return await SelectQuery<Transaction>(
      `SELECT *
       FROM TRANSACTION
       where accountId = :accountId
       order by createdAt desc
       limit 10`,
      { accountId }
    );
  } catch (error) {
    await asyncPool.query("ROLLBACK;");
    console.error("Error getting account by id", error);
    return [];
  }
};

const deleteById = async (transaction: Transaction) => {
  try {
    await asyncPool.query("START TRANSACTION;");
    const deleteTransactionResult = await ModifyQuery(
      "DELETE FROM Transaction WHERE id = :id;",
      {
        id: transaction.id,
      }
    );

    if (deleteTransactionResult.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        affectedRows: 0,
      };
    }

    const updatedAccountResult = await ModifyQuery(
      "UPDATE Account SET balance = balance - :amount WHERE id = :accountId;",
      {
        amount: transaction.amount,
        accountId: transaction.accountId,
      }
    );

    if (updatedAccountResult.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        affectedRows: 0,
      };
    }

    await asyncPool.query("COMMIT;");

    const { affectedRows } = deleteTransactionResult;

    return {
      affectedRows,
    };
  } catch (error) {
    await asyncPool.query("ROLLBACK;");
    console.error("Error getting account by id", error);
    return {
      affectedRows: 0,
    };
  }
};

const transactionRepository = {
  getByAccountId,
  create,
  update,
  deleteById,
};

export default transactionRepository;
