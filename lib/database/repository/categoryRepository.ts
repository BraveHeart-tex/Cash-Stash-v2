import { and, eq } from "drizzle-orm";
import { db } from "../connection";
import { CategoryInsertModel, categories } from "../schema";
import { CategoryType } from "@/server/types";

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
  async updateCategory(
    data: Required<Pick<CategoryInsertModel, "id">> &
      Partial<Omit<CategoryInsertModel, "id">>
  ) {
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
};

export default categoryRepository;
