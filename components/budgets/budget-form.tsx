"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BaseValidatedResponse } from "@/server/types";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import budgetSchema, { BudgetSchemaType } from "@/schemas/budget-schema";
import { createBudget, updateBudget } from "@/server/budget";
import useGenericModalStore from "@/store/genericModalStore";
import { toast } from "sonner";
import { BudgetSelectModel } from "@/lib/database/schema";
import CurrencyFormLabel from "@/components/ui/currency-form-label";
import useCategoriesStore from "@/store/categoriesStore";
import { CATEGORY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils/stringUtils/cn";
import { getCategoriesByType } from "@/server/category";
import Combobox from "@/components/ui/combobox";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import CreateBudgetCategoryPopover from "@/components/budgets/create-budget-category-popover";

type BudgetFormProps = {
  data?: BudgetSelectModel;
};

const BudgetForm = ({ data: budgetToBeUpdated }: BudgetFormProps) => {
  const [isPending, startTransition] = useTransition();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
  const router = useRouter();
  const form = useForm<BudgetSchemaType>({
    resolver: zodResolver(budgetSchema),
  });
  const budgetCategories = useCategoriesStore(
    (state) => state.categories
  ).filter((category) => category.type === CATEGORY_TYPES.BUDGET);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  const entityId = budgetToBeUpdated?.id;

  useEffect(() => {
    startTransition(async () => {
      const budgetCategories = await getCategoriesByType(CATEGORY_TYPES.BUDGET);
      if (!budgetCategories) {
        toast.error(
          "There was an error while getting budget categories. Please try again later."
        );
        return;
      }

      setCategories(budgetCategories);
    });
  }, [setCategories]);

  useEffect(() => {
    if (budgetToBeUpdated) {
      const keys = Object.keys(budgetToBeUpdated) as (keyof BudgetSchemaType)[];

      if (keys.length) {
        keys.forEach((key) => {
          form.setValue(key, budgetToBeUpdated[key]);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetToBeUpdated]);

  const handleFormSubmit = async (values: BudgetSchemaType) => {
    if (isPending) return;
    if (entityId && compareMatchingKeys(budgetToBeUpdated, values)) {
      toast.info("No changes detected.", {
        description: "You haven't made any changes to the budget.",
      });
      return;
    }

    startTransition(async () => {
      let result;
      if (entityId) {
        result = await updateBudget(entityId, values);
      } else {
        result = await createBudget(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<BudgetSelectModel>
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
        create: "Your budget has been created.",
        update: "Your budget has been updated.",
      };
      router.refresh();
      toast.success("Success!", {
        description: successMessage[entityId ? "update" : "create"],
      });
      closeGenericModal();
    }
  };

  const renderSubmitButtonContent = () => {
    if (form.formState.isSubmitting || isPending) {
      return "Submitting...";
    }

    return entityId ? "Update Budget" : "Create Budget";
  };

  const budgetCategoryOptions = budgetCategories.map((category) => ({
    label: category.name,
    value: category.name,
  }));

  const isBudgetCategoryListEmpty = budgetCategories.length === 0;

  return (
    <Form {...form}>
      <form
        id="budget-form"
        role="form"
        name="budget-form"
        aria-label="Budget Form"
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Name</FormLabel>
              <FormControl>
                <Input placeholder="Give your budget a name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budgetAmount"
          render={({ field }) => (
            <FormItem>
              <CurrencyFormLabel label="Budget Amount" />
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter the budget amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="spentAmount"
          render={({ field }) => (
            <FormItem>
              <CurrencyFormLabel label="Spent Amount" />
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter the spent amount (optional)"
                  step="0.01"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Category</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  <Combobox
                    key={JSON.stringify(
                      form.watch("category") + budgetCategories
                    )}
                    ref={field.ref}
                    options={budgetCategoryOptions}
                    contentClassName="z-[100]"
                    defaultOption={budgetCategoryOptions.find(
                      (category) => category.value === form.watch("category")
                    )}
                    triggerClassName={cn(
                      "focus:outline focus:outline-1 focus:outline-offset-1 focus:outline-destructive",
                      !isPending && isBudgetCategoryListEmpty && "hidden"
                    )}
                    triggerPlaceholder="Select a budget category"
                    onSelect={(option) => field.onChange(option.value)}
                  />
                  {!isPending && isBudgetCategoryListEmpty && (
                    <p className="text-muted-foreground mr-auto">
                      Looks like there are no budget categories yet.
                    </p>
                  )}
                  <CreateBudgetCategoryPopover
                    onSave={(values) => {
                      field.onChange(values.name);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting || isPending}
        >
          {renderSubmitButtonContent()}
        </Button>
      </form>
    </Form>
  );
};

export default BudgetForm;
