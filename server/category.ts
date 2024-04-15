"use server";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import categoryRepository from "@/lib/database/repository/categoryRepository";
import { CategoryType } from "./types";

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
    console.log("ERROR CREATING CATEGORY", error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    if (error instanceof Error) {
      if ("code" in error && error.code === "ER_DUP_ENTRY") {
        return {
          error: `Category: ${values.name} already exists.`,
          fieldErrors: [{ field: "name", message: "Category already exists." }],
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
    return null;
  }
};
