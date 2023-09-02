import { z } from "zod";
import CreateBudgetSchema from "./CreateBudgetSchema";

const EditBudgetSchema = CreateBudgetSchema;

export type EditBudgetSchemaType = z.infer<typeof EditBudgetSchema>;

export default EditBudgetSchema;
