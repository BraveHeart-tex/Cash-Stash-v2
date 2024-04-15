import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORY_TYPES } from "@/lib/constants";
import { createCategory } from "@/server/category";
import { toast } from "sonner";
import { CategorySelectModel } from "@/lib/database/schema";

const BudgetCategoryForm = ({
  afterSave,
}: {
  // eslint-disable-next-line no-unused-vars
  afterSave?: (values: CategorySelectModel) => void;
}) => {
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
      if ("data" in response) {
        afterSave?.(response.data);
      }

      processFormSubmissionResult(response);
    });
  };

  const processFormSubmissionResult = (
    result: Awaited<ReturnType<typeof createCategory>>
  ) => {
    if ("fieldErrors" in result) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });

      return toast.error("An error occurred.", {
        description: result.error,
      });
    }

    toast.success("Success!", {
      description: "Category has been created.",
    });
  };

  // stops the parent form from submitting
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      if (typeof event.preventDefault === "function") {
        event.preventDefault();
      }

      if (typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
    }

    return form.handleSubmit(handleFormSubmit)(event);
  };

  return (
    <Form {...form}>
      <form
        id="budget-category-form"
        role="form"
        name="budget-category-form"
        aria-label="Budget Form"
        onSubmit={onSubmit}
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
