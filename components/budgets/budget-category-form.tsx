import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CATEGORY_TYPES } from "@/lib/constants";
import { createCategory } from "@/actions/category";
import { toast } from "sonner";

const BudgetCategoryForm = ({
  afterSave,
}: {
  // eslint-disable-next-line no-unused-vars
  afterSave?: (values: CategorySchemaType) => void;
}) => {
  // TODO: Delete after editing functionality
  const entityId = null;

  let [isPending, startTransition] = useTransition();
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: CATEGORY_TYPES.BUDGET,
    },
  });

  const handleFormSubmit = (values: CategorySchemaType) => {
    startTransition(async () => {
      const response = await createCategory(values);
      if (!response.error) {
        afterSave?.(values);
      }

      processFormSubmissionResult(response);
    });
  };

  const processFormSubmissionResult = (
    result: Awaited<ReturnType<typeof createCategory>>
  ) => {
    if (result.fieldErrors.length) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });
    }

    if (result.error) {
      toast.error("An error occurred.", {
        description: result.error,
      });
    } else {
      const successMessage = {
        create: "Category has been created.",
        update: "Category budget has been updated.",
      };
      toast.success("Success!", {
        description: successMessage[entityId ? "update" : "create"],
      });
    }
  };

  return (
    <Form {...form}>
      <form
        id="budget-category-form"
        role="form"
        name="budget-category-form"
        aria-label="Budget Form"
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending || form.formState.isSubmitting}
        >
          {isPending ? "Submitting..." : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export default BudgetCategoryForm;
