"use server";
import { CACHE_PREFIXES, CATEGORY_TYPES } from "@/lib/constants";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { ZodError } from "zod";
import categoryRepository from "@/lib/database/repository/categoryRepository";
import logger from "@/lib/utils/logger";
import redisService from "@/lib/redis/redisService";
import { generateCachePrefixWithUserId } from "@/lib/redis/redisUtils";
import {
  CategoryType,
  CategoryUpdateModel,
  CreateCategoryReturnType,
  DeleteCategoryParams,
  GetCategoriesByTypeReturnType,
  GetPaginatedCategoriesParams,
  GetPaginatedCategoriesReturnType,
  UpdateCategoryReturnType,
} from "@/typings/categories";
import { authenticatedAction } from "@/lib/auth/authUtils";

export const getPaginatedCategories = authenticatedAction<
  GetPaginatedCategoriesReturnType,
  GetPaginatedCategoriesParams
>(async ({ pageNumber, query, type }, { user }) => {
  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  try {
    const { categories, totalCount } = await categoryRepository.getMultiple({
      page: pageNumber,
      query,
      type,
      userId: user.id,
    });

    if (categories.length === 0) {
      return {
        categories: [],
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
        totalPages: 1,
      };
    }

    return {
      categories,
      hasNextPage: totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  } catch (error) {
    logger.error(`getPaginatedCategories error: ${error}`);
    return {
      categories: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }
});

export const createCategory = authenticatedAction<
  CreateCategoryReturnType,
  CategorySchemaType
>(async (values, { user }) => {
  try {
    const validatedData = categorySchema.parse(values);

    const categoryDto = {
      ...validatedData,
      userId: user.id,
    };

    const [response] = await categoryRepository.createCategory(categoryDto);

    if (!response.insertId) {
      return {
        error:
          "Something went wrong while creating a category. Please try again later.",
        fieldErrors: [],
      };
    }

    const [category] = await categoryRepository.getCategory(response.insertId);

    return {
      data: category,
    };
  } catch (error) {
    logger.error(`createCategory error: ${error}`);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    if (error instanceof Error) {
      if ("code" in error && error.code === "ER_DUP_ENTRY") {
        const entity =
          values.type === CATEGORY_TYPES.BUDGET ? "Budget" : "Transaction";

        return {
          error: `${entity} Category: ${values.name} already exists.`,
          fieldErrors: [
            { field: "name", message: `${entity} Category already exists.` },
          ],
        };
      }
    }

    return {
      error:
        "Something went wrong. While creating a category. Please try again later.",
      fieldErrors: [],
    };
  }
});

export const getCategoriesByType = authenticatedAction<
  GetCategoriesByTypeReturnType,
  CategoryType
>(async (type, { user }) => {
  try {
    return await categoryRepository.getCategoriesByType(user.id, type);
  } catch (error) {
    logger.error(`getCategoriesByType error: ${error}`);
    return null;
  }
});

export const deleteCategory = authenticatedAction<
  boolean,
  DeleteCategoryParams
>(async ({ id, type }, { user }) => {
  try {
    const [response] = await categoryRepository.deleteCategory(id);

    if (response.affectedRows > 0) {
      let prefix;

      if (type === CATEGORY_TYPES.BUDGET) {
        prefix = generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_BUDGETS,
          user.id
        );
      }

      if (type === CATEGORY_TYPES.TRANSACTION) {
        prefix = generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id
        );
      }

      await redisService.invalidateKeysStartingWith(prefix!);
    }

    return response.affectedRows > 0;
  } catch (error) {
    logger.error(`deleteCategory error: ${error}`);
    return false;
  }
});

export const updateCategory = authenticatedAction<
  UpdateCategoryReturnType,
  CategoryUpdateModel
>(async (data, { user }) => {
  try {
    const [response] = await categoryRepository.updateCategory(data);

    if (response.affectedRows === 0) {
      return {
        error:
          "Something went wrong while updating the category. Please try again later.",
        fieldErrors: [],
      };
    }

    await redisService.invalidateKeysStartingWith(
      generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
    );

    return {
      data,
    };
  } catch (error) {
    logger.error(`update category error: ${error}`);

    if (error instanceof Error) {
      if ("code" in error && error.code === "ER_DUP_ENTRY") {
        const entity =
          data.type === CATEGORY_TYPES.BUDGET ? "Budget" : "Transaction";

        return {
          error: `${entity} Category: ${data.name} already exists.`,
          fieldErrors: [
            { field: "name", message: `${entity} Category already exists.` },
          ],
        };
      }
    }

    return {
      error:
        "Something went wrong while updating the category. Please try again later.",
      fieldErrors: [],
    };
  }
});
