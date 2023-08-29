import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email("Geçerli bir email adresi giriniz."),
  password: z.string().min(8).max(100),
  img: z.string().url().optional(),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export default RegisterSchema;
