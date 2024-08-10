import { getPageSizeAndSkipAmount } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { type CategoryInsertModel, categories } from "@/lib/database/schema";
import type { CategoryType, CategoryUpdateModel } from "@/typings/categories";
import { and, eq, like, sql } from "drizzle-orm";

type GetMultipleCategoriesParams = {
  query?: string;
  page: number;
  type?: CategoryType;
  userId: string;
};

const categoryRepository = {
  async createCategory(data: CategoryInsertModel) {
    return await db.insert(categories).values(data);
  },
  async deleteCategory(id: number) {
    return await db.delete(categories).where(eq(categories.id, id));
  },
  async getCategory(id: number) {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
  },
  async getCategoriesByType(userId: string, type: CategoryType) {
    return await db
      .select()
      .from(categories)
      .where(and(eq(categories.userId, userId), eq(categories.type, type)));
  },
  async updateCategory(data: CategoryUpdateModel) {
    return await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, data.id));
  },
  async getCategories(userId: string) {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId));
  },
  async getMultiple({
    query,
    page,
    type,
    userId,
  }: GetMultipleCategoriesParams) {
    const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);

    const categoryTypeCondition = type ? eq(categories.type, type) : undefined;

    const categoriesQuery = db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.userId, userId),
          like(categories.name, `%${query}%`),
          categoryTypeCondition,
        ),
      )
      .limit(pageSize)
      .offset(skipAmount);

    const categoriesCountQuery = db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(categories)
      .where(
        and(
          eq(categories.userId, userId),
          like(categories.name, `%${query}%`),
          categoryTypeCondition,
        ),
      );

    const [categoriesResult, [totalCountResult]] = await Promise.all([
      categoriesQuery,
      categoriesCountQuery,
    ]);

    return {
      categories: categoriesResult,
      totalCount: totalCountResult.count,
    };
  },
};

export default categoryRepository;
