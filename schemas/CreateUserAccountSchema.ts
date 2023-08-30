import { z } from "zod";

const CreateUserAccountSchema = z.object({
  balance: z.coerce.number(),
  category: z.string().nonempty("Acconut Category is required"),
  name: z.string().nonempty("Account Name is required"),
});

export type CreateUserAccountSchemaType = z.infer<
  typeof CreateUserAccountSchema
>;
export default CreateUserAccountSchema;
