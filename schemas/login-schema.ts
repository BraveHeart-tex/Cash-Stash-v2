import { z } from "zod";
import registerSchema from "./register-schema";

const loginSchema = registerSchema.pick({
  email: true,
  password: true,
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export default loginSchema;
