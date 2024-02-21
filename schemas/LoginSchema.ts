import { z } from "zod";
import registerSchema from "./register-schema";

const LoginSchema = registerSchema.pick({
  email: true,
  password: true,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export default LoginSchema;
