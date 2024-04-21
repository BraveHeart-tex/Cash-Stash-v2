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
import { registerBankAccount, updateBankAccount } from "@/server/account";
import { BaseValidatedResponse } from "@/server/types";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import useGenericModalStore from "@/store/genericModalStore";
import accountSchema, { AccountSchemaType } from "@/schemas/account-schema";
import { toast } from "sonner";
import { AccountSelectModel, accounts } from "@/lib/database/schema";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";
import CurrencyFormLabel from "@/components/ui/currency-form-label";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";

type AccountFormProps = {
  data?: AccountSelectModel;
};

const AccountForm = ({ data: accountToBeUpdated }: AccountFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
  const form = useForm<AccountSchemaType>({
    resolver: zodResolver(accountSchema),
  });
  const entityId = accountToBeUpdated?.id;

  useEffect(() => {
    if (accountToBeUpdated) {
      const keys = Object.keys(
        accountToBeUpdated
      ) as (keyof AccountSchemaType)[];
      keys.forEach((key) => {
        form.setValue(key, accountToBeUpdated[key]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountToBeUpdated]);

  const handleFormSubmit = async (values: AccountSchemaType) => {
    if (entityId && compareMatchingKeys(accountToBeUpdated, values)) {
      toast.info("No changes detected.", {
        description: "You haven't made any changes.",
      });
      return;
    }

    startTransition(async () => {
      let result;

      if (entityId) {
        result = await updateBankAccount({
          ...values,
          accountId: entityId,
        });
      } else {
        result = await registerBankAccount(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<AccountSelectModel>
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
        create: "Your account has been created.",
        update: "Your account has been updated.",
      };
      router.refresh();
      toast.success("Success!", {
        description: successMessage[entityId ? "update" : "create"],
      });
      closeGenericModal();
    }
  };

  const selectOptions = generateOptionsFromEnums(accounts.category.enumValues);

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
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Account name" {...field} />
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
              <FormLabel>Account Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={accountToBeUpdated?.category || field.value}
              >
                <FormControl>
                  <SelectTrigger ref={field.ref}>
                    <SelectValue placeholder="Select an account type" />
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
          name="balance"
          render={({ field }) => (
            <FormItem>
              <CurrencyFormLabel label="Balance" />
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          name="submit-account-form-button"
          aria-label="Submit account form"
          loading={form.formState.isSubmitting || isPending}
          disabled={form.formState.isSubmitting || isPending}
        >
          {entityId ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
