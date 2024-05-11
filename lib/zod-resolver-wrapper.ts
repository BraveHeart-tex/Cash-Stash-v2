import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Resolver } from "react-hook-form";
import * as z from "zod";

const useZodResolver = (
  schema: z.ZodSchema
): Resolver<z.infer<typeof schema>> => {
  const t = useTranslations("Zod.ErrorMap");

  const customErrorMap: z.ZodErrorMap = (error) => {
    let message = "";

    switch (error.code) {
      case z.ZodIssueCode.invalid_type:
        if (error.received === z.ZodParsedType.undefined) {
          message = t("required");
        }

        if (error.received === z.ZodParsedType.nan) {
          message = t("invalidNumber");
        }
    }

    return { message };
  };

  z.setErrorMap(customErrorMap);

  return zodResolver(schema, { errorMap: customErrorMap });
};

export default useZodResolver;
