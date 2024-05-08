import { CATEGORY_TYPES } from "@/lib/constants";
import {
  CategoryInsertModel,
  CategorySelectModel,
} from "@/lib/database/schema";
import { CategoryUpdateModel, FieldError } from "@/server/types";
import {
  BasePaginatedActionParams,
  BasePaginatedResponse,
} from "@/typings/baseTypes";

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

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

export type GetPaginatedCategoriesReturnType = Promise<
  BasePaginatedResponse & {
    categories: CategorySelectModel[];
  }
>;

export type CategoryUpdateModel = Required<Pick<CategoryInsertModel, "id">> &
  Partial<Omit<CategoryInsertModel, "id">>;

export type GetPaginatedCategoriesParams = BasePaginatedActionParams & {
  type?: CategoryType;
};
