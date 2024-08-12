import type { ZodError } from "zod";

/**
 * Processes a ZodError instance and extracts error information.
 * @param {ZodError} error - The ZodError object to process.
 * @returns An object containing error and fieldErrors properties.
 */
export const processZodError = (error: ZodError) => {
  const fieldErrors = error.flatten().fieldErrors;
  const errorMessages = Object.entries(fieldErrors).map(
    ([_, message]) => `${message}`,
  );

  const errorMessage = errorMessages.join(", ");

  return {
    error: errorMessage,
    fieldErrors: Object.entries(fieldErrors).map(([field, message]) => ({
      field,
      message: message?.join(", "),
    })),
  };
};
