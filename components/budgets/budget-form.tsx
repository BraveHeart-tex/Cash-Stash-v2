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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IValidatedResponse } from "@/server/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import budgetSchema, { BudgetSchemaType } from "@/schemas/budget-schema";
import { createBudget, updateBudget } from "@/server/budget";
import useGenericModalStore from "@/store/genericModalStore";
import { toast } from "sonner";
import { BudgetSelectModel, CategorySelectModel } from "@/lib/database/schema";
import { formHasChanged } from "@/lib/utils/objectUtils/formHasChanged";
import CurrencyFormLabel from "../ui/currency-form-label";
import { FaPlus } from "react-icons/fa";
import BudgetCategoryForm from "./budget-category-form";
import useCategoriesStore from "@/store/categoriesStore";
import { CATEGORY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils/stringUtils/cn";
import { getCategoriesByType } from "@/server/category";

interface IBudgetFormProps {
  data?: BudgetSelectModel;
}

const CreateBudgetCategoryPopover = ({
  onSave,
}: {
  // eslint-disable-next-line no-unused-vars
  onSave: (values: CategorySelectModel) => void;
}) => {
  const [open, setOpen] = useState(false);
  const addCategory = useCategoriesStore((state) => state.addCategory);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" size="icon">
          <FaPlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[500]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add Budget Category</h4>
            <p className="text-sm text-muted-foreground">
              Add a new budget category by using the form below. Category:
            </p>
          </div>
          <BudgetCategoryForm
            afterSave={(values) => {
              setOpen(false);
              addCategory(values);
              onSave(values);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const BudgetForm = ({ data: budgetToBeUpdated }: IBudgetFormProps) => {
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

  const handleFormSubmit = async (values: BudgetSchemaType, event: any) => {
    const targetForm = event.target.closest("form");

    if (targetForm && targetForm.id === "budget-category-form") {
      return;
    }

    if (entityId && formHasChanged(budgetToBeUpdated, values)) {
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
    result: IValidatedResponse<BudgetSelectModel>
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

    return entityId ? "Update" : "Create";
  };

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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                key={form.watch("category")}
              >
                <FormControl>
                  <div className="flex items-center gap-1">
                    <SelectTrigger
                      ref={field.ref}
                      className={cn(budgetCategories.length === 0 && "hidden")}
                    >
                      <SelectValue placeholder="Select an budget category" />
                    </SelectTrigger>
                    {budgetCategories.length === 0 && (
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
                <SelectContent>
                  {budgetCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
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
          disabled={form.formState.isSubmitting || isPending}
        >
          {renderSubmitButtonContent()}
        </Button>
      </form>
    </Form>
  );
};

export default BudgetForm;
