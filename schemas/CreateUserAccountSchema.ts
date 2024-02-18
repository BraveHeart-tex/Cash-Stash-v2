import { AccountCategory } from "@prisma/client";
import { z } from "zod";

const accountSchema = z.object({
  balance: z.coerce.number().default(0),
  category: z.nativeEnum(AccountCategory, {
    invalid_type_error: "Invalid account category",
    required_error: "Account Category is required",
  }),
  name: z.string().nonempty("Account Name cannot be blank"),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;
export default accountSchema;
