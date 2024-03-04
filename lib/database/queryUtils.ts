import asyncPool from "@/lib/database/connection";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export async function SelectQuery<T>(
  query: string,
  params?: Record<string, any>
): Promise<T[]> {
  const [results] = await asyncPool.query(query, params);

  return results as T[];
}

export async function ModifyQueryWithSelect<T>(
  query: string,
  params?: Record<string, any>
) {
  const [results] = await asyncPool.query<RowDataPacket[]>(query, params);

  const affectedRows = results?.[0]?.affectedRows;
  const updatedRow = results?.[1]?.[0];

  return {
    affectedRows: affectedRows as number,
    updatedRow: updatedRow as T,
  };
}

export async function ModifyQuery(
  queryString: string,
  params?: Record<string, any>
): Promise<ResultSetHeader> {
  const [results] = await asyncPool.query(queryString, params);

  return results as ResultSetHeader;
}
