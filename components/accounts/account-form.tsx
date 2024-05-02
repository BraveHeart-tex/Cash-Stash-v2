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
import { useRouter } from "@/navigation";
import { useEffect, useTransition } from "react";
import useGenericModalStore from "@/store/genericModalStore";
import accountSchema, { AccountSchemaType } from "@/schemas/account-schema";
import { toast } from "sonner";
import { AccountSelectModel, accounts } from "@/lib/database/schema";
import CurrencyFormLabel from "@/components/ui/currency-form-label";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import MaskedAmountInput from "@/components/ui/masked-amount-input";
import { BaseValidatedResponse } from "@/typings/baseTypes";
import { useTranslations } from "next-intl";

type AccountFormProps = {
  data?: AccountSelectModel;
  // eslint-disable-next-line no-unused-vars
  afterSave?: (values: AccountSelectModel) => void;
};

const AccountForm = ({
  data: accountToBeUpdated,
  afterSave,
}: AccountFormProps) => {
  const categoryT = useTranslations("Enums.AccountCategory");
  const t = useTranslations("Components.AccountForm");
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
      toast.info(t("noChangesMessage"), {
        description: t("noChangesDescription"),
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
      toast.error(t("anErrorOccurredMessage"), {
        description: result.error,
      });
    } else {
      const successMessage = {
        create: t("createAccountSuccessMessage"),
        update: t("updateAccountSuccessMessage"),
      };
      router.refresh();
      toast.success(t("successTitle"), {
        description: successMessage[entityId ? "update" : "create"],
      });
      closeGenericModal();
      afterSave?.(result.data!);
    }
  };

  const selectOptions = accounts.category.enumValues.map((value) => ({
    label: categoryT(value),
    value,
  }));

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
              <FormLabel>{t("nameField.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("nameField.placeholder")} {...field} />
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
              <FormLabel>{t("typeField.label")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={accountToBeUpdated?.category || field.value}
              >
                <FormControl>
                  <SelectTrigger ref={field.ref}>
                    <SelectValue placeholder={t("typeField.placeholder")} />
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
              <CurrencyFormLabel label={t("balanceField.label")} />
              <FormControl>
                <MaskedAmountInput
                  placeholder={t("balanceField.placeholder")}
                  initialValue={field.value}
                  id="balance"
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
        <Button
          className="w-full"
          type="submit"
          name="submit-account-form-button"
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

export default AccountForm;
