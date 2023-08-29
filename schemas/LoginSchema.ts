import { z } from "zod";
import RegisterSchema from "./RegisterSchema";

const LoginSchema = RegisterSchema.pick({
  email: true,
  password: true,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export default LoginSchema;
