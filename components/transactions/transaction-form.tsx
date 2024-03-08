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
import { IValidatedResponse } from "@/actions/types";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import transactionSchema, {
  TransactionSchemaType,
} from "@/schemas/transaction-schema";
import { getCurrentUserAccounts } from "@/actions/account";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import useGenericModalStore from "@/store/genericModalStore";
import { Account } from "@/entities/account";
import { Transaction, TransactionCategory } from "@/entities/transaction";

interface ITransactionFormProps {
  data?: Transaction;
}

const TransactionForm = ({
  data: transactionToBeUpdated,
}: ITransactionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const router = useRouter();
  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
  });
  const entityId = transactionToBeUpdated?.id;

  useEffect(() => {
    if (transactionToBeUpdated) {
      setDefaultFormValues(transactionToBeUpdated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionToBeUpdated]);

  useEffect(() => {
    startTransition(async () => {
      const accounts = await getCurrentUserAccounts();

      if (accounts.length === 0) {
        return showErrorToast(
          "No accounts found.",
          "Please create an account first to create a transaction."
        );
      }

      setAccounts(accounts);
    });
  }, []);

  const setDefaultFormValues = (transactionToBeUpdated: Transaction) => {
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
    if (entityId && formHasChanged(transactionToBeUpdated, values)) {
      showDefaultToast(
        "No changes detected.",
        "You haven't made any changes to the transaction."
      );
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

      processFormErrors(result);
    });
  };

  const processFormErrors = (result: IValidatedResponse<Transaction>) => {
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
        create: "Transaction has been created.",
        update: "Transaction has been updated.",
      };
      router.refresh();
      showSuccessToast(
        "Success!",
        successMessage[entityId ? "update" : "create"]
      );
      closeGenericModal();
    }
  };

  const selectOptions = useMemo(() => {
    return accounts.map((account) => ({
      label: account.name,
      value: account.id,
    }));
  }, [accounts]);

  const categorySelectOptions = generateReadbleEnumLabels({
    enumObj: TransactionCategory,
  });

  const renderSubmitButtonContent = () => {
    if (isPending || form.formState.isSubmitting) {
      return "Submitting...";
    }

    return !entityId ? "Create" : "Update";
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
              <FormLabel>Account</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={transactionToBeUpdated?.accountId || field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
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
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={transactionToBeUpdated?.category || field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorySelectOptions.map((option) => (
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
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Amount"
                  type="number"
                  step={"0.01"}
                  {...field}
                />
              </FormControl>
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
                <Input {...field} />
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

export default TransactionForm;
