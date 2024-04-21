"use server";
import { getUser } from "@/lib/auth/session";
import { CATEGORY_TYPES, PAGE_ROUTES } from "@/lib/constants";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import categoryRepository from "@/lib/database/repository/categoryRepository";
import {
  CategoryType,
  CategoryUpdateModel,
  GetPaginatedCategoriesParams,
  GetPaginatedCategoriesResponse,
} from "@/server/types";
import logger from "@/lib/utils/logger";

export const getPaginatedCategories = async ({
  pageNumber,
  query,
  type,
}: GetPaginatedCategoriesParams): Promise<GetPaginatedCategoriesResponse> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

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
};

export const createCategory = async (
  values: CategorySchemaType
): CategoryModels.CreateCategoryReturnType => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

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
};

export const getCategoriesByType = async (
  type: CategoryType
): CategoryModels.GetCategoriesByTypeReturnType => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    return await categoryRepository.getCategoriesByType(user.id, type);
  } catch (error) {
    logger.error(`getCategoriesByType error: ${error}`);
    return null;
  }
};

export const deleteCategory = async (id: number) => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const [response] = await categoryRepository.deleteCategory(id);
    return response.affectedRows > 0;
  } catch (error) {
    logger.error(`deleteCategory error: ${error}`);
    return false;
  }
};

export const updateCategory = async (data: CategoryUpdateModel) => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const [response] = await categoryRepository.updateCategory(data);

    if (response.affectedRows === 0) {
      return {
        error:
          "Something went wrong while updating the category. Please try again later.",
        fieldErrors: [],
      };
    }

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
};
