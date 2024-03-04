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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formHasChanged, generateReadbleEnumLabels } from "@/lib/utils";
import { Budget, BudgetCategory } from "@prisma/client";
import { IValidatedResponse } from "@/actions/types";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import budgetSchema, { BudgetSchemaType } from "@/schemas/budget-schema";
import { createBudget, updateBudget } from "@/actions/budget";
import useGenericModalStore from "@/store/genericModalStore";

interface IBudgetFormProps {
  data?: Budget;
}

const BudgetForm: React.FC<IBudgetFormProps> = ({
  data: budgetToBeUpdated,
}) => {
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
  const router = useRouter();
  const form = useForm<BudgetSchemaType>({
    resolver: zodResolver(budgetSchema),
  });
  const entityId = budgetToBeUpdated?.id;

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
    if (entityId && formHasChanged(budgetToBeUpdated, values)) {
      showDefaultToast(
        "No changes detected.",
        "You haven't made any changes to the budget."
      );
      return;
    }

    let result;
    if (entityId) {
      result = await updateBudget(entityId, values);
    } else {
      result = await createBudget(values);
    }

    processFormErrors(result);
  };

  const processFormErrors = (result: IValidatedResponse<Budget>) => {
    if (result.fieldErrors.length) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });
    }

    if (result.error) {
      showErrorToast("An error occurred.", result.error);
    } else {
      const successMessage = {
        create: "Your budget has been created.",
        update: "Your budget has been updated.",
      };
      router.refresh();
      showSuccessToast(
        "Success!",
        successMessage[entityId ? "update" : "create"]
      );
      closeGenericModal();
    }
  };

  const selectOptions = generateReadbleEnumLabels({ enumObj: BudgetCategory });

  const renderSubmitButtonContent = () => {
    if (form.formState.isSubmitting) {
      return "Submitting...";
    }

    return entityId ? "Update" : "Create";
  };

  return (
    <Form {...form}>
      <form
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
              <FormLabel>Budget Amount</FormLabel>
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
              <FormLabel>Spent Amount</FormLabel>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={budgetToBeUpdated?.category || field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an budget category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {renderSubmitButtonContent()}
        </Button>
      </form>
    </Form>
  );
};

export default BudgetForm;
