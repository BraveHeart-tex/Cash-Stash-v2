import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(100).describe(`
    type: text,
    label: Full Name,
  `),
  email: z.string().email("Geçerli bir email adresi giriniz.").describe(`
    type: text,
    label: Email,
  `),
  password: z.string().min(8).max(100).describe(`
    type: password,
    label: Password,
  `),
  // img: z.string().url().optional().describe(`
  //   type: text,
  //   label: Profile Picture,
  // `),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export default RegisterSchema;
