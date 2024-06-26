export type BasePaginatedResponse = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
};

export type BasePaginatedActionParams = {
  pageNumber: number;
  query?: string;
};

export type BaseValidatedResponse<T> = {
  data?: T;
  error?: string;
  fieldErrors: FieldError[];
};

export type FieldError = {
  field: string;
  message: string | undefined;
};
