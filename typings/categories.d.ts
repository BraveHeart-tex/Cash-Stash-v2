import { CategorySelectModel } from "@/lib/database/schema";
import { CategoryUpdateModel, FieldError } from "@/server/types";

export type CreateCategoryReturnType = Promise<
  CreateCategorySuccessResponse | CreateCategoryErrorResponse
>;

type CreateCategorySuccessResponse = {
  data: CategorySelectModel;
};

type CreateCategoryErrorResponse = {
  error: string;
  fieldErrors: FieldError[];
};

export type GetCategoriesByTypeReturnType = Promise<
  CategorySelectModel[] | null
>;

type UpdateCategorySuccessResponse = {
  data: CategoryUpdateModel;
};

type UpdateCategoryErrorResponse = {
  error: string;
  fieldErrors: FieldError[];
};

export type UpdateCategoryReturnType = Promise<
  UpdateCategorySuccessResponse | UpdateCategoryErrorResponse
>;
