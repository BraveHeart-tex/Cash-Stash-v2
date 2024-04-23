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
import { BaseValidatedResponse } from "@/server/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import transactionSchema, {
  TransactionSchemaType,
} from "@/schemas/transaction-schema";
import { getCurrentUserAccounts } from "@/server/account";
import { createTransaction, updateTransaction } from "@/server/transaction";
import useGenericModalStore from "@/store/genericModalStore";
import { toast } from "sonner";
import {
  AccountSelectModel,
  TransactionSelectModel,
} from "@/lib/database/schema";
import CurrencyFormLabel from "@/components/ui/currency-form-label";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import useCategoriesStore from "@/store/categoriesStore";
import { CATEGORY_TYPES } from "@/lib/constants";
import { getCategoriesByType } from "@/server/category";
import CreateTransactionCategoryPopover from "@/components/transactions/create-transaction-category-popover";
import Combobox from "@/components/ui/combobox";
import { cn } from "@/lib/utils/stringUtils/cn";
import { FaMinus, FaPlus } from "react-icons/fa";

type TransactionFormProps = {
  data?: TransactionSelectModel;
};

const TransactionForm = ({
  data: transactionToBeUpdated,
}: TransactionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
  const [accounts, setAccounts] = useState<AccountSelectModel[]>([]);
  const router = useRouter();
  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
  });
  const transactionsCategories = useCategoriesStore(
    (state) => state.categories
  ).filter((category) => category.type === CATEGORY_TYPES.TRANSACTION);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const entityId = transactionToBeUpdated?.id;

  useEffect(() => {
    if (transactionToBeUpdated) {
      setDefaultFormValues(transactionToBeUpdated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionToBeUpdated]);

  useEffect(() => {
    startTransition(async () => {
      const [accounts, transactionCategories] = await Promise.all([
        getCurrentUserAccounts(),
        getCategoriesByType(CATEGORY_TYPES.TRANSACTION),
      ]);

      if (!transactionCategories) {
        toast.error(
          "There was an error while getting budget categories. Please try again later."
        );
        return;
      }

      if (accounts.length === 0) {
        toast.error("No accounts found.", {
          description:
            " Please create an account first to create a transaction.",
        });
        return;
      }

      setCategories(transactionCategories);
      setAccounts(accounts);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDefaultFormValues = (
    transactionToBeUpdated: TransactionSelectModel
  ) => {
    const keys = Object.keys(
      transactionToBeUpdated ?? {}
    ) as (keyof TransactionSchemaType)[];
    if (keys.length) {
      keys.forEach((key) => {
        form.setValue(key, transactionToBeUpdated[key]);
      });
    }
  };

  const handleFormSubmit = async (values: TransactionSchemaType) => {
    if (entityId && compareMatchingKeys(transactionToBeUpdated, values)) {
      toast.info("No changes detected.", {
        description: "You haven't made any changes to the transaction.",
      });
      return;
    }

    startTransition(async () => {
      let result;
      if (entityId) {
        result = await updateTransaction(
          entityId,
          values,
          transactionToBeUpdated
        );
      } else {
        result = await createTransaction(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<TransactionSelectModel>
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
        create: "Transaction has been created.",
        update: "Transaction has been updated.",
      };
      router.refresh();
      toast.success("Success!", {
        description: successMessage[entityId ? "update" : "create"],
      });
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
              <FormLabel>Account</FormLabel>
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
                        loadingAccounts ? "Loading..." : "Select an account"
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
              <CurrencyFormLabel label="Amount" />
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
                    name="toggle-amount-sign"
                    size="icon"
                    className="absolute left-0"
                    onClick={() => {}}
                  >
                    {Math.sign(field.value) === -1 ? <FaMinus /> : <FaPlus />}
                  </Button>
                  <Input
                    placeholder="Transaction amount"
                    type="number"
                    className="pl-10"
                    step={"0.01"}
                    {...field}
                  />
                </div>
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
              <FormLabel>Category</FormLabel>
              <div className="flex items-center gap-1">
                <Combobox
                  key={JSON.stringify(
                    form.watch("categoryId")?.toString() +
                      transactionsCategories
                  )}
                  ref={field.ref}
                  options={transactionCategoryOptions}
                  contentClassName="z-[100]"
                  defaultOption={transactionCategoryOptions.find(
                    (category) => +category.value === form.watch("categoryId")
                  )}
                  triggerClassName={cn(
                    "focus:outline focus:outline-1 focus:outline-offset-1 focus:outline-destructive",
                    !isPending && isTransactionCategoryListEmpty && "hidden"
                  )}
                  triggerPlaceholder="Select a category"
                  onSelect={(option) => {
                    field.onChange(+option.value);
                  }}
                />
                {!isPending && isTransactionCategoryListEmpty && (
                  <p className="mr-auto text-muted-foreground">
                    Looks like there are no transaction categories yet.
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder={"Description to add to this transaction"}
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
          aria-label="Submit transaction form"
          loading={form.formState.isSubmitting || isPending}
          disabled={form.formState.isSubmitting || isPending}
        >
          {!entityId ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
