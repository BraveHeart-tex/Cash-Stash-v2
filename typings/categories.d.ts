import type { CATEGORY_TYPES } from "@/lib/constants";
import type {
  CategoryInsertModel,
  CategorySelectModel,
} from "@/lib/database/schema";
import type {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  FieldError,
} from "@/typings/baseTypes";

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

export type CreateCategoryReturnType =
  | CreateCategorySuccessResponse
  | CreateCategoryErrorResponse;

type CreateCategorySuccessResponse = {
  data: CategorySelectModel;
};

type CreateCategoryErrorResponse = {
  error: string;
  fieldErrors: FieldError[];
};

export type GetCategoriesByTypeReturnType = CategorySelectModel[] | null;

type UpdateCategorySuccessResponse = {
  data: CategoryUpdateModel;
};

type UpdateCategoryErrorResponse = {
  error: string;
  fieldErrors: FieldError[];
};

export type UpdateCategoryReturnType =
  | UpdateCategorySuccessResponse
  | UpdateCategoryErrorResponse;

export type GetPaginatedCategoriesReturnType = BasePaginatedResponse & {
  categories: CategorySelectModel[];
};

export type CategoryUpdateModel = Required<Pick<CategoryInsertModel, "id">> &
  Partial<Omit<CategoryInsertModel, "id">>;

export type GetPaginatedCategoriesParams = BasePaginatedActionParams & {
  type?: CategoryType;
};

export type DeleteCategoryParams = {
  id: number;
  type: CategoryType;
};
