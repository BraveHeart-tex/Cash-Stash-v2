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
import { registerBankAccount, updateBankAccount } from "@/actions/account";
import { IValidatedResponse } from "@/actions/types";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import useGenericModalStore from "@/store/genericModalStore";
import accountSchema, { AccountSchemaType } from "@/schemas/account-schema";
import { toast } from "sonner";
import { AccountSelectModel, accounts } from "@/lib/database/schema";
import { formHasChanged } from "@/lib/utils/objectUtils/formHasChanged";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";

interface IAccountFormProps {
  data?: AccountSelectModel;
}

const AccountForm = ({ data: accountToBeUpdated }: IAccountFormProps) => {
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
        accountToBeUpdated ?? {}
      ) as (keyof AccountSchemaType)[];
      if (keys.length) {
        keys.forEach((key) => {
          form.setValue(key, accountToBeUpdated[key]);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountToBeUpdated]);

  const handleFormSubmit = async (values: AccountSchemaType) => {
    if (entityId && formHasChanged(accountToBeUpdated, values)) {
      // showDefaultToast("No changes detected.", "You haven't made any changes.");
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

      processFormErrors(result);
    });
  };

  const processFormErrors = (
    result: IValidatedResponse<AccountSelectModel>
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

  const renderSubmitButtonContent = () => {
    if (form.formState.isSubmitting || isPending) {
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
                  <SelectTrigger>
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
              <FormLabel>Balance</FormLabel>
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
          disabled={form.formState.isSubmitting || isPending}
        >
          {renderSubmitButtonContent()}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
