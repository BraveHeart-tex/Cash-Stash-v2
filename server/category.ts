"use server";

import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import categoryRepository from "@/lib/database/repository/categoryRepository";
import { ICategoryType } from "./types";
import { CategorySelectModel } from "@/lib/database/schema";

export const createCategory = async (values: CategorySchemaType) => {
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
        data: null,
        error:
          "Something went wrong while creating a category. Please try again later.",
        fieldErrors: [],
      };
    }

    const [category] = await categoryRepository.getCategory(response.insertId);

    return {
      data: category,
      fieldErrors: [],
      error: "",
    };
  } catch (error) {
    console.log("ERROR CREATING CATEGORY", error);

    if (error instanceof ZodError) {
      return {
        ...processZodError(error),
        data: null,
      };
    }

    if (error instanceof Error) {
      if ("code" in error && error.code === "ER_DUP_ENTRY") {
        return {
          data: null,
          error: `Category: ${values.name} already exists.`,
          fieldErrors: [{ field: "name", message: "Category already exists." }],
        };
      }
    }

    return {
      data: null,
      error:
        "Something went wrong. While creating a category. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const getCategoriesByType = async (
  type: ICategoryType
): Promise<CategorySelectModel[] | null> => {
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
