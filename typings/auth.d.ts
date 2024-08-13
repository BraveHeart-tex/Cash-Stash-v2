import type { User } from "lucia";

export type AuthenticatedFunctionContext = {
  user: User;
};

export type OptionalParameter<T> = T extends undefined
  ? T
  : Partial<ExtractParams<T>>;

// Define a type to extract the parameters type
export type ExtractParams<T> = T extends (
  params: infer P,
  context: AuthenticatedFunctionContext,
) => unknown
  ? P
  : never;

export type AuthenticatedFunction<T, P> = (
  params: P,
  context: AuthenticatedFunctionContext,
) => Promise<T>;

export type ActivateTwoFactorAuthenticationReturnType =
  | {
      error: string;
      successMessage: null;
    }
  | {
      error: null;
      successMessage: string;
    };
