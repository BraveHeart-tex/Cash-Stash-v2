import { z } from "zod";

const accountSchema = z.object({
  balance: z.coerce.number(),
  category: z.string().nonempty("Acconut Category is required"),
  name: z.string().nonempty("Account Name is required"),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;
export default accountSchema;
