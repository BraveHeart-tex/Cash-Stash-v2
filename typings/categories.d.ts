/* eslint-disable no-unused-vars */
namespace CategoryModels {
  type CreateCategoryReturnType = Promise<
    CreateCategorySuccessResponse | CreateCategoryErrorResponse
  >;

  type CreateCategorySuccessResponse = {
    data: CategorySelectModel;
  };

  type CreateCategoryErrorResponse = {
    error: string;
    fieldErrors: FieldError[];
  };

  type GetCategoriesByTypeReturnType = Promise<CategorySelectModel[] | null>;
}
