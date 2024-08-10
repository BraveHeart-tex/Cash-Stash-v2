"use client";
import CreateBudgetCategoryPopover from "@/components/budgets/create-budget-category-popover";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import CurrencyFormLabel from "@/components/ui/currency-form-label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MaskedAmountInput from "@/components/ui/masked-amount-input";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { BudgetSelectModel } from "@/lib/database/schema";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import { cn } from "@/lib/utils/stringUtils/cn";
import useZodResolver from "@/lib/zod-resolver-wrapper";
import { useRouter } from "@/navigation";
import {
  type BudgetSchemaType,
  getBudgetSchema,
} from "@/schemas/budget-schema";
import { createBudget, updateBudget } from "@/server/budget";
import { getCategoriesByType } from "@/server/category";
import useCategoriesStore from "@/store/categoriesStore";
import useGenericModalStore from "@/store/genericModalStore";
import type { BaseValidatedResponse } from "@/typings/baseTypes";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type BudgetFormProps = {
  data?: BudgetSelectModel;
};

const BudgetForm = ({ data: budgetToBeUpdated }: BudgetFormProps) => {
  const t = useTranslations("Components.BudgetForm");
  const zodT = useTranslations("Zod.Budget");
  const [isPending, startTransition] = useTransition();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal,
  );
  const router = useRouter();
  const budgetSchema = getBudgetSchema({
    blankName: zodT("blankName"),
    budgetAmountRequired: zodT("budgetAmountRequired"),
    budgetAmountInvalid: zodT("budgetAmountInvalid"),
    budgetAmountPositive: zodT("budgetAmountPositive"),
    budgetCategoryRequired: zodT("budgetCategoryRequired"),
    spentAmountNegative: zodT("spentAmountNegative"),
  });
  const form = useForm<BudgetSchemaType>({
    resolver: useZodResolver(budgetSchema),
  });
  const budgetCategories = useCategoriesStore(
    (state) => state.categories,
  ).filter((category) => category.type === CATEGORY_TYPES.BUDGET);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  const entityId = budgetToBeUpdated?.id;
  const categoryErrorMessage = t("categoryErrorMessage");

  useEffect(() => {
    startTransition(async () => {
      const budgetCategories = await getCategoriesByType(CATEGORY_TYPES.BUDGET);
      if (!budgetCategories) {
        toast.error(categoryErrorMessage);
        return;
      }

      setCategories(budgetCategories);
    });
  }, [setCategories, categoryErrorMessage]);

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
      toast.info(t("noChangesMessage"), {
        description: t("noChangesDescription"),
      });
      return;
    }

    startTransition(async () => {
      let result;
      if (entityId) {
        result = await updateBudget({
          budgetId: entityId,
          ...values,
        });
      } else {
        result = await createBudget(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<BudgetSelectModel>,
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
      toast.error(t("anErrorOccurredMessage"), {
        description: result.error,
      });
    } else {
      const successMessage = {
        create: t("createBudgetSuccessMessage"),
        update: t("updateBudgetSuccessMessage"),
      };
      router.refresh();
      toast.success(successMessage[entityId ? "update" : "create"]);
      closeGenericModal();
    }
  };

  const budgetCategoryOptions = useMemo(() => {
    return budgetCategories.map((category) => ({
      label: category.name,
      value: category.id.toString(),
    }));
  }, [budgetCategories]);

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
              <FormLabel>{t("budgetNameField.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("budgetNameField.placeholder")}
                  {...field}
                />
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
              <CurrencyFormLabel label={t("budgetAmountField.label")} />
              <FormControl>
                <MaskedAmountInput
                  initialValue={field.value}
                  placeholder={t("budgetAmountField.placeholder")}
                  id="budgetAmount"
                  onMaskedValueChange={(value) => {
                    field.onChange(value);
                  }}
                  ref={field.ref}
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
              <CurrencyFormLabel label={t("spentAmountField.label")} />
              <FormControl>
                <MaskedAmountInput
                  placeholder={t("spentAmountField.placeholder")}
                  initialValue={field.value}
                  id="spentAmount"
                  onMaskedValueChange={(value) => {
                    field.onChange(value);
                  }}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("budgetCategoryField.label")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  <Combobox
                    key={JSON.stringify(
                      form.watch("categoryId")?.toString() + budgetCategories,
                    )}
                    ref={field.ref}
                    options={budgetCategoryOptions}
                    contentClassName="z-[100]"
                    defaultOption={budgetCategoryOptions.find(
                      (category) =>
                        +category.value === form.watch("categoryId"),
                    )}
                    triggerClassName={cn(
                      "focus:outline focus:outline-1 focus:outline-offset-1 focus:outline-destructive",
                      !isPending && isBudgetCategoryListEmpty && "hidden",
                    )}
                    triggerPlaceholder={t("budgetCategoryField.placeholder")}
                    onSelect={(option) => {
                      field.onChange(+option.value);
                    }}
                  />
                  {!isPending && isBudgetCategoryListEmpty && (
                    <p className="mr-auto text-muted-foreground">
                      {t("budgetCategoryField.noCategoriesMessage")}
                    </p>
                  )}
                  <CreateBudgetCategoryPopover
                    onSave={(values) => {
                      field.onChange(values.id);
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
          name="submit-budget-form-button"
          aria-label={t(`submitButtonLabel.${entityId ? "update" : "create"}`)}
          loading={isPending}
          disabled={form.formState.isSubmitting || isPending}
        >
          {t(`submitButtonLabel.${entityId ? "update" : "create"}`)}
        </Button>
      </form>
    </Form>
  );
};

export default BudgetForm;
