"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useZodResolver from "@/lib/zod-resolver-wrapper";
import { useRouter } from "@/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import CreateTransactionCategoryPopover from "@/components/transactions/create-transaction-category-popover";
import Combobox from "@/components/ui/combobox";
import CurrencyFormLabel from "@/components/ui/currency-form-label";
import MaskedAmountInput from "@/components/ui/masked-amount-input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CATEGORY_TYPES } from "@/lib/constants";
import type {
  AccountSelectModel,
  TransactionSelectModel,
} from "@/lib/database/schema";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import { cn } from "@/lib/utils/stringUtils/cn";
import {
  type TransactionSchemaType,
  getTransactionSchema,
} from "@/schemas/transaction-schema";
import { getCurrentUserAccounts } from "@/server/account";
import { getCategoriesByType } from "@/server/category";
import { createTransaction, updateTransaction } from "@/server/transaction";
import useAuthStore from "@/store/auth/authStore";
import useCategoriesStore from "@/store/categoriesStore";
import useGenericModalStore from "@/store/genericModalStore";
import type { BaseValidatedResponse } from "@/typings/baseTypes";
import { useTranslations } from "next-intl";
import { FaMinus, FaPlus, FaQuestion } from "react-icons/fa";
import { toast } from "sonner";

type TransactionFormProps = {
  data?: TransactionSelectModel;
};

const TransactionForm = ({
  data: transactionToBeUpdated,
}: TransactionFormProps) => {
  const t = useTranslations("Components.TransactionForm");
  const zodT = useTranslations("Zod.Transaction");

  const [isPending, startTransition] = useTransition();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal,
  );
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency,
  );
  const [accounts, setAccounts] = useState<AccountSelectModel[]>([]);
  const router = useRouter();
  const transactionSchema = getTransactionSchema({
    accountRequiredErrorMessage: zodT("accountRequiredErrorMessage"),
    amountInvalidErrorMessage: zodT("amountInvalidErrorMessage"),
    amountRequiredErrorMessage: zodT("amountRequiredErrorMessage"),
    categoryRequiredErrorMessage: zodT("categoryRequiredErrorMessage"),
    descriptionRequiredErrorMessage: zodT("descriptionRequiredErrorMessage"),
    descriptionTooLongErrorMessage: zodT("descriptionTooLongErrorMessage"),
  });
  const form = useForm<TransactionSchemaType>({
    resolver: useZodResolver(transactionSchema),
  });
  const transactionsCategories = useCategoriesStore(
    (state) => state.categories,
  ).filter((category) => category.type === CATEGORY_TYPES.TRANSACTION);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const entityId = transactionToBeUpdated?.id;

  useEffect(() => {
    if (transactionToBeUpdated && Object.keys(transactionToBeUpdated).length) {
      setDefaultFormValues(transactionToBeUpdated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionToBeUpdated, preferredCurrency]);

  useEffect(() => {
    startTransition(async () => {
      const [accounts, transactionCategories] = await Promise.all([
        getCurrentUserAccounts(),
        getCategoriesByType(CATEGORY_TYPES.TRANSACTION),
      ]);

      if (!transactionCategories) {
        toast.error(t("fetchCategoriesErrorMessage"));
        return;
      }

      if (accounts.length === 0) {
        toast.error(t("noAccountsFoundHeading"), {
          description: t("noAccountsFoundDescription"),
        });
        return;
      }

      setCategories(transactionCategories);
      setAccounts(accounts);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDefaultFormValues = (
    transactionToBeUpdated: TransactionSelectModel,
  ) => {
    const keys = Object.keys(
      transactionToBeUpdated ?? {},
    ) as (keyof TransactionSchemaType)[];
    if (keys.length) {
      keys.forEach((key) => {
        form.setValue(key, transactionToBeUpdated[key]);
      });
    }
  };

  const handleFormSubmit = async (values: TransactionSchemaType) => {
    if (entityId && compareMatchingKeys(transactionToBeUpdated, values)) {
      toast.info(t("noChangesMessage"));
      return;
    }

    startTransition(async () => {
      let result;
      if (entityId) {
        result = await updateTransaction({
          transactionId: entityId,
          oldTransaction: transactionToBeUpdated,
          values,
        });
      } else {
        result = await createTransaction(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<TransactionSelectModel>,
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
      toast.error(t("anErrorOccurred"), {
        description: result.error,
      });
    } else {
      const successMessage = t(
        `successMessage.${entityId ? "update" : "create"}`,
      );
      router.refresh();
      toast.success(successMessage);
      closeGenericModal();
    }
  };

  const selectOptions = useMemo(() => {
    return accounts.map((account) => ({
      label: account.name,
      value: account.id,
    }));
  }, [accounts]);

  const loadingAccounts = isPending && accounts.length === 0;

  const transactionCategoryOptions = useMemo(() => {
    return transactionsCategories.map((category) => ({
      label: category.name,
      value: category.id.toString(),
    }));
  }, [transactionsCategories]);

  const isTransactionCategoryListEmpty =
    transactionCategoryOptions.length === 0;

  const renderTooltipTriggerContent = () => {
    const fieldValue = form.watch("amount");

    if (fieldValue === undefined) {
      return <FaQuestion />;
    }

    const isNegative = Math.sign(fieldValue) === -1;

    if (isNegative) {
      return <FaMinus />;
    }

    return <FaPlus />;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("accountIdField.label")}</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={
                  transactionToBeUpdated?.accountId?.toString() ||
                  field.value?.toString()
                }
              >
                <FormControl>
                  <SelectTrigger disabled={loadingAccounts} ref={field.ref}>
                    <SelectValue
                      placeholder={
                        loadingAccounts
                          ? t("accountIdField.loading")
                          : t("accountIdField.placeholder")
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <CurrencyFormLabel label={t("amountField.label")} />
              <FormControl>
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip defaultOpen={false} delayDuration={0}>
                      <TooltipTrigger asChild autoFocus={false}>
                        <Button
                          type="button"
                          name="toggle-amount-sign"
                          size="icon"
                          variant={
                            field.value !== undefined
                              ? Math.sign(field.value) === -1
                                ? "destructive"
                                : "success"
                              : "default"
                          }
                          className={cn(
                            "absolute left-1 top-1 h-7 w-7",
                            field.value !== undefined &&
                              Math.sign(field.value) !== -1 &&
                              "bg-success text-success-foreground",
                          )}
                          onClick={() => {
                            if (field.value === undefined) return;
                            const convertedValue = -1 * field.value;
                            field.onChange(convertedValue);
                          }}
                        >
                          {renderTooltipTriggerContent()}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("amountField.amountSignToggleDescription")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <MaskedAmountInput
                    ref={field.ref}
                    initialValue={field.value}
                    className="pl-10"
                    inputMode="numeric"
                    onMaskedValueChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                {field?.value?.toString() && (
                  <>
                    {t(
                      `amountField.amountSignInformation.${Math.sign(field.value) === -1 ? "expense" : "income"}`,
                    )}
                  </>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("categoryIdField.label")}</FormLabel>
              <div className="flex items-center gap-1">
                <Combobox
                  key={JSON.stringify(
                    form.watch("categoryId")?.toString() +
                      transactionsCategories,
                  )}
                  ref={field.ref}
                  options={transactionCategoryOptions}
                  contentClassName="z-[100]"
                  defaultOption={transactionCategoryOptions.find(
                    (category) => +category.value === form.watch("categoryId"),
                  )}
                  triggerClassName={cn(
                    "focus:outline focus:outline-1 focus:outline-offset-1 focus:outline-destructive",
                    !isPending && isTransactionCategoryListEmpty && "hidden",
                  )}
                  triggerPlaceholder={t("categoryIdField.placeholder")}
                  onSelect={(option) => {
                    field.onChange(+option.value);
                  }}
                />
                {!isPending && isTransactionCategoryListEmpty && (
                  <p className="mr-auto text-muted-foreground">
                    {t("categoryIdField.noCategoriesMessage")}
                  </p>
                )}
                <CreateTransactionCategoryPopover
                  onSave={(values) => {
                    field.onChange(values.id);
                  }}
                />
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("descriptionField.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("descriptionField.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          name="submit-transaction-form-button"
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

export default TransactionForm;
