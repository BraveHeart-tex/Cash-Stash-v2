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
import { accountSchema } from "@/schemas";
import { AccountSchemaType } from "@/schemas/CreateUserAccountSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  areObjectsDeepEqual,
  formHasChanged,
  generateReadbleEnumLabels,
} from "@/lib/utils";
import { Account, AccountCategory } from "@prisma/client";
import { registerBankAccount, updateBankAccount } from "@/actions/account";
import { IValidatedResponse } from "@/actions/types";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { closeGenericModal } from "@/redux/features/genericModalSlice";
import { useEffect } from "react";

interface IAccountFormProps {
  data?: Account;
}

const AccountForm: React.FC<IAccountFormProps> = ({
  data: accountToBeUpdated,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
      showDefaultToast("No changes detected.", "You haven't made any changes.");
      return;
    }

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
  };

  const processFormErrors = (result: IValidatedResponse<Account>) => {
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
        create: "Your account has been created.",
        update: "Your account has been updated.",
      };
      router.refresh();
      showSuccessToast(
        "Success!",
        successMessage[entityId ? "update" : "create"]
      );
      dispatch(closeGenericModal());
    }
  };

  const selectOptions = generateReadbleEnumLabels({ enumObj: AccountCategory });

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
          disabled={form.formState.isSubmitting}
        >
          {renderSubmitButtonContent()}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
