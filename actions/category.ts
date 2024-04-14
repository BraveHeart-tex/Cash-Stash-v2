"use server";

import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import categoryRepository from "@/lib/database/repository/categoryRepository";

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
        error:
          "Something went wrong while creating a category. Please try again later.",
        fieldErrors: [],
      };
    }

    return {
      data: {
        id: response.insertId,
        ...categoryDto,
      },
      fieldErrors: [],
      error: "",
    };
  } catch (error) {
    console.log("ERROR CREATING CATEGORY", error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "Something went wrong. While creating a category. Please try again later.",
      fieldErrors: [],
    };
  }
};
