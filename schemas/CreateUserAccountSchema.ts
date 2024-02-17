import { z } from "zod";

const CreateUserAccountSchema = z.object({
  balance: z.coerce.number().superRefine((val, ctx) => {
    if (val < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Balance cannot be less than 0",
        path: [],
      });
      return false;
    }
    return true;
  }),
  category: z.string().nonempty("Acconut Category is required"),
  name: z.string().nonempty("Account Name is required"),
});

export type CreateUserAccountSchemaType = z.infer<
  typeof CreateUserAccountSchema
>;
export default CreateUserAccountSchema;
